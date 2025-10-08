import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="bg-card rounded-lg p-8 shadow-md space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
              <p className="leading-relaxed">
                At Glory of Sport, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, and protect your personal information when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
              <p className="leading-relaxed mb-3">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email addresses and names when you subscribe to our newsletter</li>
                <li>Usage data and analytics to improve our website</li>
                <li>Information you provide when contacting us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
              <p className="leading-relaxed mb-3">Your information is used to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Send you newsletters and updates about sports gear and deals</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Improve our website and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Affiliate Links</h2>
              <p className="leading-relaxed">
                Our website contains affiliate links. When you click on these links and make a purchase, 
                we may earn a commission at no additional cost to you. This helps us maintain and improve our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate security measures to protect your personal information from unauthorized 
                access, alteration, or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
              <p className="leading-relaxed">
                You have the right to access, update, or delete your personal information. To exercise these rights, 
                please contact us at privacy@gloryofsport.com.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new policy on this page.
              </p>
            </section>

            <section>
              <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
