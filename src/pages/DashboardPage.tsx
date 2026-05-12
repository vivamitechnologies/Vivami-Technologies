import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, LayoutDashboard, Settings, ListTodo, LogOut, 
  ChevronRight, Edit3, Shield, Key, Bell, Globe,
  Activity, Clock, Mail, Phone, Camera, Trash2, Loader2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    username: user?.username || '',
    avatarUrl: user?.avatarUrl || ''
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { updateUser } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/auth/logs');
        if (res.ok) {
          const data = await res.json();
          setActivityLogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch activity logs');
      }
    };
    if (user) fetchLogs();
  }, [user]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return setMessage({ text: 'Please upload an image file', type: 'error' });
    }

    if (file.size > 5 * 1024 * 1024) {
      return setMessage({ text: 'File size too large (max 5MB)', type: 'error' });
    }

    setIsUploading(true);
    setMessage({ text: '', type: '' });

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
        setMessage({ text: 'Identity verified. Photo updated.', type: 'success' });
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'System error during upload', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFile(file);
  };

  const removePhoto = async () => {
    // For now we just clear it in the profile update
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm, avatarUrl: '' })
      });
      if (res.ok) {
        updateUser({ avatarUrl: '' });
        setEditForm(prev => ({ ...prev, avatarUrl: '' }));
        setMessage({ text: 'Photo removed', type: 'success' });
      }
    } catch (err) {
      console.error('Failed to remove photo');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: This action is permanent. All your data, including activity logs and profile information, will be erased. Are you sure you want to proceed?')) {
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
      setMessage({ text: 'Critical system error', type: 'error' });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (res.ok) {
        updateUser(editForm);
        setIsEditing(false);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to update profile', type: 'error' });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setMessage({ text: 'Passwords do not match', type: 'error' });
    }
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage({ text: 'Password changed successfully!', type: 'success' });
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to change password', type: 'error' });
    }
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading secure session...</div>;

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'profile', name: 'Identity Profile', icon: User },
    { id: 'security', name: 'Security & Access', icon: Shield },
    { id: 'settings', name: 'Preferences', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 p-8 hidden lg:flex flex-col">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h3 className="font-black text-slate-900 leading-tight">{user.fullName}</h3>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">{user.role}</p>
            </div>
          </div>

          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === item.id 
                  ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100' 
                  : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto pt-24 lg:pt-12">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                User Dashboard
              </h1>
              <p className="text-slate-500 font-bold">Welcome back, {user.fullName}. System integrity normal.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-brand-600 transition-all shadow-sm">
                  <Bell className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => { setActiveTab('profile'); setIsEditing(true); }}
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
              {message.text && (
                <motion.p 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-xs font-bold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {message.text}
                </motion.p>
              )}
            </div>
          </header>

          {activeTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'System Access', value: 'Authorized', icon: Activity, color: 'text-blue-600' },
                  { label: 'Inquiries Submitted', value: '3', icon: ListTodo, color: 'text-green-600' },
                  { label: 'Security Score', value: '98%', icon: Shield, color: 'text-brand-600' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                      <h4 className="text-xl font-black text-slate-900">{stat.value}</h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Identity & Logs Section */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <User className="w-6 h-6 text-brand-600" />
                    Account Details
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-50">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recovery Email</p>
                        <p className="font-bold text-slate-700">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-50">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Contact</p>
                        <p className="font-bold text-slate-700">{user.mobile || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-50">
                      <Globe className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time Zone</p>
                        <p className="font-bold text-slate-700">IST (UTC +5:30)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-brand-600" />
                    Access Activity
                  </h3>
                  <div className="space-y-4">
                    {activityLogs.length > 0 ? activityLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${
                            log.action.includes('error') ? 'bg-red-500' : 
                            log.action.includes('password') ? 'bg-orange-500' : 'bg-green-500'
                          }`} />
                          <div>
                            <p className="font-bold text-slate-700 capitalize">{log.action.replace('_', ' ')}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{log.details || 'System event recorded'}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{new Date(log.created_at).toLocaleDateString()}</span>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-slate-400 font-bold">No recent activity detected.</div>
                    )}
                  </div>
                  <button className="w-full mt-8 py-4 text-brand-600 font-black uppercase text-xs tracking-[0.2em] border-t border-slate-50 hover:bg-slate-50 transition-all rounded-b-2xl">
                    View Full Security Log
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100"
            >
              <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-slate-900">Identity Profile</h3>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-brand-600 font-black uppercase text-xs tracking-widest hover:underline"
                      >
                        Edit Details
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.fullName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-brand-600 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.username}
                          onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-brand-600 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-brand-600 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Number</label>
                        <input 
                          type="tel" 
                          value={editForm.mobile}
                          onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value }))}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-brand-600 transition-all"
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-4 mt-4">
                        <button 
                          type="submit"
                          className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg"
                        >
                          Save Changes
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setIsEditing(false); setEditForm({ fullName: user.fullName, email: user.email, mobile: user.mobile, username: user.username, avatarUrl: user.avatarUrl }); }}
                          className="px-8 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Full Name</p>
                        <p className="font-bold text-slate-900 border-b border-slate-50 pb-4">{user.fullName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Username</p>
                        <p className="font-bold text-slate-900 border-b border-slate-50 pb-4">@{user.username}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email Address</p>
                        <p className="font-bold text-slate-900 border-b border-slate-50 pb-4">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mobile Number</p>
                        <p className="font-bold text-slate-900 border-b border-slate-50 pb-4">{user.mobile || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Role</p>
                        <p className="font-bold text-slate-900 capitalize border-b border-slate-50 pb-4">{user.role}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Member Since</p>
                        <p className="font-bold text-slate-900 border-b border-slate-50 pb-4">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-16 pt-10 border-t border-slate-100">
                    <h4 className="text-sm font-black uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                       <AlertCircle className="w-4 h-4" /> Danger Zone
                    </h4>
                    <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 mb-1">Delete Account</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Closing your account will delete all your information and prevent you from accessing the system. This cannot be undone.</p>
                      </div>
                      <button 
                        onClick={handleDeleteAccount}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg active:scale-95"
                      >
                        Terminate Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100"
            >
              <h3 className="text-2xl font-black text-slate-900 mb-8">Security & Access</h3>
              
              <div className="max-w-md">
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-brand-600 transition-colors">
                        <Shield className="w-5 h-5" />
                      </div>
                      <input 
                        type="password" 
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-brand-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-brand-600 transition-colors">
                        <Key className="w-5 h-5" />
                      </div>
                      <input 
                        type="password" 
                        required
                        min={8}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-brand-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm New Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-brand-600 transition-colors">
                        <Key className="w-5 h-5" />
                      </div>
                      <input 
                        type="password" 
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-brand-600 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                  >
                    Update Secure Access
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">System notification and interface preferences coming soon.</div>}
        </div>
      </main>
    </div>
  );
};
