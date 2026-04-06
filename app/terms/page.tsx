import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Liam's Products",
  description: "Terms and conditions for purchasing from Liam's Products.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent/20 rounded-full blur-[50px] pointer-events-none" />
          <h1 className="text-4xl md:text-5xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 mb-6 tracking-tight">
            Terms & <span className="text-accent">Conditions</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Last Updated: April 2026
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 md:p-12 space-y-10">
          
          <section>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Welcome to Liam&apos;s Products. By accessing or using our website (www.liamsproducts.in), you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before using our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-accent/10 text-accent p-2 rounded-lg">2</span>
              Products & Services
            </h2>
            <p className="text-gray-700 mb-4">We offer natural and raw honey products under the BeeKiss brand.</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Product images are for representation purposes only</li>
              <li>Slight variations in color, texture, or taste may occur due to natural sourcing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-accent/10 text-accent p-2 rounded-lg">3</span>
              Pricing & Payments
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All prices are listed in Indian Rupees (₹)</li>
              <li>Prices are subject to change without prior notice</li>
              <li>We accept secure payments through trusted payment gateways</li>
              <li>We reserve the right to refuse or cancel any order at our discretion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-accent/10 text-accent p-2 rounded-lg">4</span>
              Orders & Shipping
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Orders will be processed after successful payment</li>
              <li>Delivery timelines may vary based on location</li>
              <li>We are not responsible for delays caused by courier services or external factors</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-accent/10 text-accent p-2 rounded-lg">5</span>
              Returns & Refunds
            </h2>
            <p className="text-gray-700 mb-4">Due to the nature of food products:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>We do not accept returns unless the product is damaged or defective</li>
              <li>If you receive a damaged product, contact us within 48 hours of delivery</li>
              <li>Refunds (if approved) will be processed within 5–7 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-accent/10 text-accent p-2 rounded-lg">6</span>
              Product Usage
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Our honey is natural and safe for general consumption</li>
              <li>Not recommended for infants below 1 year</li>
              <li>Store at room temperature</li>
              <li>Crystallization is natural and does not affect quality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-accent/10 text-accent p-2 rounded-lg">7</span>
              Privacy Policy
            </h2>
            <p className="text-gray-700 mb-4">We respect your privacy. Any personal information collected will be used only for:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Order processing</li>
              <li>Customer support</li>
              <li>Service improvement</li>
            </ul>
            <p className="text-gray-700 font-medium">We do not sell or share your personal data with third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-accent/10 text-accent p-2 rounded-lg">8</span>
              Intellectual Property
            </h2>
            <p className="text-gray-700 mb-4">All content on this website including:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Logo</li>
              <li>Images</li>
              <li>Text</li>
              <li>Design</li>
            </ul>
            <p className="text-gray-700">are the property of Liam&apos;s Products and cannot be copied or used without permission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-accent/10 text-accent p-2 rounded-lg">11</span>
              Changes to Terms
            </h2>
            <p className="text-gray-700">
              We reserve the right to update or modify these Terms at any time. Changes will be effective immediately upon posting.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
