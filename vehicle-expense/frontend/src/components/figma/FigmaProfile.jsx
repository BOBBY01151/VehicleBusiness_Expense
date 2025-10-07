import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Bell, Lock, Camera, Save, X, Edit2, Activity } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export function FigmaProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const profileData = {
    name: 'Admin User',
    email: 'admin@spaglobal.com',
    phone: '+1 (555) 123-4567',
    role: 'System Administrator',
    location: 'Tokyo, Japan',
    joinDate: 'January 15, 2023',
    department: 'Operations',
    employeeId: 'EMP-2023-001'
  };

  const recentActivity = [
    { id: 1, action: 'Updated vehicle inventory', time: '2 hours ago', type: 'update' },
    { id: 2, action: 'Approved new rental booking', time: '5 hours ago', type: 'approval' },
    { id: 3, action: 'Added new spare part', time: '1 day ago', type: 'create' },
    { id: 4, action: 'Generated monthly report', time: '2 days ago', type: 'report' },
    { id: 5, action: 'Modified user permissions', time: '3 days ago', type: 'security' }
  ];

  const stats = [
    { label: 'Total Actions', value: '1,247', color: 'green' },
    { label: 'This Month', value: '89', color: 'emerald' },
    { label: 'Pending Tasks', value: '12', color: 'lime' },
    { label: 'Resolved Issues', value: '156', color: 'green' }
  ];

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl text-white mb-2">Profile Settings</h1>
          <p className="text-white/60">Manage your account settings and preferences</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="space-y-6">
          {/* Profile Overview Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6" glow gradient="green">
              <div className="flex flex-col items-center text-center">
                {/* Profile Picture */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-0 right-0 p-2 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </motion.button>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-slate-900"></div>
                </div>

                {/* Profile Info */}
                <h2 className="text-white text-xl font-bold mb-1">{profileData.name}</h2>
                <p className="text-white/60 text-sm mb-2">{profileData.role}</p>
                <div className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-400/30 rounded-full text-xs font-medium mb-4">
                  Active
                </div>

                {/* Quick Stats */}
                <div className="w-full grid grid-cols-2 gap-3 mt-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white/60 text-xs mb-1">{stat.label}</p>
                      <p className="text-white text-lg font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-white text-lg mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ x: 4 }}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 flex items-center space-x-3"
                >
                  <Edit2 className="w-4 h-4 text-green-400" />
                  <span className="text-white/90">Edit Profile</span>
                </motion.button>
                <motion.button
                  whileHover={{ x: 4 }}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 flex items-center space-x-3"
                >
                  <Lock className="w-4 h-4 text-green-400" />
                  <span className="text-white/90">Change Password</span>
                </motion.button>
                <motion.button
                  whileHover={{ x: 4 }}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 flex items-center space-x-3"
                >
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-white/90">Security Settings</span>
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right Column - Tabs Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-2">
              <div className="flex space-x-2">
                {['profile', 'security', 'notifications', 'activity'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-green-500/30 text-green-400'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-lg">Personal Information</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-400/30 rounded-lg transition-all duration-200"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        defaultValue={profileData.name}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50 transition-all duration-300 ${
                          !isEditing ? 'cursor-not-allowed opacity-60' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="email"
                        defaultValue={profileData.email}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50 transition-all duration-300 ${
                          !isEditing ? 'cursor-not-allowed opacity-60' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="tel"
                        defaultValue={profileData.phone}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50 transition-all duration-300 ${
                          !isEditing ? 'cursor-not-allowed opacity-60' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        defaultValue={profileData.location}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50 transition-all duration-300 ${
                          !isEditing ? 'cursor-not-allowed opacity-60' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Department</label>
                    <input
                      type="text"
                      defaultValue={profileData.department}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50 transition-all duration-300 ${
                        !isEditing ? 'cursor-not-allowed opacity-60' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Employee ID</label>
                    <input
                      type="text"
                      defaultValue={profileData.employeeId}
                      disabled
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </motion.button>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <GlassCard className="p-6">
                <h3 className="text-white text-lg mb-6">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-200"
                  >
                    Update Password
                  </motion.button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-white text-lg mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <p className="text-white/90">Enable 2FA</p>
                    <p className="text-white/60 text-sm">Add an extra layer of security</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-white text-lg mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Email Notifications', desc: 'Receive email updates for important events' },
                    { title: 'Push Notifications', desc: 'Get push notifications on your device' },
                    { title: 'Sales Updates', desc: 'Notify me about new sales and deals' },
                    { title: 'Rental Updates', desc: 'Notify me about rental bookings' },
                    { title: 'Inventory Alerts', desc: 'Alert me when inventory is low' },
                    { title: 'System Updates', desc: 'Notify me about system maintenance' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="text-white/90">{item.title}</p>
                        <p className="text-white/60 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={index < 3} className="sr-only peer" />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-white text-lg mb-6">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-all duration-200"
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'update' ? 'bg-blue-400' :
                        activity.type === 'approval' ? 'bg-green-400' :
                        activity.type === 'create' ? 'bg-emerald-400' :
                        activity.type === 'report' ? 'bg-purple-400' :
                        'bg-orange-400'
                      }`}></div>
                      <Activity className="w-4 h-4 text-white/60" />
                      <div className="flex-1">
                        <p className="text-white/90">{activity.action}</p>
                        <p className="text-white/50 text-sm">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

