import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Users, LayoutDashboard, Settings, ListTodo, BarChart3, 
  ChevronRight, UserPlus, Filter, User, LogOut, Activity, Camera, 
  Trash2, Loader2, Key, Globe, CheckCircle2, AlertCircle,
  FileText, Image as ImageIcon, Search, Plus, Edit, X, Save, Calendar
} from 'lucide-react';
import { useAuth } from '../components/AuthContext';

import { useNavigate } from 'react-router-dom';

export const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    username: user?.username || '',
    avatarUrl: user?.avatarUrl || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Blog Management State
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    description: '',
    category: 'Technology',
    image_url: '',
    publish_date: new Date().toISOString().split('T')[0]
  });

  // Gallery Management State
  const [gallery, setGallery] = useState<any[]>([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any>(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    caption: '',
    image_url: ''
  });

  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, blogsRes, galleryRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/blogs'),
          fetch('/api/gallery')
        ]);
        
        if (usersRes.ok) setUsers(await usersRes.json());
        if (blogsRes.ok) setBlogs(await blogsRes.json());
        if (galleryRes.ok) setGallery(await galleryRes.json());
      } catch (err) {
        console.error('Data sync failed');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileUpload = async (file: File, type: 'blog' | 'gallery' | 'profile') => {
    if (!file.type.startsWith('image/')) return setMessage({ text: 'Invalid file type', type: 'error' });
    const formData = new FormData();
    formData.append(type === 'profile' ? 'photo' : 'image', file);

    const endpoint = type === 'profile' ? '/api/auth/upload' : '/api/upload';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        return data.avatarUrl || data.imageUrl;
      }
    } catch (err) {
      console.error('Upload error');
    }
    return null;
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return setMessage({ text: 'Invalid file type', type: 'error' });
    if (file.size > 5 * 1024 * 1024) return setMessage({ text: 'File too large (Max 5MB)', type: 'error' });

    setIsUploading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await fetch('/api/auth/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        updateUser({ avatarUrl: data.avatarUrl });
        setEditForm(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
        setMessage({ text: 'Profile photo updated!', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'Upload failed', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        updateUser(editForm);
        setIsEditing(false);
        setMessage({ text: 'In-profile updates applied!', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'Update failed', type: 'error' });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setMessage({ text: 'Passwords match failed', type: 'error' });
    }
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
      });
      if (res.ok) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage({ text: 'Secure password updated!', type: 'success' });
      } else {
        const data = await res.json();
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Password update rejected', type: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: Admin accounts are critical. Deleting your account will remove your administrative access permanently. Are you sure?')) {
      return;
    }

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'DELETE'
      });
      if (res.ok) {
        logout();
        navigate('/login');
      } else {
        const data = await res.json();
        setMessage({ text: data.message || 'Deletion failed', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'System failure', type: 'error' });
    }
  };

  const handlePurgeUser = async (userId: number, userName: string) => {
    if (userId === user.id) {
      return setMessage({ text: 'Access Denied: Suicide protocols are restricted via management interface. Use Profile Purge for self-termination.', type: 'error' });
    }
    
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete account "${userName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
        setMessage({ text: `Subject "${userName}" has been purged from the core repository.`, type: 'success' });
      } else {
        const data = await res.json();
        setMessage({ text: data.message || 'Purge sequence failure', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Critical system error during purge', type: 'error' });
    }
  };

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'User Control', icon: Users },
    { id: 'blogs', name: 'Blog Manager', icon: FileText },
    { id: 'gallery', name: 'Gallery Hub', icon: ImageIcon },
    { id: 'profile', name: 'My Profile', icon: Shield },
    { id: 'settings', name: 'System Settings', icon: Settings },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-80 bg-slate-900 text-white p-8 hidden lg:flex flex-col fixed inset-y-0 left-0">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <Shield className="w-6 h-6" />
            </div>
            <span className="font-black tracking-tight text-xl uppercase italic">Admin<span className="text-brand-500">Node</span></span>
          </div>

          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsEditing(false); setMessage({ text: '', type: '' }); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === item.id 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-white/5 pt-8">
          <div className="flex items-center gap-4 mb-6 px-4">
            <div className="flex-1 overflow-hidden">
              <p className="font-bold truncate text-sm">{user.fullName}</p>
              <p className="text-[10px] font-black uppercase text-brand-500 tracking-widest">Master Admin</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-red-100 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-80 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto pt-24 lg:pt-0">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Console</h1>
                  <p className="text-slate-500 font-bold mt-1">Global monitoring & resource management activated.</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">System Online</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                  { label: 'Visits', value: '1,284', icon: BarChart3, color: 'text-blue-600' },
                  { label: 'Resources', value: '8', icon: LayoutDashboard, color: 'text-purple-600' },
                  { label: 'Active Users', value: users.length.toString(), icon: Users, color: 'text-orange-600' },
                  { label: 'Security Status', value: 'Protected', icon: Shield, color: 'text-green-600' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Existing User Control Table */}
              <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-10">System Accounts</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-50 text-slate-400">
                        <th className="pb-4 text-xs font-black uppercase tracking-widest">User Profile</th>
                        <th className="pb-4 text-xs font-black uppercase tracking-widest">Access Key</th>
                        <th className="pb-4 text-xs font-black uppercase tracking-widest">Activation</th>
                        <th className="pb-4 text-xs font-black uppercase tracking-widest text-right">Settings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map((u) => (
                        <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-600 text-xs text-center">
                                {u.full_name[0]}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{u.full_name}</p>
                                <p className="text-xs text-slate-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-6">
                            <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-6 text-sm text-slate-500 font-bold">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-6 text-right">
                            <div className="flex items-center justify-end gap-2 text-right">
                              <button 
                                onClick={() => handlePurgeUser(u.id, u.full_name)}
                                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                title="Purge User Account"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                                <ChevronRight className="w-6 h-6" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'blogs' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Blog Repository</h2>
                  <p className="text-slate-500 font-bold">Content management and editorial control.</p>
                </div>
                <button 
                  onClick={() => { setEditingBlog(null); setBlogForm({ title: '', description: '', category: 'Technology', image_url: '', publish_date: new Date().toISOString().split('T')[0] }); setIsBlogModalOpen(true); }}
                  className="flex items-center gap-3 bg-brand-600 text-white px-8 py-4 rounded-2x font-black uppercase tracking-widest text-xs shadow-lg hover:bg-brand-700 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  New Editorial
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <div key={blog.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group">
                    <div className="relative h-64">
                       {blog.image_url ? (
                         <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       ) : (
                         <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                           <ImageIcon className="w-12 h-12" />
                         </div>
                       )}
                       <div className="absolute top-4 left-4">
                         <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-600 shadow-xl">
                           {blog.category}
                         </span>
                       </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.publish_date).toLocaleDateString()}
                      </div>
                      <h4 className="text-xl font-black text-slate-900 mb-4 line-clamp-2">{blog.title}</h4>
                      <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-8">{blog.description}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setEditingBlog(blog); setBlogForm({ title: blog.title, description: blog.description, category: blog.category, image_url: blog.image_url, publish_date: blog.publish_date.split('T')[0] }); setIsBlogModalOpen(true); }}
                            className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-brand-50 hover:text-brand-600 transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={async () => { if(confirm('Erase this editorial permanently?')) { await fetch(`/api/blogs/${blog.id}`, { method: 'DELETE' }); setBlogs(blogs.filter(b => b.id !== blog.id)); } }}
                            className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">Details <ChevronRight className="w-3 h-3 inline ml-1" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Media Assets</h2>
                  <p className="text-slate-500 font-bold">Visual library and asset distribution hub.</p>
                </div>
                <div className="space-y-4">
                  <button 
                    onClick={() => { setEditingGallery(null); setGalleryForm({ title: '', caption: '', image_url: '' }); setIsGalleryModalOpen(true); }}
                    className="flex items-center gap-3 bg-brand-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-brand-700 transition-all active:scale-95 w-full md:w-auto justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    Asset Intake
                  </button>
                  <label className="flex items-center justify-center gap-3 bg-white text-slate-900 border-2 border-slate-100 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-sm hover:bg-slate-50 transition-all cursor-pointer">
                    <Camera className="w-4 h-4" />
                    Quick Upload
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setIsGalleryUploading(true);
                          setMessage({ text: 'Ingesting asset...', type: 'success' });
                          const url = await handleFileUpload(file, 'gallery');
                          if (url) {
                            const res = await fetch('/api/gallery', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ image_url: url, title: file.name.split('.')[0], caption: 'Batch uploaded from terminal.' })
                            });
                            if (res.ok) {
                              // Refetch gallery to get all fields accurately including server-side timestamps
                              const galleryRes = await fetch('/api/gallery');
                              if (galleryRes.ok) {
                                setGallery(await galleryRes.json());
                              }
                              setMessage({ text: 'Asset synchronized to warehouse.', type: 'success' });
                            }
                          }
                          setIsGalleryUploading(false);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {isGalleryUploading && (
                <div className="mb-10 p-6 bg-brand-50 border-2 border-dashed border-brand-200 rounded-[32px] flex items-center justify-center gap-4 text-brand-600 font-black uppercase tracking-widest text-xs">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Transferring PC Asset to Node...
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="relative group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm aspect-square">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 p-6 flex flex-col justify-end transition-all">
                      <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <p className="text-white font-black text-sm mb-1">{item.title || 'Untitled Asset'}</p>
                        <p className="text-white/60 text-[10px] font-bold line-clamp-2 mb-4">{item.caption || 'No description recorded.'}</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setEditingGallery(item); setGalleryForm({ title: item.title, caption: item.caption, image_url: item.image_url }); setIsGalleryModalOpen(true); }}
                            className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-white hover:bg-white/40 transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={async () => { if(confirm('Purge this asset?')) { await fetch(`/api/gallery/${item.id}`, { method: 'DELETE' }); setGallery(gallery.filter(g => g.id !== item.id)); } }}
                            className="bg-red-500/80 backdrop-blur-md p-2 rounded-xl text-white hover:bg-red-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black text-slate-900">Admin Identity</h3>
                        <button onClick={() => setIsEditing(!isEditing)} className="text-brand-600 font-black text-xs uppercase tracking-widest hover:underline transition-all">
                          {isEditing ? 'Discard' : 'Edit Instance'}
                        </button>
                      </div>

                      {isEditing ? (
                        <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400">Full Access Name</label>
                             <input type="text" value={editForm.fullName} onChange={(e) => setEditForm(p => ({...p, fullName: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400">Identifier (Username)</label>
                             <input type="text" value={editForm.username} onChange={(e) => setEditForm(p => ({...p, username: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400">Global Email</label>
                             <input type="email" value={editForm.email} onChange={(e) => setEditForm(p => ({...p, email: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400">Comm Signal (Mobile)</label>
                             <input type="tel" value={editForm.mobile} onChange={(e) => setEditForm(p => ({...p, mobile: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none" />
                           </div>
                           <div className="md:col-span-2">
                             <button type="submit" className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-brand-700 transition-all">Synchronize Updates</button>
                           </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-2 gap-8">
                           <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Status</p><p className="font-bold text-slate-900 border-b border-slate-50 pb-4">Authorized Admin</p></div>
                           <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Email</p><p className="font-bold text-slate-900 border-b border-slate-50 pb-4">{user.email}</p></div>
                           <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Mobile</p><p className="font-bold text-slate-900 border-b border-slate-50 pb-4">{user.mobile || '--'}</p></div>
                           <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Access Level</p><p className="font-bold text-slate-900 border-b border-slate-50 pb-4 uppercase">Level 0 (System)</p></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                  <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><Key className="w-6 h-6 text-brand-600" /> Security Protocol</h3>
                  <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400">Current Access Password</label>
                       <input type="password" required value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(p => ({...p, currentPassword: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400">New Protocol (Password)</label>
                       <input type="password" required value={passwordForm.newPassword} onChange={(e) => setPasswordForm(p => ({...p, newPassword: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400">Confirm Protocol</label>
                       <input type="password" required value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(p => ({...p, confirmPassword: e.target.value}))} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none" />
                    </div>
                    <button type="submit" className="md:col-span-2 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-slate-800 transition-all">Update Access Protocol</button>
                  </form>
                </div>

                <div className="bg-red-50/50 p-10 rounded-[40px] border border-red-100 relative overflow-hidden">
                  <h3 className="text-2xl font-black text-red-600 mb-4 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6" /> Destructive Override
                  </h3>
                  <p className="text-slate-600 font-bold mb-8 max-w-lg text-sm leading-relaxed">
                    Account termination is irreversible. This will purge your administrative identity and all associated meta-data from the core repository. Use with extreme caution.
                  </p>
                  <button 
                    onClick={handleDeleteAccount}
                    className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
                  >
                    Initiate Profile Purge
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Notifications</h3>
                    <AnimatePresence>
                      {message.text && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`p-6 rounded-2xl flex items-center gap-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                           </div>
                           <p className="font-bold text-sm leading-tight">{message.text}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="mt-8 pt-8 border-t border-slate-50">
                       <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Recent Activity</p>
                       <div className="space-y-4">
                          {[1,2].map(i => (
                            <div key={i} className="flex items-center gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                               <p className="text-xs text-slate-500 font-bold">Identity session verified • {i}h ago</p>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="bg-brand-600 p-10 rounded-[40px] text-white shadow-xl shadow-brand-100">
                    <Activity className="w-10 h-10 mb-6" />
                    <h3 className="text-xl font-black mb-4">Security Score</h3>
                    <p className="text-4xl font-black mb-2 tracking-tighter">98.4<span className="text-xl">%</span></p>
                    <p className="text-xs font-bold text-brand-100 leading-relaxed opacity-80">Your administrative identity is highly secure. No vulnerabilities detected in recent scans.</p>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
             <div className="bg-white p-16 rounded-[40px] border border-slate-100 text-center">
                <Globe className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">Global System Settings</h3>
                <p className="text-slate-500 font-bold max-w-sm mx-auto">Full system configuration modules are being partitioned and initialized.</p>
             </div>
          )}
        </div>
      </main>

      {/* Blog & Gallery Modals */}
      <AnimatePresence>
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsBlogModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsBlogModalOpen(false)}
                className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all text-slate-400"
              ><X className="w-5 h-5" /></button>
              
              <h3 className="text-2xl font-black text-slate-900 mb-8">{editingBlog ? 'Update Editorial' : 'Create New Editorial'}</h3>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const method = editingBlog ? 'PATCH' : 'POST';
                const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs';
                const res = await fetch(url, {
                  method,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(blogForm)
                });
                if (res.ok) {
                  const data = await res.json();
                  if (editingBlog) {
                    setBlogs(blogs.map(b => b.id === editingBlog.id ? { ...b, ...blogForm } : b));
                  } else {
                    setBlogs([{ id: data.id, ...blogForm }, ...blogs]);
                  }
                  setIsBlogModalOpen(false);
                  setMessage({ text: 'Editorial record updated success.', type: 'success' });
                }
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Editorial Title</label>
                  <input required placeholder="Enter compelling title..." value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Sphere Category</label>
                    <select value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none appearance-none">
                      {['Technology', 'Design', 'Strategy', 'Resources', 'Updates'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Emission Date</label>
                    <input type="date" value={blogForm.publish_date} onChange={e => setBlogForm({...blogForm, publish_date: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Abstract Description</label>
                  <textarea rows={4} required value={blogForm.description} onChange={e => setBlogForm({...blogForm, description: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none resize-none" placeholder="Provide a summary for the repository..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Featured Visual</label>
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {blogForm.image_url ? <img src={blogForm.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-300" />}
                    </div>
                    <div className="flex-1">
                      <input type="file" accept="image/*" onChange={async (e) => { if(e.target.files?.[0]) { const url = await handleFileUpload(e.target.files[0], 'blog'); if(url) setBlogForm({...blogForm, image_url: url}); } }} className="hidden" id="blog-image-input" />
                      <label htmlFor="blog-image-input" className="block w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-center text-xs text-slate-500 cursor-pointer hover:border-brand-600 hover:text-brand-600 transition-all">Select Image from Terminal</label>
                      <p className="text-[9px] font-bold text-slate-300 mt-2 px-2 uppercase">JPEG/PNG Protocol • Size Restricted (5MB)</p>
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-brand-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-100 hover:bg-brand-700 transition-all">{editingBlog ? 'Update Protocol' : 'Deploy Operational Data'}</button>
              </form>
            </motion.div>
          </div>
        )}

        {isGalleryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsGalleryModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10"
            >
              <button 
                onClick={() => setIsGalleryModalOpen(false)}
                className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all text-slate-400"
              ><X className="w-5 h-5" /></button>
              
              <h3 className="text-2xl font-black text-slate-900 mb-8">{editingGallery ? 'Re-tag Asset' : 'Asset Ingestion'}</h3>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const method = editingGallery ? 'PATCH' : 'POST';
                const url = editingGallery ? `/api/gallery/${editingGallery.id}` : '/api/gallery';
                const res = await fetch(url, {
                  method,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(galleryForm)
                });
                if (res.ok) {
                  const galleryRes = await fetch('/api/gallery');
                  if (galleryRes.ok) {
                    setGallery(await galleryRes.json());
                  }
                  setIsGalleryModalOpen(false);
                  setMessage({ text: 'Asset recorded successfully.', type: 'success' });
                }
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">{editingGallery ? 'Replace Asset Signal' : 'Visual Signal'}</label>
                  <div 
                    className={`h-48 rounded-[32px] border-4 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer relative group ${galleryForm.image_url ? 'bg-slate-50 border-brand-500/20' : 'bg-slate-50/50 border-slate-200 hover:border-brand-500/40 hover:bg-white'}`}
                    onClick={() => document.getElementById('gallery-upload')?.click()}
                  >
                    {galleryForm.image_url ? (
                      <>
                        <img src={galleryForm.image_url} className="w-full h-full object-contain mb-2" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-[28px]">
                           <Camera className="w-8 h-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        {isGalleryUploading ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="w-10 h-10 text-brand-600 animate-spin mb-4" />
                            <p className="text-xs font-black text-brand-600 uppercase tracking-widest">In-Transit...</p>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-10 h-10 text-slate-300 mb-4" />
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest leading-loose">Tap to Select or Drag & Drop</p>
                            <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase">Direct Node-to-Cluster Transfer</p>
                          </>
                        )}
                      </>
                    )}
                    <input id="gallery-upload" type="file" accept="image/*" className="hidden" onChange={async (e) => { 
                      if(e.target.files?.[0]) { 
                        setIsGalleryUploading(true);
                        const url = await handleFileUpload(e.target.files[0], 'gallery'); 
                        if(url) setGalleryForm({...galleryForm, image_url: url}); 
                        setIsGalleryUploading(false);
                      } 
                    }} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Asset Designation (Title)</label>
                  <input required placeholder="Assign unique ID..." value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Asset Annotation (Caption)</label>
                  <textarea rows={3} value={galleryForm.caption} onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-brand-600 outline-none resize-none" placeholder="Secondary asset data..." />
                </div>
                
                <button type="submit" className="w-full py-5 bg-brand-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-100 hover:bg-brand-700 transition-all">{editingGallery ? 'Update Signal' : 'Initiate Secure Transfer'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

