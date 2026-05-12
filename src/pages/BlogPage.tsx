import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Tag, ChevronRight, Search, FileText, Plus, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export const BlogPage = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = ['All', ...new Set(blogs.map(b => b.category))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         blog.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-xs font-black uppercase tracking-widest mb-6"
          >
            <FileText className="w-3 h-3" />
            <span>Our Repository</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6"
          >
            Insights & <span className="text-brand-600">Perspectives</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-bold max-w-2xl mx-auto text-lg leading-relaxed mb-10"
          >
            Explore our latest thoughts on technology, design strategy, and system architecture updates from the core team.
          </motion.p>

          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link 
                to="/admin" 
                className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-brand-600 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Initiate New Editorial
              </Link>
            </motion.div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-16 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-100' 
                  : 'bg-white text-slate-400 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search content..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-brand-600 transition-all shadow-sm" 
            />
            <Search className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[40px] h-96 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredBlogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-brand-900/5 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  {blog.image_url ? (
                    <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-600 shadow-lg">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(blog.publish_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-brand-600 transition-colors">{blog.title}</h3>
                  <p className="text-slate-500 font-medium text-sm line-clamp-3 mb-8 leading-relaxed">{blog.description}</p>
                  
                  <Link to={`#`} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-600 group-hover:gap-4 transition-all">
                    Read Trajectory 
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[48px] border border-slate-100">
            <Search className="w-16 h-16 text-slate-100 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-400 font-bold">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
