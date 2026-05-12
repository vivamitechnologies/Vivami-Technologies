import { motion } from 'motion/react';
import { Database, Code2, Cpu, Smartphone, Palette, ShieldCheck } from 'lucide-react';

export const TechnologyPage = () => {
  const techs = [
    { name: "HTML5", icon: <Code2 className="w-8 h-8 text-orange-500" /> },
    { name: "CSS3", icon: <Palette className="w-8 h-8 text-blue-500" /> },
    { name: "JavaScript", icon: <Code2 className="w-8 h-8 text-yellow-500" /> },
    { name: "React", icon: <Code2 className="w-8 h-8 text-cyan-400" /> },
    { name: "Node.js", icon: <Database className="w-8 h-8 text-green-500" /> },
    { name: "Python", icon: <Cpu className="w-8 h-8 text-blue-400" /> },
    { name: "Flutter", icon: <Smartphone className="w-8 h-8 text-indigo-400" /> },
    { name: "Firebase", icon: <ShieldCheck className="w-8 h-8 text-orange-400" /> },
    { name: "MongoDB", icon: <Database className="w-8 h-8 text-green-600" /> },
    { name: "AI APIs", icon: <Cpu className="w-8 h-8 text-purple-600" /> }
  ];

  return (
    <section className="section-padding bg-white pt-32 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-base font-bold text-brand-600 mb-2 uppercase tracking-widest">Our Stack</h2>
          <h3 className="text-4xl font-display font-extrabold text-slate-900 leading-tight">Advanced Technical Ecosystem</h3>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We leverage a cutting-edge technology stack to architect scalable, high-performance, and secure digital foundations for our clients.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {techs.map((tech) => (
            <motion.div 
              key={tech.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="p-10 bg-slate-50 border border-slate-100 rounded-[32px] flex flex-col items-center gap-6 hover:bg-white hover:shadow-xl transition-all group"
            >
              <div className="p-4 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform">{tech.icon}</div>
              <span className="font-bold text-slate-700 tracking-tight">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
