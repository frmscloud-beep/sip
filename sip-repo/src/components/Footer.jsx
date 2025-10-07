import { Coffee, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cafe-darkBrown text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Coffee size={24} />
            <span className="font-semibold text-lg">Sip n Chat AI</span>
          </div>

          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm">Brewing Data-Driven Decisions</p>
            <p className="text-xs text-cafe-beige mt-1">Management System</p>
          </div>

          <div className="flex items-center space-x-1 text-sm">
            <span>Made with</span>
            <Heart size={16} className="text-cafe-amber" />
            <span>for coffee lovers</span>
          </div>
        </div>

        <div className="border-t border-cafe-lightBrown mt-6 pt-6 text-center text-xs text-cafe-beige">
          <p>&copy; {new Date().getFullYear()} Sip n Chat AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
