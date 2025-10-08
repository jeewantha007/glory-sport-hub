import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="bg-card rounded-lg p-8 shadow-md space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Agreement to Terms</h2>
              <p className="leading-relaxed">
                By accessing or using Glory of Sport, you agree to be bound by these Terms of Service and all 
                applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
                from using this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Use License</h2>
              <p className="leading-relaxed mb-3">
                Permission is granted to temporarily view the materials on Glory of Sport's website for personal, 
                non-commercial use only. This is the grant of a license, not a transfer of title, and under this 
                license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software on the website</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Affiliate Disclaimer</h2>
              <p className="leading-relaxed">
                Glory of Sport participates in various affiliate marketing programs. This means we may receive 
                commissions on products purchased through our affiliate links. Our recommendations are based on 
                our genuine belief in the quality and value of the products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">User Content</h2>
              <p className="leading-relaxed">
                If you submit any content to our website, you grant us a non-exclusive, royalty-free, perpetual 
                license to use, reproduce, modify, and display such content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Disclaimer</h2>
              <p className="leading-relaxed">
                The materials on Glory of Sport's website are provided on an 'as is' basis. We make no warranties, 
                expressed or implied, and hereby disclaim all other warranties including, without limitation, 
                implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Limitations</h2>
              <p className="leading-relaxed">
                In no event shall Glory of Sport or its suppliers be liable for any damages arising out of the 
                use or inability to use the materials on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Modifications</h2>
              <p className="leading-relaxed">
                We may revise these terms of service at any time without notice. By using this website, you are 
                agreeing to be bound by the current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at legal@gloryofsport.com.
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

export default Terms;
