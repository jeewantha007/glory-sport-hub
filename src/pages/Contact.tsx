import { useState } from "react";
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle, Sparkles, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { send } from "@emailjs/browser";
import heroBanner from "@/assets/hero-banner.jpg";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const templateParams = {
      name,
      email,
      message,
    };

  
    try {
      const response = await send(
        "service_lh1ur5q",   // Your EmailJS Service ID
        "template_17jwhag",  // Your EmailJS Template ID
        templateParams,
        "seVqyhozac9r2-j5g" // Your EmailJS Public Key
      );
  
      console.log("EmailJS response:", response);
  
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });
  
      setName("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      console.error("EmailJS error:", error);
  
      if (error?.text) {
        console.error("Error text:", error.text);
      }
  
      toast({
        title: "Error Sending Message",
        description: "Please check your service/template ID and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "gloryofsports.contact@gmail.com",
      description: "Send us an email anytime",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "Within 24 hours",
      description: "We typically respond quickly",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Global Service",
      description: "Serving sports fans worldwide",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      gradient: "from-purple-500/20 to-pink-500/20"
    }
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
      <section className="relative h-[400px] sm:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Contact Us"
            className="w-full h-full object-cover scale-105 animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-gray-900/80 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-white/90 text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-in slide-in-from-top duration-700 border border-gray-700">
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>We're Here to Help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 animate-in slide-in-from-bottom duration-700 delay-100">
            Get In Touch
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-in slide-in-from-bottom duration-700 delay-200">
            Have questions, feedback, or partnership inquiries? We'd love to hear from you!
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-black" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 relative z-10">
        {/* Contact Info Cards */}
        <div className="max-w-5xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group relative animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100`} />
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-gray-700/50 hover:border-gray-600 transition-all hover:scale-105 hover:-translate-y-1">
                  <div className={`inline-flex p-3 ${info.bgColor} rounded-xl mb-4 border border-gray-700/30`}>
                    <info.icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-white">{info.title}</h3>
                  <p className="text-white font-semibold mb-1">{info.value}</p>
                  <p className="text-sm text-gray-400">{info.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
                <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Send us a Message
                      </span>
                    </h2>
                    <p className="text-sm sm:text-base text-gray-400">
                      Fill out the form below and we'll get back to you as soon as possible
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold mb-2 text-white">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                        className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500/50 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold mb-2 text-white">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john@example.com"
                        className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500/50 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold mb-2 text-white">
                        Your Message
                      </label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        placeholder="Tell us what's on your mind..."
                        rows={6}
                        className="resize-none bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500/50 transition-all"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-base font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">Sending...</span>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Why Contact Us */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Why Contact Us?</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Product recommendations",
                      "Partnership opportunities",
                      "Technical support",
                      "General inquiries",
                      "Feedback and suggestions"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Email */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/20">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Direct Email</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-3">
                    Prefer email? Reach us directly at:
                  </p>
                  <a 
                    href="mailto:gloryofsports.contact@gmail.com"
                    className="text-sm sm:text-base text-blue-400 font-semibold hover:text-blue-300 hover:underline break-all transition-colors"
                  >
                    gloryofsports.contact@gmail.com
                  </a>
                </div>
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

export default Contact;