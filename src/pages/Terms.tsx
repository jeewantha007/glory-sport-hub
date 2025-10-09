import { Shield, FileText, AlertCircle, Scale, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  const sections = [
    {
      icon: FileText,
      title: "Agreement to Terms",
      content: "By accessing or using Glory of Sport, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site."
    },
    {
      icon: Scale,
      title: "Use License",
      content: "Permission is granted to temporarily view the materials on Glory of Sport's website for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:",
      list: [
        "Modify or copy the materials",
        "Use the materials for any commercial purpose",
        "Attempt to decompile or reverse engineer any software on the website",
        "Remove any copyright or other proprietary notations"
      ]
    },
    {
      icon: AlertCircle,
      title: "Affiliate Disclaimer",
      content: "Glory of Sport participates in various affiliate marketing programs. This means we may receive commissions on products purchased through our affiliate links. Our recommendations are based on our genuine belief in the quality and value of the products."
    },
    {
      icon: CheckCircle,
      title: "User Content",
      content: "If you submit any content to our website, you grant us a non-exclusive, royalty-free, perpetual license to use, reproduce, modify, and display such content."
    },
    {
      icon: Shield,
      title: "Disclaimer",
      content: "The materials on Glory of Sport's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement."
    },
    {
      icon: AlertCircle,
      title: "Limitations",
      content: "In no event shall Glory of Sport or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-black py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using our services
          </p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Important Notice */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Important Notice</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  These terms constitute a legally binding agreement. By using our website, you acknowledge that you have read, understood, and agree to be bound by these terms.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800 hover:border-gray-700 transition-all animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gray-800 rounded-xl flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white pt-2">{section.title}</h2>
                </div>
                <p className="text-gray-400 leading-relaxed mb-3">{section.content}</p>
                {section.list && (
                  <ul className="space-y-2 mt-4">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0" />
                        <span className="text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Additional Sections */}
            <div className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gray-800 rounded-xl flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white pt-2">Modifications</h2>
              </div>
              <p className="text-gray-400 leading-relaxed">
                We may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the current version of these terms of service.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gray-700 rounded-xl flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Contact Us</h2>
                  <p className="text-gray-400 leading-relaxed mb-3">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <a href="mailto:legal@gloryofsport.com" className="text-white font-semibold hover:underline">
                    legal@gloryofsport.com
                  </a>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-center">
              <p className="text-sm text-gray-500">
                Last updated: <span className="text-gray-400 font-medium">{new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;