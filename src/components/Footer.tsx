import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { FaTiktok } from 'react-icons/fa';
import EmailSubscribeForm from "./EmailSubscribeForm";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-4 text-white">Glory of Sport</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for sports highlights, gear reviews, and affiliate recommendations.
            </p>
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-4 text-white">Legal</h3>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          
          <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-lg mb-4 text-white">Follow Us</h3>
            <div className="flex gap-4 justify-center sm:justify-start">
              <a 
                href="https://www.facebook.com/share/16sNmBVFcp/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@glory.of.sports?is_from_webapp=1&sender_device=pc" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/glory_of_sport/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@gloryofsports1?si=UwNJ2XX0Ka8-hpQ-" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Glory of Sport. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;