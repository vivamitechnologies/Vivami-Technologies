import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export const PortfolioPage = () => {
  const projects = [
    { title: "Enterprise FinTech Suite", category: "Full-Stack Dev", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800" },
    { title: "Healthcare Data Analytics", category: "AI & ML", img: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800" },
    { title: "Logistics Optimization", category: "SaaS Platform", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" },
    { title: "Modern E-Commerce Engine", category: "Headless CMS", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" },
    { title: "EdTech Learning System", category: "UX Architecture", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" },
    { title: "Cybersecurity Dashboard", category: "Security UI", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <section className="section-padding bg-slate-50 pt-32 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-base font-bold text-brand-600 mb-2 uppercase tracking-widest">Portfolio</h2>
          <h3 className="text-4xl font-display font-extrabold text-slate-900 mb-6">Our Latest Projects</h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Explore our collection of successful digital transformations and technical architectures delivered for global clients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-brand-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors">
                  {project.title}
                </h4>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
                  View Project <ChevronRight size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
