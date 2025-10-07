import { useNavigate } from 'react-router-dom';
import { Coffee, Users } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1766604/pexels-photo-1766604.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-cafe-darkBrown rounded-full mb-6">
              <Coffee size={48} className="text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-cafe-darkBrown mb-4">
              Sip n Chat AI
            </h1>
            <h2 className="text-2xl md:text-3xl text-cafe-lightBrown font-medium mb-2">
              Management System
            </h2>
            <p className="text-xl text-cafe-text">
              Brewing Data-Driven Decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/menu')}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-cafe-amber rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Coffee size={36} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-cafe-darkBrown mb-2">
                  Customer Kiosk
                </h3>
                <p className="text-cafe-lightBrown">
                  Browse menu and place orders
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin')}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-cafe-darkBrown rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users size={36} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-cafe-darkBrown mb-2">
                  Admin Login
                </h3>
                <p className="text-cafe-lightBrown">
                  Manage inventory and products
                </p>
              </div>
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white bg-opacity-80 rounded-xl p-6">
              <h4 className="font-semibold text-cafe-darkBrown mb-2">AI-Powered</h4>
              <p className="text-sm text-cafe-text">
                Get personalized drink recommendations
              </p>
            </div>
            <div className="bg-white bg-opacity-80 rounded-xl p-6">
              <h4 className="font-semibold text-cafe-darkBrown mb-2">Easy Ordering</h4>
              <p className="text-sm text-cafe-text">
                Simple and intuitive kiosk interface
              </p>
            </div>
            <div className="bg-white bg-opacity-80 rounded-xl p-6">
              <h4 className="font-semibold text-cafe-darkBrown mb-2">Real-Time</h4>
              <p className="text-sm text-cafe-text">
                Live inventory management system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
