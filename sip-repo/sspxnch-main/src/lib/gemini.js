import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const getDrinkRecommendation = async (preferences) => {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      return {
        recommendations: [
          'Please configure your Gemini API key to get AI recommendations.',
          'Add your key to the .env file as VITE_GEMINI_API_KEY'
        ]
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const menuContext = `
Available Menu:
Milk Tea: Taro, Okinawa, Wintermelon, Brown Sugar, Salted Caramel, Moffee, Cookies n Cream
Iced Coffee: Spanish Latte, Caramel Macchiato, Dark Mocha, Matcha Espresso, Cafe Latte
Espresso (Hot Drinks): Matcha, Chocolate, Red Velvet, Arabica Coffee
Non-Coffee: Red Velvet, Dark Choco, Iced Matcha, Milk Caramel
Fruit Soda: Blue Lemonade, Green Apple, Strawberry, Blueberry, Lemon, Lychee
Snacks: Fish Ball, Mini Hotdogs, Kikiam, Chicken Skin, French Fries
`;

    const prompt = `${menuContext}

Based on these customer preferences:
- Temperature: ${preferences.temperature}
- Taste: ${preferences.taste}
- Type: ${preferences.type}
- Include snack: ${preferences.snack}

Please recommend exactly 2 items from the menu above that match these preferences.
Respond with ONLY the item names, one per line, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const recommendations = text
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 2);

    return {
      recommendations: recommendations.length > 0
        ? recommendations
        : ['Okinawa Milk Tea', 'Spanish Latte']
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      recommendations: [
        'Okinawa Milk Tea',
        'Spanish Latte'
      ]
    };
  }
};
