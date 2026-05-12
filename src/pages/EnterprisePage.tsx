import { motion } from 'motion/react';
import { 
  Layout, 
  Settings, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Users, 
  Zap, 
  Globe, 
  ChevronRight,
  Database,
  BarChart3,
  Cloud
} from 'lucide-react';

export const EnterprisePage = () => {
  const solutions = [
    { title: "Custom Web Applications", desc: "Tailor-made web applications built for your specific business needs.", icon: <Layout className="w-6 h-6" /> },
    { title: "ERP & CRM Solutions", desc: "Integrated ERP and CRM systems to manage your business efficiently.", icon: <Settings className="w-6 h-6" /> },
    { title: "Admin Dashboard Systems", desc: "Powerful dashboards for real-time monitoring and management.", icon: <BarChart3 className="w-6 h-6" /> },
    { title: "Cloud-Based Platforms", desc: "Secure, scalable and reliable cloud-native solutions.", icon: <Cloud className="w-6 h-6" /> },
    { title: "High Security Architecture", desc: "Advanced security protocols to protect your sensitive data.", icon: <ShieldCheck className="w-6 h-6" /> },
    { title: "API Integration", desc: "Seamless integration with third-party services and complex APIs.", icon: <Database className="w-6 h-6" /> },
    { title: "Enterprise Automation", desc: "Automate complex workflows and critical business processes.", icon: <Layers className="w-6 h-6" /> },
    { title: "Scalable Business Solutions", desc: "Modular architecture that grows with your business demands.", icon: <Cpu className="w-6 h-6" /> },
    { title: "Multi-user Management", desc: "Role-based access control and advanced user management.", icon: <Users className="w-6 h-6" /> },
    { title: "Real-time Data Processing", desc: "Fast and accurate data processing in sub-millisecond real-time.", icon: <Zap className="w-6 h-6" /> },
  ];

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-brand-600 font-bold text-xs uppercase tracking-widest mb-4">Enterprise Solutions</div>
            <h1 className="text-5xl lg:text-6xl font-display font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
              Scaling Excellence with <span className="text-brand-600">Enterprise Web</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg">
              We engineer robust, secure and high-performance digital platforms designed to streamline operations and accelerate your business growth.
            </p>
            <button 
              onClick={() => { window.location.href = '/contact'; window.scrollTo(0, 0); }}
              className="bg-slate-900 text-white px-9 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all btn-shadow"
            >
              Start Consultation
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" 
                alt="Enterprise Analytics" 
                className="w-full h-auto"
              />
            </div>
            {/* Decor */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-brand-500 rounded-3xl flex items-center justify-center shadow-lg text-white">
              <ShieldCheck className="w-10 h-10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-4">Our Ecosystem Capabilities</h2>
            <div className="w-16 h-1 bg-brand-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-8 rounded-[32px] bg-white border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-6 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 mb-20 text-center">
        <div className="max-w-7xl mx-auto rounded-[40px] bg-slate-900 p-12 lg:p-20 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-display font-bold mb-6">Ready to Optimize Your Enterprise?</h3>
            <p className="text-slate-400 mb-10 text-lg">Let's discuss how our technical architecture can revolutionize your operations.</p>
            <button 
              onClick={() => { window.location.href = '/contact'; window.scrollTo(0, 0); }}
              className="bg-brand-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-brand-500 transition-all"
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
