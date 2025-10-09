import { Shield, Lock, Eye, Database, UserCheck, AlertCircle, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  const sections = [
    {
      icon: Eye,
      title: "Introduction",
      content: "At Glory of Sport, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website."
    },
    {
      icon: Database,
      title: "Information We Collect",
      content: "We may collect the following types of information:",
      list: [
        "Email addresses and names when you subscribe to our newsletter",
        "Usage data and analytics to improve our website",
        "Information you provide when contacting us",
        "Browser and device information for optimization"
      ]
    },
    {
      icon: UserCheck,
      title: "How We Use Your Information",
      content: "Your information is used to:",
      list: [
        "Send you newsletters and updates about sports gear and deals",
        "Respond to your inquiries and support requests",
        "Improve our website and user experience",
        "Comply with legal obligations",
        "Analyze website traffic and user behavior"
      ]
    },
    {
      icon: AlertCircle,
      title: "Affiliate Links",
      content: "Our website contains affiliate links. When you click on these links and make a purchase, we may earn a commission at no additional cost to you. This helps us maintain and improve our service. We only recommend products we genuinely believe in."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. Your data is stored on secure servers with encryption and regular security audits."
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You also have the right to opt-out of marketing communications and request a copy of your data. To exercise these rights, please contact us at privacy@gloryofsport.com."
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
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we protect your data.
          </p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Trust Badge */}
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                <Lock className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Your Privacy Matters</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We are committed to protecting your personal information and being transparent about our data practices. This policy outlines how we handle your data with care and respect.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Sections */}
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

            {/* Additional Section */}
            <div className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gray-800 rounded-xl flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white pt-2">Changes to This Policy</h2>
              </div>
              <p className="text-gray-400 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. We encourage you to review this policy periodically for any updates.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gray-700 rounded-xl flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Contact Us About Privacy</h2>
                  <p className="text-gray-400 leading-relaxed mb-3">
                    If you have any questions or concerns about this Privacy Policy or our data practices, please don't hesitate to reach out:
                  </p>
                  <a href="mailto:privacy@gloryofsport.com" className="text-white font-semibold hover:underline">
                    privacy@gloryofsport.com
                  </a>
                </div>
              </div>
            </div>

            {/* GDPR & Rights Section */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-3 text-xl">Your Data Protection Rights</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Right to Access",
                      "Right to Rectification",
                      "Right to Erasure",
                      "Right to Restrict Processing",
                      "Right to Data Portability",
                      "Right to Object"
                    ].map((right, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {right}
                      </div>
                    ))}
                  </div>
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

export default Privacy;