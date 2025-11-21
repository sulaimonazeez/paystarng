import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-extrabold text-green-400">Paystar</h2>
          <p className="mt-3 text-gray-300 leading-relaxed text-sm">
            Simplifying payments across Africa — fast, secure, and reliable transactions for everyone.
          </p>
          <div className="flex items-center space-x-4 mt-5">
            <a href="#" className="hover:text-green-400 transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-green-400 transition"><Twitter size={20} /></a>
            <a href="#" className="hover:text-green-400 transition"><Instagram size={20} /></a>
            <a href="#" className="hover:text-green-400 transition"><Linkedin size={20} /></a>
          </div>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4">Company</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-green-400 transition">About Us</a></li>
            <li><a href="#" className="hover:text-green-400 transition">Careers</a></li>
            <li><a href="#" className="hover:text-green-400 transition">Blog</a></li>
            <li><a href="#" className="hover:text-green-400 transition">Press</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-green-400 transition">Help Center</a></li>
            <li><a href="#" className="hover:text-green-400 transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-green-400 transition">FAQs</a></li>
            <li><a href="#" className="hover:text-green-400 transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4">Get in Touch</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-center space-x-2">
              <Phone size={18} className="text-green-400" />
              <span>+234 808 123 4567</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail size={18} className="text-green-400" />
              <span>support@paystar.com.ng</span>
            </li>
            <li className="flex items-start space-x-2">
              <MapPin size={18} className="text-green-400" />
              <span>No. 24 Tech Boulevard, Lagos, Nigeria</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 mt-8 py-5 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} <span className="text-green-400 font-semibold">Paystar</span>. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;