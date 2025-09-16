import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Nano Banana AI
            </h3>
            <p className="text-gray-300 text-sm">
              Unleash your creativity with AI-powered tools for images, animations, stories, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/generate-image" className="text-gray-300 hover:text-blue-400 transition-colors">Image Generator</a></li>
              <li><a href="/cartoon-studio" className="text-gray-300 hover:text-blue-400 transition-colors">Cartoon Studio</a></li>
              <li><a href="/ad-maker" className="text-gray-300 hover:text-blue-400 transition-colors">Ad Maker AI</a></li>
              <li><a href="/time-travel" className="text-gray-300 hover:text-blue-400 transition-colors">Time Travel Camera</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="text-sm text-gray-300 space-y-2">
              <p>🚀 Built for creativity</p>
              <p>⚡ Powered by Google Gemini AI</p>
              <p>💡 48 Hour Challenge Project</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Nano Banana AI. Created with ❤️ for the AI Challenge.
          </p>
        </div>
      </div>
    </footer>
  );
};
