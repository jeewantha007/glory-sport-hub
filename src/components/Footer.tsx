import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { FaTiktok } from 'react-icons/fa';
import EmailSubscribeForm from "./EmailSubscribeForm";
const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Glory of Sport</h3>
            <p className="text-gray-400 text-sm">
              Your ultimate destination for sports highlights, gear reviews, and affiliate recommendations.
            </p>
          </div>
          
          <div>
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
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Follow Us</h3>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/16sNmBVFcp/" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@glory.of.sports?is_from_webapp=1&sender_device=pc" className="text-gray-400 hover:text-white transition-colors">
                <FaTiktok className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/glory_of_sport/" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@gloryofsports1?si=UwNJ2XX0Ka8-hpQ-" className="text-gray-400 hover:text-white transition-colors">
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