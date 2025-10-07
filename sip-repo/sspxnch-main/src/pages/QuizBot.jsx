import { useState } from 'react';
import { Bot, Send, Coffee, Sparkles } from 'lucide-react';
import { getDrinkRecommendation } from '../lib/gemini';
import { useNavigate } from 'react-router-dom';

const QuizBot = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    temperature: '',
    taste: '',
    type: '',
    snack: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your AI drink assistant. Let me help you find the perfect beverage!' }
  ]);

  const questions = [
    {
      key: 'temperature',
      question: 'Would you prefer a hot or iced drink?',
      options: ['Hot', 'Iced']
    },
    {
      key: 'taste',
      question: 'What flavor profile do you prefer?',
      options: ['Sweet', 'Bitter']
    },
    {
      key: 'type',
      question: 'What type of drink are you in the mood for?',
      options: ['Coffee', 'Tea', 'Non-Coffee', 'Fruit Soda']
    },
    {
      key: 'snack',
      question: 'Would you like a snack with that?',
      options: ['Yes', 'No']
    }
  ];

  const handleAnswer = async (answer) => {
    const currentQuestion = questions[step];
    const newPreferences = { ...preferences, [currentQuestion.key]: answer };
    setPreferences(newPreferences);

    setMessages(prev => [...prev, { type: 'user', text: answer }]);

    if (step < questions.length - 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: questions[step + 1].question }]);
        setStep(step + 1);
      }, 500);
    } else {
      setLoading(true);
      setMessages(prev => [...prev, { type: 'bot', text: 'Let me find the perfect drinks for you...' }]);

      try {
        const result = await getDrinkRecommendation(newPreferences);
        setRecommendations(result.recommendations);

        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: 'Based on your preferences, I recommend:',
            recommendations: result.recommendations
          }]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error getting recommendations:', error);
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'I recommend trying our Okinawa Milk Tea and Spanish Latte!'
        }]);
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setStep(0);
    setPreferences({
      temperature: '',
      taste: '',
      type: '',
      snack: ''
    });
    setRecommendations([]);
    setMessages([
      { type: 'bot', text: 'Hello! I\'m your AI drink assistant. Let me help you find the perfect beverage!' }
    ]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-cafe-darkBrown rounded-full mb-4">
          <Bot size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-cafe-darkBrown mb-2">AI Drink Recommender</h1>
        <p className="text-cafe-lightBrown">Let AI help you discover your perfect drink</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 min-h-[400px] max-h-[500px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-cafe-darkBrown text-white'
                    : 'bg-cafe-beige text-cafe-text'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="flex items-start space-x-2">
                    <Coffee size={16} className="mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p>{message.text}</p>
                      {message.recommendations && (
                        <div className="mt-3 space-y-2">
                          {message.recommendations.map((rec, idx) => (
                            <div
                              key={idx}
                              className="bg-white rounded-lg p-3 shadow-sm flex items-center space-x-2"
                            >
                              <Sparkles size={16} className="text-cafe-amber" />
                              <span className="font-medium text-cafe-darkBrown">{rec}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {message.type === 'user' && <p>{message.text}</p>}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-cafe-beige rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-bounce">
                    <Coffee size={16} />
                  </div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {step < questions.length && !loading && recommendations.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-cafe-darkBrown font-medium mb-4">
            {questions[step].question}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {questions[step].options.map(option => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Send size={16} />
                <span>{option}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 btn-secondary"
          >
            Start Over
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="flex-1 btn-primary"
          >
            View Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizBot;
