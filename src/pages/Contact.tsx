import { useState } from "react";
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { send } from "@emailjs/browser";

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
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "Within 24 hours",
      description: "We typically respond quickly",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Global Service",
      description: "Serving sports fans worldwide",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-black py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-white/90 text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-in fade-in slide-in-from-top duration-700 border border-gray-700">
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>We're Here to Help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            Get In Touch
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            Have questions, feedback, or partnership inquiries? We'd love to hear from you!
          </p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Contact Info Cards */}
        <div className="max-w-5xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 hover:shadow-xl transition-all hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-3 ${info.bgColor} rounded-xl mb-4`}>
                  <info.icon className={`w-6 h-6 ${info.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">{info.title}</h3>
                <p className="text-white font-semibold mb-1">{info.value}</p>
                <p className="text-sm text-gray-400">{info.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-800">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Send us a Message</h2>
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
                      className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
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
                      className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
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
                      className="resize-none bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-base font-semibold"
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

            {/* Sidebar Info */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Why Contact Us */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-800">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Why Contact Us?</h3>
                <div className="space-y-3">
                  {[
                    "Product recommendations",
                    "Partnership opportunities",
                    "Technical support",
                    "General inquiries",
                    "Feedback and suggestions"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Email */}
              <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-800">
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Direct Email</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mb-3">
                  Prefer email? Reach us directly at:
                </p>
                <a 
                  href="mailto:gloryofsports.contact@gmail.com"
                  className="text-sm sm:text-base text-white font-semibold hover:underline break-all"
                >
                  gloryofsports.contact@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
