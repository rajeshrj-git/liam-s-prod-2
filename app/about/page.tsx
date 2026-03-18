import { MapPin, ShieldCheck, Mail, Phone, Users, Zap } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "About Us | Jarvis Computer",
  description: "Learn more about Jarvis Computer, your trusted source for premium refurbished laptops.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent/20 rounded-full blur-[50px] pointer-events-none" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-6 tracking-tight">
            The <span className="text-accent">Jarvis</span> Story
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            We believe premium technology shouldn't cost a fortune. Our mission is to provide high-quality, fully-tested refurbished computers with unmatched warranty and support.
          </p>
        </div>

        {/* Owner & Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 lg:order-1 space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Built on Trust & Transparency</h2>
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>
                At Jarvis Computer, we don't just sell laptops; we build relationships. Every device that leaves our store goes through a rigorous multi-point inspection to ensure it performs like new.
              </p>
              <p>
                What really sets us apart is our <strong>Jarvis Protection Guarantee</strong>. We understand the hesitation of buying refurbished, which is why we offer a 1-Week Testing Warranty and a 6-Month Service Warranty. This is our commitment to your peace of mind.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <Users className="text-accent mb-3" size={28} />
                <h3 className="text-2xl font-bold text-white mb-1">50+</h3>
                <p className="text-gray-400 text-sm">Happy Customers</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <ShieldCheck className="text-accent mb-3" size={28} />
                <h3 className="text-2xl font-bold text-white mb-1">100%</h3>
                <p className="text-gray-400 text-sm">Quality Checked</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-3xl blur-xl" />
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 group">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800" 
                alt="Jarvis Computer Founder" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                <h3 className="text-2xl font-bold text-white">Nino Issac</h3>
                <p className="text-accent font-medium">Founder</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Visit Our Store</h2>
            <p className="text-gray-400">Experience our premium collection in person.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-8 rounded-3xl border border-white/5 h-full flex flex-col justify-center">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-accent" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Store Address</h4>
                      <p className="text-gray-400">Verkilambi<br/>Kanayakumari ,Tamil Nadu <br/>India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="text-accent" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Phone</h4>
                      <p className="text-gray-400">{process.env.NEXT_PUBLIC_PHONE_NUMBER || "+91 0000 000000"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="text-accent" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Email</h4>
                      <p className="text-gray-400">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@jarviscomputer.in"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 relative h-[400px] lg:h-auto rounded-3xl overflow-hidden border border-white/10 glass-card">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.076474956475!2d77.28992637582333!3d8.295188450042062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04560e9f7fd71f%3A0x642341dd374b0cb7!2sVerkilambi%2C%20Tamil%20Nadu%20629166!5e0!3m2!1sen!2sin!4v1773874237381!5m2!1sen!2sin" 
            width="600" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>


            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


