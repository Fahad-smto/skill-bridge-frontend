// components/layout/Footer.tsx
import Link from "next/link";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Github 
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Removed mb-xx and ensured bottom padding is balanced
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-slate-800 mt-16  w-full">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section - Increased Font Sizes */}
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-extrabold text-white flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-900/20">
                SB
              </div>
              SkillBridge
            </Link>
            <p className="text-lg leading-relaxed text-slate-400">
              The most reliable learning platform in the region. We bridge the gap between expert tutors and students to achieve academic excellence.
            </p>
            <div className="flex gap-5 pt-4">
              <a href="#" className="p-3 bg-slate-800 rounded-2xl hover:text-blue-500 hover:bg-slate-700 transition-all shadow-sm">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="p-3 bg-slate-800 rounded-2xl hover:text-blue-400 hover:bg-slate-700 transition-all shadow-sm">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="p-3 bg-slate-800 rounded-2xl hover:text-pink-500 hover:bg-slate-700 transition-all shadow-sm">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="p-3 bg-slate-800 rounded-2xl hover:text-blue-600 hover:bg-slate-700 transition-all shadow-sm">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links - Increased Font Sizes */}
          <div>
            <h4 className="text-white font-bold mb-8 text-2xl tracking-tight">Quick Links</h4>
            <ul className="space-y-4 text-lg">
              <li><Link href="/tutors" className="hover:text-white hover:translate-x-2 transition-all inline-block">Find a Tutor</Link></li>
              <li><Link href="/register" className="hover:text-white hover:translate-x-2 transition-all inline-block">Become a Tutor</Link></li>
              <li><Link href="/categories" className="hover:text-white hover:translate-x-2 transition-all inline-block">Our Categories</Link></li>
              <li><Link href="/about" className="hover:text-white hover:translate-x-2 transition-all inline-block">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-white hover:translate-x-2 transition-all inline-block">Pricing Plans</Link></li>
            </ul>
          </div>

          {/* Support - Increased Font Sizes */}
          <div>
            <h4 className="text-white font-bold mb-8 text-2xl tracking-tight">Support</h4>
            <ul className="space-y-4 text-lg">
              <li><Link href="/faq" className="hover:text-white transition-colors">Help & FAQs</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/safety" className="hover:text-white transition-colors">Safety Center</Link></li>
            </ul>
          </div>

          {/* Contact Info - Rounded Boxes */}
          <div>
            <h4 className="text-white font-bold mb-8 text-2xl tracking-tight">Contact Us</h4>
            <ul className="space-y-5 text-lg">
              <li className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-[1.5rem] border border-slate-800 hover:border-blue-500/30 transition-colors">
                <MapPin className="w-7 h-7 text-blue-500 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-[1.5rem] border border-slate-800 hover:border-blue-500/30 transition-colors">
                <Phone className="w-7 h-7 text-blue-500 shrink-0" />
                <span>+880 1234 567890</span>
              </li>
              <li className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-[1.5rem] border border-slate-800 hover:border-blue-500/30 transition-colors">
                <Mail className="w-7 h-7 text-blue-500 shrink-0" />
                <span className="truncate">support@skillbridge.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-base text-slate-500">
          <p>© {currentYear} <span className="text-white font-semibold underline underline-offset-4 decoration-blue-600">SkillBridge</span>. All rights reserved.</p>
          <div className="flex gap-8 items-center">
            <span className="flex items-center gap-2">Built with <span className="text-red-500 animate-pulse">❤️</span> in Dhaka</span>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 rounded-full text-sm font-mono border border-slate-700">
              <Github className="w-4 h-4" />
              <span>v1.0.4</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}