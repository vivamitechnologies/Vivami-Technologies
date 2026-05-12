import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { 
  ChevronRight, 
  Smartphone, 
  Palette, 
  TrendingUp, 
  Cpu, 
  Clock,
  LogIn
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-50 rounded-full blur-3xl -z-10 opacity-40"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-extrabold mb-8 tracking-widest uppercase">
              <span className="flex h-2 w-2 rounded-full bg-brand-500"></span>
              Professional Excellence
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-slate-900 leading-[1.05] mb-8 tracking-tight">
              Engineering <span className="text-brand-500">Enterprise</span> Grade Digital Products
            </h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-lg font-medium">
              Vivami Technologies delivers high-performance web development, scalable mobile apps, and custom AI solutions designed for growth.
            </p>
            <div className="flex flex-wrap gap-5">
              {!user ? (
                <>
                  <button 
                    onClick={() => { navigate('/login'); window.scrollTo(0, 0); }}
                    className="flex items-center gap-3 bg-brand-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-100"
                  >
                    Member Secure Login
                    <LogIn className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => { navigate('/portfolio'); window.scrollTo(0, 0); }}
                    className="flex items-center gap-3 bg-white text-slate-700 border-2 border-slate-100 px-10 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-all font-display"
                  >
                    View Solutions
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => { navigate('/dashboard'); window.scrollTo(0, 0); }}
                    className="group flex items-center gap-3 bg-slate-900 text-white px-9 py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all btn-shadow"
                  >
                    Access Dashboard
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => { navigate('/portfolio'); window.scrollTo(0, 0); }}
                    className="flex items-center gap-3 bg-white text-slate-700 border border-slate-200 px-9 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                  >
                    View Portfolio
                  </button>
                </>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-[10px] border-white ring-1 ring-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600" 
                alt="Digital Technology Analytics" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Mini Bar */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-20">
        {[
          { title: "Creative Design", Icon: Palette, desc: "Unique premium interfaces." },
          { title: "Client Focused", Icon: Smartphone, desc: "Business driven strategy." },
          { title: "Fast Performance", Icon: Clock, desc: "Optimized high speed apps." },
          { title: "AI Powered", Icon: Cpu, desc: "Smart automation integration." }
        ].map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <item.Icon className="text-brand-600 w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 leading-tight">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Services Preview Bar */}
      <section className="section-padding bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <div className="text-brand-600 font-bold mb-3 uppercase tracking-widest text-xs">Services</div>
              <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">Core Competencies</h2>
            </div>
            <button 
              onClick={() => { navigate('/services'); window.scrollTo(0, 0); }}
              className="text-brand-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
            >
              See All Services <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Enterprise Web", desc: "Scalable platforms for high-traffic operations.", href: "/enterprise" },
              { title: "Mobile Apps", desc: "Native experiences for iOS and Android ecosystems." },
              { title: "AI Integration", desc: "Custom neural networks to automate your workflow." }
            ].map((s, i) => (
              <div 
                key={i} 
                onClick={() => s.href && navigate(s.href)}
                className={`bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer ${s.href ? 'hover:border-brand-300' : ''}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-6">
                  <TrendingUp className="text-brand-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
