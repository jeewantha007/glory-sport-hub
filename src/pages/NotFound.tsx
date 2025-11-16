import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-red-500/10 rounded-full mb-6 sm:mb-8">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-4 sm:mb-6">404</h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 px-4">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white">
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Return to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
