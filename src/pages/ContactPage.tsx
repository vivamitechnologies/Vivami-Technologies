import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook, ChevronRight } from 'lucide-react';

export const ContactPage = () => {
  return (
    <section className="section-padding bg-slate-50 pt-32 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-base font-bold text-brand-600 mb-2 uppercase tracking-widest">Contact Us</h2>
            <h3 className="text-4xl font-display font-extrabold text-slate-900 mb-8">Get In Touch</h3>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed">
              Have a project in mind? Let's discuss how we can help you build something amazing.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0">
                  <Mail className="text-brand-600 w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-bold uppercase mb-1">Email Us</div>
                  <div className="text-lg font-bold text-slate-900 font-mono tracking-tight">info@vivami.in</div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0">
                  <Phone className="text-brand-600 w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-bold uppercase mb-1">Call Us</div>
                  <div className="text-lg font-bold text-slate-900 font-mono tracking-tight">+91 9470000241</div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0">
                  <MapPin className="text-brand-600 w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-bold uppercase mb-1">Our Office</div>
                  <div className="text-lg font-bold text-slate-900 leading-tight">Rohini Sector 7, Delhi 110085</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              {[Instagram, Twitter, Linkedin, Facebook].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all text-slate-600 font-bold">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[32px] shadow-xl border border-slate-100"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                  <input type="text" className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none transition-all" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Company Name</label>
                  <input type="text" className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none transition-all" placeholder="Enter company name" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Mobile Number</label>
                  <input type="tel" className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none transition-all" placeholder="+91 00000 00000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email ID</label>
                  <input type="email" className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none transition-all" placeholder="email@example.com" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Service Required</label>
                  <select className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Select Service</option>
                    <option>Web Development</option>
                    <option>Mobile App Development</option>
                    <option>UI/UX Design</option>
                    <option>Digital Marketing</option>
                    <option>AI/ML Solutions</option>
                    <option>Consultation Only</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Project Type</label>
                  <select className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Select Category</option>
                    <option>E-commerce</option>
                    <option>SaaS Platform</option>
                    <option>Corporate Website</option>
                    <option>Educational App</option>
                    <option>Fintech Solution</option>
                    <option>Internal Management System</option>
                    <option>Startup Prototype</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Budget Range</label>
                  <select className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Select Budget</option>
                    <option>Below ₹50k</option>
                    <option>₹50k - ₹1 Lakh</option>
                    <option>₹1 Lakh - ₹3 Lakh</option>
                    <option>₹3 Lakh - ₹5 Lakh</option>
                    <option>Above ₹5 Lakh</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Consultation Type</label>
                  <select className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer">
                    <option>Online Meeting</option>
                    <option>Offline / In-Person</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Meeting Date & Time</label>
                <input type="datetime-local" className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Project Details</label>
                <textarea className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none transition-all min-h-[120px]" placeholder="Briefly describe your project requirements, goals, and any specific features you need..."></textarea>
              </div>

              <button 
                type="button" 
                className="w-full bg-brand-600 text-white py-5 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg flex items-center justify-center gap-3 group"
              >
                Book Consultation
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map */}
        <div className="w-full h-[500px] rounded-[32px] overflow-hidden shadow-xl border-4 border-white mb-20 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.35424087006!2d77.11524052529207!3d28.70895767562307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0158f834e853%3A0x3e9949b834903711!2sSector%207%2C%20Rohini%2C%20Delhi%2C%20110085!5e0!3m2!1sen!2sin!4v1778242684542!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            title="Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};
