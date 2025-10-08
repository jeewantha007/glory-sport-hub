import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Glory of Sport</h1>
          
          <div className="bg-card rounded-lg p-8 shadow-md space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Glory of Sport, we're passionate about bringing you the best sports content, gear reviews, 
                and exclusive affiliate deals. Our mission is to help sports enthusiasts find the perfect equipment 
                and accessories to enhance their performance and enjoyment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">What We Do</h2>
              <p className="text-muted-foreground leading-relaxed">
                We curate and showcase the finest sports products, from athletic wear to training equipment. 
                Each product featured on our site is carefully selected based on quality, performance, and value. 
                We partner with trusted brands to bring you exclusive deals and honest recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Why Trust Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our team consists of sports enthusiasts who understand what it takes to excel in your favorite 
                activities. We don't just recommend products—we test them, research them, and ensure they meet 
                our high standards before sharing them with you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
              <p className="text-muted-foreground leading-relaxed">
                Subscribe to our newsletter to stay updated on the latest sports gear, exclusive deals, and 
                inspiring sports content. Follow us on social media to join a community of passionate athletes 
                and sports fans from around the world.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
