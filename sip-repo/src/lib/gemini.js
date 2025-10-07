import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const menuItems = {
  'Milk Tea': ['Taro', 'Okinawa', 'Wintermelon', 'Brown Sugar', 'Salted Caramel', 'Moffee', 'Cookies n Cream'],
  'Iced Coffee': ['Spanish Latte', 'Caramel Macchiato', 'Dark Mocha', 'Matcha Espresso', 'Cafe Latte'],
  'Hot Drinks': ['Matcha', 'Chocolate', 'Red Velvet', 'Arabica Coffee'],
  'Non-Coffee': ['Red Velvet (Non-Coffee)', 'Dark Choco', 'Iced Matcha', 'Milk Caramel'],
  'Fruit Soda': ['Blue Lemonade', 'Green Apple', 'Strawberry', 'Blueberry', 'Lemon', 'Lychee'],
  'Snacks': ['Fish Ball', 'Mini Hotdogs', 'Kikiam', 'Chicken Skin', 'French Fries']
};

const fallbackRecommend = (preferences) => {
  const { temperature, taste, type, snack } = preferences;
  let recommendations = [];

  if (temperature === 'Cold' && type === 'Coffee') {
    recommendations.push('Spanish Latte');
  } else if (temperature === 'Cold' && type === 'Tea') {
    recommendations.push('Okinawa');
  } else if (temperature === 'Cold' && type === 'Non-Coffee') {
    recommendations.push('Dark Choco');
  } else if (temperature === 'Cold' && type === 'Fruity') {
    recommendations.push('Strawberry');
  } else if (temperature === 'Hot') {
    recommendations.push('Chocolate');
  } else {
    recommendations.push('Taro');
  }

  if (taste === 'Sweet') {
    recommendations.push('Brown Sugar');
  } else if (taste === 'Creamy') {
    recommendations.push('Salted Caramel');
  } else {
    recommendations.push('Caramel Macchiato');
  }

  if (snack === 'Yes') {
    recommendations.push('French Fries');
  }

  return recommendations.slice(0, 2);
};

export const getDrinkRecommendation = async (preferences) => {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      return {
        recommendations: fallbackRecommend(preferences)
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const menuContext = `
Available Menu:
Milk Tea: ${menuItems['Milk Tea'].join(', ')}
Iced Coffee: ${menuItems['Iced Coffee'].join(', ')}
Hot Drinks: ${menuItems['Hot Drinks'].join(', ')}
Non-Coffee: ${menuItems['Non-Coffee'].join(', ')}
Fruit Soda: ${menuItems['Fruit Soda'].join(', ')}
Snacks: ${menuItems['Snacks'].join(', ')}
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
      .map(line => line.replace(/^[-*•]\s*/, '').trim())
      .slice(0, 2);

    return {
      recommendations: recommendations.length > 0
        ? recommendations
        : fallbackRecommend(preferences)
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      recommendations: fallbackRecommend(preferences)
    };
  }
};
