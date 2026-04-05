#!/usr/bin/env node

/**
 * Fetches food data from the USDA FoodData Central API and generates
 * structured JSON files for the CaloriesIn application.
 *
 * Usage:
 *   USDA_API_KEY=your_key node scripts/fetch-usda-data.mjs
 *
 * Falls back to DEMO_KEY if no API key is provided.
 */

import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const API_KEY = process.env.USDA_API_KEY || "DEMO_KEY";
const BASE_URL = "https://api.nal.usda.gov/fdc/v1/foods/list";
const PAGE_SIZE = 200;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const DATA_TYPES = ["SR Legacy", "Foundation"];

const ROOT_DIR = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  ".."
);
const DATA_DIR = path.join(ROOT_DIR, "src", "data");
const FOODS_DIR = path.join(DATA_DIR, "foods");

// ---------------------------------------------------------------------------
// Nutrient ID mapping (USDA nutrient numbers)
// ---------------------------------------------------------------------------

const NUTRIENT_MAP = {
  1008: { key: "calories", name: "Energy", unit: "kcal" },
  1003: { key: "protein", name: "Protein", unit: "g" },
  1004: { key: "totalFat", name: "Total lipid (fat)", unit: "g" },
  1258: { key: "saturatedFat", name: "Saturated fat", unit: "g" },
  1005: { key: "carbs", name: "Carbohydrate, by difference", unit: "g" },
  1079: { key: "fiber", name: "Fiber, total dietary", unit: "g" },
  1063: { key: "sugar", name: "Sugars, total including NLEA", unit: "g" },
  1093: { key: "sodium", name: "Sodium, Na", unit: "mg" },
  1253: { key: "cholesterol", name: "Cholesterol", unit: "mg" },
};

// Additional nutrients to include in the detailed nutrients array
const EXTRA_NUTRIENTS = {
  1087: { name: "Calcium", unit: "mg" },
  1089: { name: "Iron", unit: "mg" },
  1090: { name: "Magnesium", unit: "mg" },
  1091: { name: "Phosphorus", unit: "mg" },
  1092: { name: "Potassium", unit: "mg" },
  1095: { name: "Zinc", unit: "mg" },
  1098: { name: "Copper", unit: "mg" },
  1101: { name: "Manganese", unit: "mg" },
  1103: { name: "Selenium", unit: "mcg" },
  1106: { name: "Vitamin A", unit: "mcg" },
  1109: { name: "Vitamin E", unit: "mg" },
  1114: { name: "Vitamin D", unit: "mcg" },
  1162: { name: "Vitamin C", unit: "mg" },
  1165: { name: "Thiamin (B1)", unit: "mg" },
  1166: { name: "Riboflavin (B2)", unit: "mg" },
  1167: { name: "Niacin (B3)", unit: "mg" },
  1170: { name: "Pantothenic acid (B5)", unit: "mg" },
  1175: { name: "Vitamin B6", unit: "mg" },
  1177: { name: "Folate", unit: "mcg" },
  1178: { name: "Vitamin B12", unit: "mcg" },
  1185: { name: "Vitamin K", unit: "mcg" },
};

// ---------------------------------------------------------------------------
// Category name normalization
// ---------------------------------------------------------------------------

const CATEGORY_NAME_MAP = {
  "Baked Products": "Baked Goods",
  "Beef Products": "Beef",
  "Beverages": "Beverages",
  "Cereal Grains and Pasta": "Grains & Pasta",
  "Dairy and Egg Products": "Dairy & Eggs",
  "Fats and Oils": "Fats & Oils",
  "Finfish and Shellfish Products": "Fish & Shellfish",
  "Fruits and Fruit Juices": "Fruits",
  "Lamb, Veal, and Game Products": "Lamb & Game",
  "Legumes and Legume Products": "Legumes",
  "Meals, Entrees, and Side Dishes": "Meals & Sides",
  "Nut and Seed Products": "Nuts & Seeds",
  "Pork Products": "Pork",
  "Poultry Products": "Poultry",
  "Restaurant Foods": "Restaurant Foods",
  "Sausages and Luncheon Meats": "Sausages & Deli Meats",
  "Snacks": "Snacks",
  "Soups, Sauces, and Gravies": "Soups & Sauces",
  "Spices and Herbs": "Spices & Herbs",
  "Sweets": "Sweets",
  "Vegetables and Vegetable Products": "Vegetables",
  "Baby Foods": "Baby Foods",
  "American Indian/Alaska Native Foods": "Native American Foods",
  "Breakfast Cereals": "Breakfast Cereals",
  "Fast Foods": "Fast Foods",
  "Frozen Foods": "Frozen Foods",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalize USDA food descriptions into human-readable names.
 * "Chicken, breast, rotisserie, skin not eaten" -> "Chicken Breast Rotisserie"
 */
function normalizeName(description) {
  return description
    .split(",")
    .map((part) => part.trim())
    .filter((part) => {
      const lower = part.toLowerCase();
      // Drop parenthetical qualifiers and preparation notes
      return (
        part.length > 0 &&
        !lower.startsWith("(") &&
        !lower.includes("not eaten") &&
        !lower.includes("not specified") &&
        !lower.includes("ns as to") &&
        !lower.includes("nfs")
      );
    })
    .map((part) =>
      part
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    )
    .join(" ");
}

function normalizeCategoryName(raw) {
  if (!raw) return "Other";
  return CATEGORY_NAME_MAP[raw] || raw;
}

function round(value, decimals = 1) {
  if (value == null || isNaN(value)) return 0;
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// API fetching with retries
// ---------------------------------------------------------------------------

async function fetchPage(pageNumber) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    dataType: DATA_TYPES.join(","),
    pageSize: String(PAGE_SIZE),
    pageNumber: String(pageNumber),
  });

  const url = `${BASE_URL}?${params.toString()}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(
          `HTTP ${response.status}: ${response.statusText} - ${body}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        `  [attempt ${attempt}/${MAX_RETRIES}] Error fetching page ${pageNumber}: ${error.message}`
      );
      if (attempt < MAX_RETRIES) {
        console.log(`  Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await sleep(RETRY_DELAY_MS);
      } else {
        throw new Error(
          `Failed to fetch page ${pageNumber} after ${MAX_RETRIES} attempts: ${error.message}`
        );
      }
    }
  }
}

async function fetchAllFoods() {
  const allFoods = [];
  let pageNumber = 1;

  console.log("Fetching food data from USDA FoodData Central...");
  console.log(`  API Key: ${API_KEY === "DEMO_KEY" ? "DEMO_KEY (rate-limited)" : "custom key"}`);
  console.log(`  Data types: ${DATA_TYPES.join(", ")}`);
  console.log(`  Page size: ${PAGE_SIZE}`);
  console.log("");

  while (true) {
    console.log(`Fetching page ${pageNumber}...`);
    const foods = await fetchPage(pageNumber);

    if (!Array.isArray(foods) || foods.length === 0) {
      console.log(`  Page ${pageNumber} returned no results. Done fetching.`);
      break;
    }

    // Filter to desired data types (double-check since API param may not filter perfectly)
    const filtered = foods.filter((f) => DATA_TYPES.includes(f.dataType));
    console.log(
      `  Received ${foods.length} items, ${filtered.length} match target data types.`
    );

    allFoods.push(...filtered);
    pageNumber++;

    // Small delay to be polite to the API
    await sleep(200);
  }

  console.log(`\nTotal foods fetched: ${allFoods.length}\n`);
  return allFoods;
}

// ---------------------------------------------------------------------------
// Transform USDA food item to our schema
// ---------------------------------------------------------------------------

function transformFood(raw) {
  const name = normalizeName(raw.description || "");
  const rawCategory = raw.foodCategory?.description || raw.foodCategory || null;
  const category = normalizeCategoryName(rawCategory);
  const categorySlug = slugify(category);

  // Build nutrient lookup: nutrientNumber -> amount
  const nutrientLookup = {};
  if (Array.isArray(raw.foodNutrients)) {
    for (const n of raw.foodNutrients) {
      const num = n.nutrientNumber || n.number;
      if (num != null) {
        nutrientLookup[num] = n.value ?? n.amount ?? 0;
      }
    }
  }

  // Extract top-level macros
  const macros = {};
  for (const [numStr, info] of Object.entries(NUTRIENT_MAP)) {
    const num = Number(numStr);
    macros[info.key] = round(nutrientLookup[num] ?? 0);
  }

  // Build detailed nutrients array (vitamins & minerals)
  const nutrients = [];
  for (const [numStr, info] of Object.entries(EXTRA_NUTRIENTS)) {
    const num = Number(numStr);
    const amount = nutrientLookup[num];
    if (amount != null && amount > 0) {
      nutrients.push({
        name: info.name,
        amount: round(amount, 2),
        unit: info.unit,
      });
    }
  }

  // Default servings (the list endpoint doesn't always include portion data)
  const servings = [
    { label: "100g", grams: 100 },
    { label: "1 serving", grams: 100 },
  ];

  return {
    fdcId: raw.fdcId,
    slug: "", // assigned later after deduplication
    name,
    category,
    categorySlug,
    ...macros,
    nutrients,
    servings,
  };
}

// ---------------------------------------------------------------------------
// Slug deduplication
// ---------------------------------------------------------------------------

function assignSlugs(foods) {
  // First pass: generate base slugs and detect duplicates
  const slugCounts = {};
  for (const food of foods) {
    const base = slugify(food.name);
    slugCounts[base] = (slugCounts[base] || 0) + 1;
  }

  // Second pass: assign final slugs, appending fdcId for duplicates
  const usedSlugs = new Set();
  for (const food of foods) {
    let slug = slugify(food.name);

    if (slugCounts[slug] > 1 || usedSlugs.has(slug)) {
      slug = `${slug}-${food.fdcId}`;
    }

    // Safety net: if still a collision, keep appending
    let finalSlug = slug;
    let counter = 2;
    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    usedSlugs.add(finalSlug);
    food.slug = finalSlug;
  }

  return foods;
}

// ---------------------------------------------------------------------------
// File output
// ---------------------------------------------------------------------------

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function generateFiles(foods) {
  console.log("Generating output files...\n");

  ensureDir(DATA_DIR);
  ensureDir(FOODS_DIR);

  // 1. Master foods.json
  const foodsPath = path.join(DATA_DIR, "foods.json");
  writeJSON(foodsPath, foods);
  console.log(`  foods.json: ${foods.length} items -> ${foodsPath}`);

  // 2. Individual food files
  console.log(`  Writing individual food files to ${FOODS_DIR}/`);
  let individualCount = 0;
  for (const food of foods) {
    const filePath = path.join(FOODS_DIR, `${food.slug}.json`);
    writeJSON(filePath, food);
    individualCount++;
  }
  console.log(`  Wrote ${individualCount} individual food files.`);

  // 3. Categories
  const categoryMap = {};
  for (const food of foods) {
    const cat = food.category;
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        name: cat,
        slug: food.categorySlug,
        count: 0,
        foods: [],
      };
    }
    categoryMap[cat].count++;
    categoryMap[cat].foods.push(food.slug);
  }

  const categories = Object.values(categoryMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const categoriesPath = path.join(DATA_DIR, "categories.json");
  writeJSON(categoriesPath, categories);
  console.log(
    `  categories.json: ${categories.length} categories -> ${categoriesPath}`
  );

  // 4. Search index (lightweight)
  const searchIndex = foods.map((f) => ({
    slug: f.slug,
    name: f.name,
    calories: f.calories,
    category: f.category,
  }));

  const searchIndexPath = path.join(DATA_DIR, "search-index.json");
  writeJSON(searchIndexPath, searchIndex);
  console.log(
    `  search-index.json: ${searchIndex.length} entries -> ${searchIndexPath}`
  );

  console.log("\nDone!");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  try {
    const rawFoods = await fetchAllFoods();

    if (rawFoods.length === 0) {
      console.error("No foods were fetched. Exiting.");
      process.exit(1);
    }

    console.log("Transforming food data...");
    let foods = rawFoods.map(transformFood);

    // Sort by name for consistent output
    foods.sort((a, b) => a.name.localeCompare(b.name));

    console.log("Assigning slugs...");
    foods = assignSlugs(foods);

    generateFiles(foods);
  } catch (error) {
    console.error(`\nFatal error: ${error.message}`);
    process.exit(1);
  }
}

main();
