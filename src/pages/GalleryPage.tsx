import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, X, Maximize2, Camera, Plus } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';

export const GalleryPage = () => {
  const { user } = useAuth();
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          setGallery(data);
        }
      } catch (err) {
        console.error('Failed to fetch gallery');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-xs font-black uppercase tracking-widest mb-6"
          >
            <Camera className="w-3 h-3" />
            <span>Visual Archive</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6"
          >
            Media <span className="text-brand-600">Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-bold max-w-2xl mx-auto text-lg leading-relaxed mb-10"
          >
            A curated collection of system assets, architectural snapshots, and project interface milestones.
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
                New Asset Intake
              </Link>
            </motion.div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-white rounded-[32px] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {gallery.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="relative group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm break-inside-avoid cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <img src={item.image_url} alt={item.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 p-6 flex flex-col justify-end transition-all opacity-0 group-hover:opacity-100">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform">
                    <p className="text-white font-black text-sm mb-1">{item.title || 'Untitled Archive'}</p>
                    <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">{item.caption || 'No annotation.'}</p>
                    <div className="mt-4 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900">
                        <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && gallery.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[48px] border border-slate-100">
            <ImageIcon className="w-16 h-16 text-slate-100 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">Visual Vault is Empty</h3>
            <p className="text-slate-400 font-bold">No assets have been recorded in the visual archive yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-xl transition-all"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col md:flex-row bg-white rounded-[40px] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex-1 bg-slate-100 overflow-hidden flex items-center justify-center">
                <img src={selectedImage.image_url} alt={selectedImage.title} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="w-full md:w-80 p-10 flex flex-col bg-white">
                <div className="mb-auto">
                    <h3 className="text-2xl font-black text-slate-900 mb-4">{selectedImage.title || 'Untitled Asset'}</h3>
                    <div className="w-10 h-1 bg-brand-600 rounded-full mb-6" />
                    <p className="text-slate-500 font-medium leading-relaxed">{selectedImage.caption || 'No additional annotation provided for this visual asset.'}</p>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-50">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Asset Recorded</p>
                    <p className="font-bold text-slate-900">{new Date(selectedImage.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
