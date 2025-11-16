import { Target, Award, Users, TrendingUp, Shield, Heart, Zap, CheckCircle, Sparkles, Trophy, Rocket } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmailSubscribeForm from "@/components/EmailSubscribeForm";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Every product is thoroughly vetted and tested before recommendation",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: Award,
      title: "Expert Reviews",
      description: "In-depth analysis from experienced sports professionals",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400"
    },
    {
      icon: TrendingUp,
      title: "Best Deals",
      description: "Exclusive discounts and offers you won't find anywhere else",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Real feedback from athletes and sports enthusiasts worldwide",
      gradient: "from-orange-500/20 to-red-500/20",
      iconColor: "text-orange-400"
    }
  ];

  const values = [
    { text: "Honest and transparent product reviews", color: "text-green-400" },
    { text: "Commitment to quality and performance", color: "text-yellow-400" },
    { text: "Supporting athletes at every level", color: "text-blue-400" },
    { text: "Building a passionate sports community", color: "text-red-400" }
  ];

  const stats = [
    { value: "500+", label: "Products Reviewed" },
    { value: "10K+", label: "Happy Customers" },
    { value: "50+", label: "Brand Partners" },
    { value: "4.9/5", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-black py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient-x" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 animate-float opacity-20">
          <Trophy className="w-12 h-12 text-yellow-400" />
        </div>
        <div className="absolute bottom-10 right-10 animate-float opacity-20" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-16 h-16 text-blue-400" />
        </div>
        <div className="absolute top-1/2 right-1/4 animate-float opacity-20" style={{ animationDelay: '2s' }}>
          <Rocket className="w-10 h-10 text-purple-400" />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-3 text-white font-medium mb-6 animate-in fade-in slide-in-from-top duration-700 border border-blue-500/30 shadow-lg shadow-blue-500/20">
            <Heart className="w-5 h-5 animate-pulse text-red-400" />
            <span>Passionate About Sports</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              About Glory of Sport
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            Your trusted partner in discovering premium sports gear and equipment
          </p>
        </div>

        {/* Stats Bar in Hero */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all hover:scale-105 shadow-xl hover:shadow-blue-500/20">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 relative z-10">
        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm border border-blue-500/30 shadow-lg shadow-blue-500/20">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Our Mission</h2>
              </div>
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  At Glory of Sport, we're passionate about bringing you the best sports content, gear reviews, 
                  and exclusive affiliate deals. Our mission is to help sports enthusiasts find the perfect equipment 
                  and accessories to enhance their performance and enjoyment.
                </p>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  We believe that the right gear can transform your sporting experience, whether you're a beginner 
                  taking your first steps or a seasoned athlete pushing your limits. That's why we dedicate ourselves 
                  to finding and showcasing only the best products in the market.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-4 py-2 text-sm font-medium text-purple-300 mb-4 border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
              Why We Stand Out
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Why Choose Us
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
              We combine expertise, passion, and dedication to bring you the ultimate sports gear experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100`} />
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-gray-700/50 hover:border-gray-600 transition-all hover:scale-105 hover:-translate-y-2">
                  <div className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl w-fit mb-4 border border-gray-700/30`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What We Do Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl backdrop-blur-sm border border-yellow-500/30 shadow-lg shadow-yellow-500/20">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">What We Do</h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  We curate and showcase the finest sports products, from athletic wear to training equipment. 
                  Each product featured on our site is carefully selected based on quality, performance, and value.
                </p>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  We partner with trusted brands to bring you exclusive deals and honest recommendations. Our team 
                  constantly monitors the market for the latest innovations and best value offerings, ensuring you 
                  always have access to cutting-edge sports equipment.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 mt-6 sm:mt-8">
                  {values.map((value, index) => (
                    <div key={index} className="group/item flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all hover:scale-105 backdrop-blur-sm">
                      <CheckCircle className={`w-5 h-5 ${value.color} flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform`} />
                      <span className="text-sm font-medium text-gray-300">{value.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl backdrop-blur-sm border border-green-500/30 shadow-lg shadow-green-500/20">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Why Trust Us</h2>
              </div>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4 sm:mb-6">
                Our team consists of sports enthusiasts who understand what it takes to excel in your favorite 
                activities. We don't just recommend products—we test them, research them, and ensure they meet 
                our high standards before sharing them with you.
              </p>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Every recommendation is backed by real-world testing, extensive research, and genuine experience. 
                We maintain complete transparency about our affiliate partnerships while ensuring our reviews remain 
                unbiased and focused on your needs.
              </p>
            </div>
          </div>
        </div>

        {/* Community CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all animate-gradient-x" />
            <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-6 sm:p-8 md:p-12 text-center shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-6 border border-blue-500/30 shadow-lg shadow-blue-500/20">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    Join Our Community
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                  Subscribe to our newsletter to stay updated on the latest sports gear, exclusive deals, and 
                  inspiring sports content. Follow us on social media to join a community of passionate athletes 
                  and sports fans from around the world.
                </p>
                <EmailSubscribeForm/>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      }`}</style>
    </div>
  );
};

export default About;