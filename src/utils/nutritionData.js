export const nutritionByPhase = {
  menstrual: {
    title: 'Menstrual Phase',
    subtitle: 'Days 1–5 • Focus on replenishment',
    icon: '🌺',
    description: 'Your body needs extra iron and anti-inflammatory support. Choose warm, comforting foods.',
    categories: [
      { name: 'Iron-Rich Foods', icon: '🥩', items: ['Red meat', 'Lentils', 'Spinach', 'Dark chocolate', 'Chickpeas', 'Tofu'] },
      { name: 'Anti-Inflammatory', icon: '🍵', items: ['Turmeric', 'Ginger tea', 'Salmon', 'Sardines', 'Walnuts', 'Chia seeds'] },
      { name: 'Comfort & Warmth', icon: '🍲', items: ['Bone broth', 'Soups & stews', 'Oatmeal', 'Sweet potatoes', 'Herbal teas'] },
      { name: 'Magnesium-Rich', icon: '🥜', items: ['Almonds', 'Pumpkin seeds', 'Bananas', 'Avocado', 'Dark chocolate'] },
      { name: 'Hydrating', icon: '💧', items: ['Watermelon', 'Cucumber', 'Coconut water', 'Herbal teas', 'Celery'] }
    ]
  },
  follicular: {
    title: 'Follicular Phase',
    subtitle: 'Days 6–13 • Rising energy',
    icon: '🌱',
    description: 'Energy is rising! Support estrogen metabolism with fresh, light foods and fermented options.',
    categories: [
      { name: 'Light & Fresh', icon: '🥗', items: ['Mixed salads', 'Sauerkraut', 'Kimchi', 'Pickled vegetables', 'Fresh herbs'] },
      { name: 'Lean Proteins', icon: '🍗', items: ['Chicken breast', 'Fish', 'Eggs', 'Sprouted grains', 'Tempeh'] },
      { name: 'Probiotic Foods', icon: '🥛', items: ['Greek yogurt', 'Kefir', 'Kombucha', 'Miso soup', 'Kimchi'] },
      { name: 'Cruciferous Vegetables', icon: '🥦', items: ['Broccoli', 'Cauliflower', 'Brussels sprouts', 'Kale', 'Cabbage'] },
      { name: 'Complex Carbs', icon: '🌾', items: ['Oats', 'Quinoa', 'Brown rice', 'Sweet potatoes', 'Whole grain bread'] }
    ]
  },
  ovulation: {
    title: 'Ovulation Phase',
    subtitle: 'Days 14–16 • Peak energy',
    icon: '🌸',
    description: 'You\'re at peak energy. Support your body with fiber to metabolize estrogen and anti-inflammatory foods.',
    categories: [
      { name: 'Anti-Inflammatory', icon: '🫐', items: ['Berries', 'Turmeric', 'Green tea', 'Extra virgin olive oil', 'Tomatoes'] },
      { name: 'Fiber-Rich', icon: '🥬', items: ['Flaxseeds', 'Whole grains', 'Lentils', 'Artichokes', 'Pears'] },
      { name: 'Raw Fruits & Veggies', icon: '🍓', items: ['Berries', 'Bell peppers', 'Snap peas', 'Carrots', 'Tropical fruits'] },
      { name: 'Light Grains', icon: '🌽', items: ['Quinoa', 'Corn', 'Amaranth', 'Millet', 'Buckwheat'] },
      { name: 'Zinc-Rich', icon: '🦐', items: ['Shellfish', 'Pumpkin seeds', 'Cashews', 'Chickpeas', 'Sesame seeds'] }
    ]
  },
  luteal: {
    title: 'Luteal Phase',
    subtitle: 'Days 17–28 • Support & soothe',
    icon: '🍂',
    description: 'Progesterone rises, and PMS may appear. Focus on serotonin-boosting and bloat-reducing foods.',
    categories: [
      { name: 'Serotonin Boosters', icon: '🍠', items: ['Sweet potatoes', 'Brown rice', 'Whole wheat pasta', 'Bananas', 'Oats'] },
      { name: 'B-Vitamin Foods', icon: '🐔', items: ['Turkey', 'Chicken', 'Sunflower seeds', 'Eggs', 'Nutritional yeast'] },
      { name: 'Magnesium-Rich', icon: '🥬', items: ['Dark leafy greens', 'Pumpkin seeds', 'Dark chocolate', 'Almonds', 'Avocado'] },
      { name: 'Calcium-Rich', icon: '🧀', items: ['Yogurt', 'Cheese', 'Broccoli', 'Almonds', 'Fortified plant milk'] },
      { name: 'Reduce Bloating', icon: '🥒', items: ['Cucumber', 'Watermelon', 'Asparagus', 'Ginger', 'Peppermint tea'] },
      { name: 'Iron Prep', icon: '🥩', items: ['Red meat', 'Spinach', 'Lentils', 'Quinoa', 'Tofu'] }
    ]
  }
}