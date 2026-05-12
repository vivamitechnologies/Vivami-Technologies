import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Facebook, ChevronRight, Mail, Phone } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="lg:col-span-1">
          <Logo light className="mb-6" />
          <p className="text-slate-400 leading-relaxed mb-6">
            Vivami Technologies – Building Future Digital Solutions with Innovation and Passion.
          </p>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-mono">info@vivami.in</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Phone className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-mono">+91 9470000241</span>
            </div>
          </div>
          <div className="flex gap-4">
            {[Instagram, Twitter, Linkedin, Facebook].map((Icon, idx) => (
              <a key={idx} href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-brand-600 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
            <li><Link to="/portfolio" className="hover:text-brand-400 transition-colors">Portfolio</Link></li>
            <li><Link to="/services" className="hover:text-brand-400 transition-colors">Our Services</Link></li>
            <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Services</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><Link to="/services" className="hover:text-brand-400 transition-colors">Web Development</Link></li>
            <li><Link to="/services" className="hover:text-brand-400 transition-colors">Mobile Applications</Link></li>
            <li><Link to="/services" className="hover:text-brand-400 transition-colors">UI/UX Design</Link></li>
            <li><Link to="/services" className="hover:text-brand-400 transition-colors">AI & Automation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Newsletter</h4>
          <p className="text-slate-400 text-sm mb-6">Subscribe to get latest updates and tech news.</p>
          <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10">
            <input type="email" placeholder="Your email" className="bg-transparent border-none outline-none px-4 py-2 w-full text-sm" />
            <button className="bg-brand-600 p-2 rounded-xl">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <div>© 2026 Vivami Technologies. All Rights Reserved.</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Security</a>
          <a href="#" className="hover:text-white transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};
