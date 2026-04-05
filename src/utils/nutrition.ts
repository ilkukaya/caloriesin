export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  dailyValue?: number;
}

export interface Serving {
  label: string;
  grams: number;
}

export interface Food {
  fdcId: number;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  calories: number;
  protein: number;
  totalFat: number;
  saturatedFat: number;
  carbs: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  nutrients: Nutrient[];
  servings: Serving[];
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  foods: string[]; // slugs
}

export interface SearchEntry {
  slug: string;
  name: string;
  calories: number;
  category: string;
}

// Daily Values for % DV calculations (FDA 2020)
export const DAILY_VALUES: Record<string, number> = {
  'Total Fat': 78,
  'Saturated Fat': 20,
  'Cholesterol': 300,
  'Sodium': 2300,
  'Total Carbohydrate': 275,
  'Dietary Fiber': 28,
  'Protein': 50,
  'Vitamin A': 900,
  'Vitamin C': 90,
  'Vitamin D': 20,
  'Vitamin E': 15,
  'Vitamin K': 120,
  'Thiamin': 1.2,
  'Riboflavin': 1.3,
  'Niacin': 16,
  'Vitamin B6': 1.7,
  'Folate': 400,
  'Vitamin B12': 2.4,
  'Calcium': 1300,
  'Iron': 18,
  'Magnesium': 420,
  'Phosphorus': 1250,
  'Potassium': 4700,
  'Zinc': 11,
  'Copper': 0.9,
  'Manganese': 2.3,
  'Selenium': 55,
};

export function getCalorieBadge(calories: number): { label: string; color: string } {
  if (calories < 40) return { label: 'Very Low Calorie', color: 'bg-green-100 text-green-800' };
  if (calories < 100) return { label: 'Low Calorie', color: 'bg-green-50 text-green-700' };
  if (calories < 250) return { label: 'Moderate Calorie', color: 'bg-yellow-50 text-yellow-700' };
  if (calories < 400) return { label: 'High Calorie', color: 'bg-orange-50 text-orange-700' };
  return { label: 'Very High Calorie', color: 'bg-red-50 text-red-700' };
}

export function calcPercentDV(nutrientName: string, amount: number): number | null {
  const dv = DAILY_VALUES[nutrientName];
  if (!dv) return null;
  return Math.round((amount / dv) * 100);
}

// MET values for common activities
const MET: Record<string, number> = {
  walking: 3.5,
  running: 9.8,
  cycling: 7.5,
  swimming: 5.8,
};

export function calcBurnTime(calories: number, met: number, weightKg = 70): number {
  return Math.round((calories * 60) / ((met * 3.5 * weightKg) / 200));
}

export function getBurnTimes(calories: number) {
  return {
    walking: calcBurnTime(calories, MET.walking),
    running: calcBurnTime(calories, MET.running),
    cycling: calcBurnTime(calories, MET.cycling),
    swimming: calcBurnTime(calories, MET.swimming),
  };
}

export function generateHealthNotes(food: Food): string[] {
  const notes: string[] = [];
  if (food.calories < 50) notes.push(`${food.name} is very low in calories, making it excellent for weight loss.`);
  if (food.calories >= 50 && food.calories < 100) notes.push(`${food.name} is relatively low in calories at ${food.calories} kcal per 100g.`);
  if (food.protein > 20) notes.push(`With ${food.protein}g of protein per 100g, ${food.name} is an excellent protein source.`);
  if (food.fiber > 5) notes.push(`${food.name} is high in dietary fiber (${food.fiber}g), which promotes digestive health and satiety.`);
  if (food.sugar > 15) notes.push(`${food.name} contains ${food.sugar}g of sugar per 100g. People watching sugar intake should consume in moderation.`);
  if (food.totalFat < 3) notes.push(`${food.name} is naturally low in fat.`);
  if (food.totalFat > 20) notes.push(`${food.name} is relatively high in fat at ${food.totalFat}g per 100g.`);
  if (food.sodium > 400) notes.push(`${food.name} is relatively high in sodium. Consider this if you're on a low-sodium diet.`);
  if (food.cholesterol > 100) notes.push(`${food.name} contains ${food.cholesterol}mg of cholesterol per 100g.`);
  if (notes.length === 0) notes.push(`${food.name} provides ${food.calories} calories per 100g with a balanced nutrient profile.`);
  return notes;
}

export function generateFAQ(food: Food) {
  const name = food.name;
  const cal = food.calories;
  const serving = food.servings[0];
  const servingCal = serving ? Math.round((cal * serving.grams) / 100) : cal;

  return [
    {
      question: `How many calories in ${name}?`,
      answer: `${name} contains ${cal} calories per 100 grams.${serving ? ` A ${serving.label} (${serving.grams}g) has approximately ${servingCal} calories.` : ''}`,
    },
    {
      question: `Is ${name} good for weight loss?`,
      answer:
        cal < 100
          ? `Yes, ${name} is relatively low in calories at ${cal} cal per 100g, making it a good choice for weight loss diets.`
          : `${name} has ${cal} calories per 100g, which is ${cal > 250 ? 'relatively high' : 'moderate'}. Portion control is important when including it in a weight loss diet.`,
    },
    {
      question: `How much protein is in ${name}?`,
      answer: `${name} contains ${food.protein}g of protein per 100 grams.`,
    },
    {
      question: `What are the main nutrients in ${name}?`,
      answer: `The main macronutrients in ${name} per 100g are: ${food.protein}g protein, ${food.carbs}g carbohydrates, and ${food.totalFat}g fat.`,
    },
    {
      question: `How many carbs are in ${name}?`,
      answer: `${name} has ${food.carbs}g of carbohydrates per 100 grams, of which ${food.sugar}g is sugar and ${food.fiber}g is dietary fiber.`,
    },
  ];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}
