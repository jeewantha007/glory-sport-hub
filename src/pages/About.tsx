import { Target, Award, Users, TrendingUp, Shield, Heart, Zap, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmailSubscribeForm from "@/components/EmailSubscribeForm";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Every product is thoroughly vetted and tested before recommendation"
    },
    {
      icon: Award,
      title: "Expert Reviews",
      description: "In-depth analysis from experienced sports professionals"
    },
    {
      icon: TrendingUp,
      title: "Best Deals",
      description: "Exclusive discounts and offers you won't find anywhere else"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Real feedback from athletes and sports enthusiasts worldwide"
    }
  ];

  const values = [
    "Honest and transparent product reviews",
    "Commitment to quality and performance",
    "Supporting athletes at every level",
    "Building a passionate sports community"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-black py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-6 animate-in fade-in slide-in-from-top duration-700 border border-gray-700">
            <Heart className="w-4 h-4" />
            <span>Passionate About Sports</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            About Glory of Sport
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            Your trusted partner in discovering premium sports gear and equipment
          </p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl border border-gray-800">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gray-800 rounded-xl">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-4 sm:mb-6">
              At Glory of Sport, we're passionate about bringing you the best sports content, gear reviews, 
              and exclusive affiliate deals. Our mission is to help sports enthusiasts find the perfect equipment 
              and accessories to enhance their performance and enjoyment.
            </p>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              We believe that the right gear can transform your sporting experience, whether you're a beginner 
              taking your first steps or a seasoned athlete pushing your limits. That's why we dedicate ourselves 
              to finding and showcasing only the best products in the market.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">Why Choose Us</h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
              We combine expertise, passion, and dedication to bring you the ultimate sports gear experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 hover:shadow-xl transition-all hover:-translate-y-2 animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl w-fit mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Do Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl border border-gray-800">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-xl">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">What We Do</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                We curate and showcase the finest sports products, from athletic wear to training equipment. 
                Each product featured on our site is carefully selected based on quality, performance, and value.
              </p>
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                We partner with trusted brands to bring you exclusive deals and honest recommendations. Our team 
                constantly monitors the market for the latest innovations and best value offerings, ensuring you 
                always have access to cutting-edge sports equipment.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 mt-6 sm:mt-8">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-black/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl border border-gray-800">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-green-500/10 rounded-xl">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Trust Us</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-4 sm:mb-6">
              Our team consists of sports enthusiasts who understand what it takes to excel in your favorite 
              activities. We don't just recommend products—we test them, research them, and ensure they meet 
              our high standards before sharing them with you.
            </p>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              Every recommendation is backed by real-world testing, extensive research, and genuine experience. 
              We maintain complete transparency about our affiliate partnerships while ensuring our reviews remain 
              unbiased and focused on your needs.
            </p>
          </div>
        </div>

        {/* Community CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-gray-800 to-black rounded-2xl p-6 sm:p-8 md:p-12 text-center shadow-2xl border border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Join Our Community
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Subscribe to our newsletter to stay updated on the latest sports gear, exclusive deals, and 
              inspiring sports content. Follow us on social media to join a community of passionate athletes 
              and sports fans from around the world.
            </p>
            <EmailSubscribeForm/>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;