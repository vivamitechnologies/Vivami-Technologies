import { motion } from 'motion/react';
import { CircleCheck } from 'lucide-react';

export const AboutPage = () => {
  const features = ["Enterprise-Grade Architecture", "Strategic UI Engineering", "Rapid Market Deployment", "Dedicated Technical Support", "High-Security Standards"];
  
  return (
    <section className="section-padding bg-white pt-32 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <div className="relative">
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Architectural Excellence" />
            </div>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-8 rounded-3xl shadow-xl border-4 border-white"
            >
              <div className="text-4xl font-bold mb-1 text-brand-500">98%</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Client Retention</div>
            </motion.div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <h2 className="text-base font-bold text-brand-600 mb-2 uppercase tracking-widest">Our Story</h2>
          <h3 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 mb-8 leading-tight">
            Engineering Excellence for the Digital Frontier
          </h3>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Vivami Technologies is a premier IT consultancy focused on building resilient, high-performance digital ecosystems. We combine deep technical expertise with strategic design to help businesses excel in a rapidly evolving market.
          </p>
          <div className="space-y-4">
            {features.map((item) => (
              <div key={item} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-600 transition-all">
                  <CircleCheck className="w-5 h-5 text-brand-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-slate-800 font-bold text-sm tracking-tight">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
