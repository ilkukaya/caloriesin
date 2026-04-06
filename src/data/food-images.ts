/**
 * Food slug to emoji mapping for food image placeholders.
 * Each entry maps a food slug to its representative emoji
 * and a gradient color pair for the placeholder background.
 */

export interface FoodImageData {
  emoji: string;
  gradient: [string, string]; // [from-color, to-color]
}

const foodImages: Record<string, FoodImageData> = {
  // Fruits
  'banana': { emoji: '🍌', gradient: ['#FDE68A', '#F59E0B'] },
  'apple': { emoji: '🍎', gradient: ['#FCA5A5', '#EF4444'] },
  'orange': { emoji: '🍊', gradient: ['#FDBA74', '#F97316'] },
  'strawberry': { emoji: '🍓', gradient: ['#FDA4AF', '#E11D48'] },
  'blueberry': { emoji: '🫐', gradient: ['#A5B4FC', '#6366F1'] },
  'watermelon': { emoji: '🍉', gradient: ['#86EFAC', '#EF4444'] },
  'mango': { emoji: '🥭', gradient: ['#FDE68A', '#F97316'] },
  'pineapple': { emoji: '🍍', gradient: ['#FDE68A', '#CA8A04'] },
  'avocado': { emoji: '🥑', gradient: ['#86EFAC', '#15803D'] },
  'lemon': { emoji: '🍋', gradient: ['#FEF08A', '#EAB308'] },
  'grape': { emoji: '🍇', gradient: ['#C4B5FD', '#7C3AED'] },
  'peach': { emoji: '🍑', gradient: ['#FECDD3', '#FB923C'] },
  'pear': { emoji: '🍐', gradient: ['#BBF7D0', '#86EFAC'] },
  'cherry': { emoji: '🍒', gradient: ['#FCA5A5', '#B91C1C'] },
  'kiwi': { emoji: '🥝', gradient: ['#BBF7D0', '#15803D'] },

  // Vegetables
  'broccoli': { emoji: '🥦', gradient: ['#86EFAC', '#166534'] },
  'spinach': { emoji: '🥬', gradient: ['#86EFAC', '#15803D'] },
  'carrot': { emoji: '🥕', gradient: ['#FDBA74', '#EA580C'] },
  'tomato': { emoji: '🍅', gradient: ['#FCA5A5', '#DC2626'] },
  'potato': { emoji: '🥔', gradient: ['#E8D5B7', '#A16207'] },
  'sweet-potato': { emoji: '🍠', gradient: ['#FDBA74', '#C2410C'] },
  'onion': { emoji: '🧅', gradient: ['#FDE68A', '#CA8A04'] },
  'bell-pepper': { emoji: '🫑', gradient: ['#86EFAC', '#DC2626'] },
  'cucumber': { emoji: '🥒', gradient: ['#BBF7D0', '#16A34A'] },
  'lettuce': { emoji: '🥬', gradient: ['#BBF7D0', '#22C55E'] },
  'kale': { emoji: '🥬', gradient: ['#86EFAC', '#166534'] },
  'cauliflower': { emoji: '🥦', gradient: ['#F5F5F4', '#A8A29E'] },
  'corn': { emoji: '🌽', gradient: ['#FDE68A', '#CA8A04'] },
  'green-beans': { emoji: '🫛', gradient: ['#BBF7D0', '#16A34A'] },
  'mushroom': { emoji: '🍄', gradient: ['#E8D5B7', '#78716C'] },

  // Meats
  'chicken-breast': { emoji: '🍗', gradient: ['#FED7AA', '#EA580C'] },
  'beef-steak': { emoji: '🥩', gradient: ['#FCA5A5', '#991B1B'] },
  'ground-beef': { emoji: '🥩', gradient: ['#FECACA', '#B91C1C'] },
  'pork-chop': { emoji: '🍖', gradient: ['#FED7AA', '#C2410C'] },
  'lamb': { emoji: '🍖', gradient: ['#FECACA', '#991B1B'] },
  'turkey-breast': { emoji: '🦃', gradient: ['#FED7AA', '#A16207'] },
  'bacon': { emoji: '🥓', gradient: ['#FCA5A5', '#B91C1C'] },
  'ham': { emoji: '🍖', gradient: ['#FECDD3', '#E11D48'] },
  'beef-liver': { emoji: '🥩', gradient: ['#FECACA', '#7F1D1D'] },

  // Seafood
  'salmon': { emoji: '🐟', gradient: ['#FDBA74', '#EA580C'] },
  'tuna': { emoji: '🐟', gradient: ['#93C5FD', '#2563EB'] },
  'shrimp': { emoji: '🦐', gradient: ['#FECDD3', '#F97316'] },
  'cod': { emoji: '🐟', gradient: ['#BAE6FD', '#0284C7'] },
  'tilapia': { emoji: '🐟', gradient: ['#BAE6FD', '#0EA5E9'] },
  'crab': { emoji: '🦀', gradient: ['#FCA5A5', '#DC2626'] },
  'lobster': { emoji: '🦞', gradient: ['#FCA5A5', '#B91C1C'] },
  'sardine': { emoji: '🐟', gradient: ['#93C5FD', '#1D4ED8'] },

  // Dairy
  'whole-milk': { emoji: '🥛', gradient: ['#F5F5F4', '#D6D3D1'] },
  'skim-milk': { emoji: '🥛', gradient: ['#EFF6FF', '#BFDBFE'] },
  'cheddar-cheese': { emoji: '🧀', gradient: ['#FDE68A', '#F59E0B'] },
  'mozzarella': { emoji: '🧀', gradient: ['#FEF9C3', '#FDE68A'] },
  'greek-yogurt': { emoji: '🥛', gradient: ['#F5F5F4', '#E7E5E4'] },
  'yogurt': { emoji: '🥛', gradient: ['#FECDD3', '#F5F5F4'] },
  'butter': { emoji: '🧈', gradient: ['#FEF08A', '#FACC15'] },
  'cream-cheese': { emoji: '🧀', gradient: ['#FEF9C3', '#F5F5F4'] },
  'cottage-cheese': { emoji: '🧀', gradient: ['#F5F5F4', '#E7E5E4'] },
  'egg': { emoji: '🥚', gradient: ['#FEF9C3', '#FDE68A'] },

  // Grains
  'white-rice': { emoji: '🍚', gradient: ['#F5F5F4', '#D6D3D1'] },
  'brown-rice': { emoji: '🍚', gradient: ['#E8D5B7', '#A16207'] },
  'quinoa': { emoji: '🌾', gradient: ['#FDE68A', '#A16207'] },
  'oatmeal': { emoji: '🥣', gradient: ['#E8D5B7', '#CA8A04'] },
  'white-bread': { emoji: '🍞', gradient: ['#FED7AA', '#D97706'] },
  'whole-wheat-bread': { emoji: '🍞', gradient: ['#E8D5B7', '#92400E'] },
  'pasta': { emoji: '🍝', gradient: ['#FDE68A', '#D97706'] },
  'couscous': { emoji: '🌾', gradient: ['#FEF08A', '#CA8A04'] },

  // Legumes
  'black-beans': { emoji: '🫘', gradient: ['#57534E', '#1C1917'] },
  'lentils': { emoji: '🫘', gradient: ['#D97706', '#92400E'] },
  'chickpeas': { emoji: '🫘', gradient: ['#FDE68A', '#CA8A04'] },
  'kidney-beans': { emoji: '🫘', gradient: ['#B91C1C', '#7F1D1D'] },
  'peanuts': { emoji: '🥜', gradient: ['#E8D5B7', '#A16207'] },
  'soybeans': { emoji: '🫘', gradient: ['#BBF7D0', '#CA8A04'] },
  'green-peas': { emoji: '🫛', gradient: ['#86EFAC', '#16A34A'] },
  'tofu': { emoji: '🧈', gradient: ['#FEF9C3', '#F5F5F4'] },

  // Nuts & Seeds
  'almonds': { emoji: '🌰', gradient: ['#E8D5B7', '#92400E'] },
  'walnuts': { emoji: '🌰', gradient: ['#D6D3D1', '#78716C'] },
  'cashews': { emoji: '🌰', gradient: ['#FDE68A', '#D97706'] },
  'pistachios': { emoji: '🌰', gradient: ['#BBF7D0', '#16A34A'] },
  'sunflower-seeds': { emoji: '🌻', gradient: ['#FDE68A', '#CA8A04'] },
  'chia-seeds': { emoji: '🌱', gradient: ['#57534E', '#1C1917'] },
  'flaxseed': { emoji: '🌱', gradient: ['#D97706', '#78716C'] },
  'pecans': { emoji: '🌰', gradient: ['#A16207', '#78350F'] },

  // Beverages
  'orange-juice': { emoji: '🧃', gradient: ['#FDBA74', '#F97316'] },
  'apple-juice': { emoji: '🧃', gradient: ['#FDE68A', '#F59E0B'] },
  'coca-cola': { emoji: '🥤', gradient: ['#7F1D1D', '#450A0A'] },
  'coffee-black': { emoji: '☕', gradient: ['#A16207', '#422006'] },
  'green-tea': { emoji: '🍵', gradient: ['#BBF7D0', '#16A34A'] },
  'beer': { emoji: '🍺', gradient: ['#FDE68A', '#D97706'] },
  'red-wine': { emoji: '🍷', gradient: ['#7F1D1D', '#450A0A'] },
  'coconut-water': { emoji: '🥥', gradient: ['#F5F5F4', '#D6D3D1'] },

  // Snacks
  'chocolate-dark': { emoji: '🍫', gradient: ['#78350F', '#422006'] },
  'chocolate-milk': { emoji: '🍫', gradient: ['#A16207', '#78350F'] },
  'ice-cream': { emoji: '🍦', gradient: ['#FECDD3', '#FDE68A'] },
  'potato-chips': { emoji: '🍟', gradient: ['#FDE68A', '#D97706'] },
  'popcorn': { emoji: '🍿', gradient: ['#FEF9C3', '#FDE68A'] },
  'cookies': { emoji: '🍪', gradient: ['#D97706', '#92400E'] },
  'brownie': { emoji: '🍫', gradient: ['#78350F', '#422006'] },
  'granola-bar': { emoji: '🥜', gradient: ['#E8D5B7', '#A16207'] },

  // Condiments
  'ketchup': { emoji: '🍅', gradient: ['#FCA5A5', '#DC2626'] },
  'mustard': { emoji: '🟡', gradient: ['#FDE68A', '#CA8A04'] },
  'mayonnaise': { emoji: '🥄', gradient: ['#FEF9C3', '#FDE68A'] },
  'soy-sauce': { emoji: '🥢', gradient: ['#57534E', '#1C1917'] },
  'olive-oil': { emoji: '🫒', gradient: ['#BBF7D0', '#CA8A04'] },
  'honey': { emoji: '🍯', gradient: ['#FDE68A', '#D97706'] },
  'maple-syrup': { emoji: '🍁', gradient: ['#D97706', '#92400E'] },
  'hot-sauce': { emoji: '🌶️', gradient: ['#FCA5A5', '#DC2626'] },

  // Fast Food
  'big-mac': { emoji: '🍔', gradient: ['#FDE68A', '#D97706'] },
  'french-fries': { emoji: '🍟', gradient: ['#FDE68A', '#F59E0B'] },
  'pizza-pepperoni': { emoji: '🍕', gradient: ['#FCA5A5', '#F97316'] },
  'hot-dog': { emoji: '🌭', gradient: ['#FDE68A', '#EA580C'] },
  'chicken-nuggets': { emoji: '🍗', gradient: ['#FDE68A', '#D97706'] },
  'burrito': { emoji: '🌯', gradient: ['#FDE68A', '#CA8A04'] },
  'taco': { emoji: '🌮', gradient: ['#FDE68A', '#F59E0B'] },
};

/**
 * Get image data for a food slug.
 * Returns undefined if no mapping exists.
 */
export function getFoodImage(slug: string): FoodImageData | undefined {
  return foodImages[slug];
}

/**
 * Get a default placeholder for unmapped foods based on category.
 */
const categoryDefaults: Record<string, FoodImageData> = {
  'Fruits': { emoji: '🍎', gradient: ['#FCA5A5', '#EF4444'] },
  'Vegetables': { emoji: '🥬', gradient: ['#86EFAC', '#16A34A'] },
  'Meats': { emoji: '🍖', gradient: ['#FED7AA', '#EA580C'] },
  'Seafood': { emoji: '🐟', gradient: ['#93C5FD', '#2563EB'] },
  'Dairy': { emoji: '🥛', gradient: ['#F5F5F4', '#D6D3D1'] },
  'Grains': { emoji: '🌾', gradient: ['#FDE68A', '#CA8A04'] },
  'Legumes': { emoji: '🫘', gradient: ['#D97706', '#92400E'] },
  'Nuts & Seeds': { emoji: '🌰', gradient: ['#E8D5B7', '#92400E'] },
  'Beverages': { emoji: '🥤', gradient: ['#BAE6FD', '#0EA5E9'] },
  'Snacks': { emoji: '🍪', gradient: ['#FDE68A', '#D97706'] },
  'Condiments': { emoji: '🧂', gradient: ['#F5F5F4', '#A8A29E'] },
  'Fast Food': { emoji: '🍔', gradient: ['#FDE68A', '#F97316'] },
};

export function getFoodImageOrDefault(slug: string, category?: string): FoodImageData {
  const mapped = foodImages[slug];
  if (mapped) return mapped;

  if (category && categoryDefaults[category]) {
    return categoryDefaults[category];
  }

  return { emoji: '🍽️', gradient: ['#E5E7EB', '#9CA3AF'] };
}

export default foodImages;
