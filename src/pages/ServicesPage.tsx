import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Layout, Smartphone, Palette, TrendingUp, Cpu, Rocket, ChevronRight } from 'lucide-react';

export const ServicesPage = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: "Enterprise Web",
      desc: "Architecting high-performance, resilient business platforms with zero-latency engineering.",
      icon: <Layout className="w-8 h-8 text-brand-400" />,
      tag: "CORE",
      href: "/enterprise"
    },
    {
      title: "Mobile Ecosystems",
      desc: "Developing native-quality cross-platform experiences for the modern mobile workforce.",
      icon: <Smartphone className="w-8 h-8 text-navy-400" />,
      tag: "MOBILE"
    },
    {
      title: "UI/UX Engineering",
      desc: "Strategic design systems that bridge the gap between human intuition and data density.",
      icon: <Palette className="w-8 h-8 text-brand-400" />,
      tag: "DESIGN"
    },
    {
      title: "Growth Strategy",
      desc: "Performance-led branding and market scalability backed by advanced analytics.",
      icon: <TrendingUp className="w-8 h-8 text-navy-400" />,
      tag: "STRATEGY"
    },
    {
      title: "AI Architecture",
      desc: "Deploying proprietary neural models for intelligent business process automation.",
      icon: <Cpu className="w-8 h-8 text-brand-400" />,
      tag: "AI/ML"
    },
    {
      title: "Cloud Logistics",
      desc: "Enterprise-grade cloud infrastructure with integrated secure deployment logic.",
      icon: <Rocket className="w-8 h-8 text-navy-400" />,
      tag: "CLOUD"
    }
  ];

  return (
    <section className="section-padding bg-slate-50 pt-32 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-base font-bold text-brand-600 mb-2 uppercase tracking-widest">Expertise</h2>
          <h3 className="text-4xl font-display font-extrabold text-slate-900 mb-6">Innovative Solutions for Growth</h3>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We offer comprehensive digital services to help businesses navigate the complexities of the modern technological landscape.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                if (service.href) {
                  navigate(service.href);
                  window.scrollTo(0, 0);
                }
              }}
              className={`bg-white p-10 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group ${service.href ? 'cursor-pointer' : ''}`}
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-8 group-hover:bg-brand-600 transition-colors">
                <div className="group-hover:text-white transition-colors">
                  {service.icon}
                </div>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{service.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {service.desc}
              </p>
              <div className="flex items-center gap-2 text-brand-600 font-bold text-sm">
                Learn More <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
