"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Hexagon, Menu, X, MessageCircle, ShoppingCart, UserCircle, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cartStore";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const getTotalQuantity = useCartStore((state) => state.getTotalQuantity);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const count = getTotalQuantity();
  if (count === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
      {count}
    </span>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  let waNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  if (waNumber.length === 10) waNumber = `91${waNumber}`;

  const whatsappLink = `https://wa.me/${waNumber}?text=Hi Liam Products! I'm interested in looking at your honey collections.`;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-gray-200 py-4 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-accent text-white p-1.5 rounded-md shadow-sm group-hover:scale-105 transition-transform">
            <Hexagon size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-bold font-serif text-xl tracking-tight text-gray-900 group-hover:text-accent transition-colors">
            Liam's Products
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-gray-600 hover:text-accent font-medium transition-colors">
              {link.name}
            </Link>
          ))}
          <Link href="/cart" className="relative text-gray-600 hover:text-accent transition-colors">
            <ShoppingCart size={24} />
            <CartBadge />
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-600 hover:text-accent transition-colors" title="My Account">
                <UserCircle size={24} />
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-500 transition-colors" 
                title="Log out"
              >
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-accent transition-colors" title="Log in">
              <UserCircle size={24} />
            </Link>
          )}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-full font-semibold transition-all hover:scale-105 shadow-[0_0_15px_rgba(37,211,102,0.3)]"
          >
            <MessageCircle size={18} />
            <span>WhatsApp Us</span>
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-card border-b border-gray-200 p-4 flex flex-col gap-4 shadow-xl md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-accent font-medium p-2"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-accent font-medium p-2"
                >
                  <UserCircle size={20} />
                  <span>My Account</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium p-2 text-left"
                >
                  <LogOut size={20} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-accent font-medium p-2"
              >
                <UserCircle size={20} />
                <span>Log In</span>
              </Link>
            )}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white p-3 rounded-lg font-bold"
            >
              <MessageCircle size={20} />
              <span>WhatsApp Us</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
