import React from 'react'
import { Users, FileText, Settings, BarChart3, Shield } from 'lucide-react'

const AdminDashboard = () => {
  const stats = [
    {
      name: 'Total Users',
      value: '156',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Expenses',
      value: '1,234',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Active Exporters',
      value: '45',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'System Health',
      value: '99.9%',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const recentActivities = [
    { id: 1, action: 'New user registered', user: 'John Doe', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Expense shared', user: 'Tokyo Export Co.', time: '5 minutes ago', type: 'expense' },
    { id: 3, action: 'User verified', user: 'Sri Lanka Import', time: '10 minutes ago', type: 'verification' },
    { id: 4, action: 'System backup completed', user: 'System', time: '1 hour ago', type: 'system' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              System administration and monitoring
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">System Online</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Manage Users</h3>
                <p className="text-sm opacity-90 mt-1">View and manage all users</p>
              </div>
              <Users className="h-8 w-8" />
            </div>
          </button>
          
          <button className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">View Expenses</h3>
                <p className="text-sm opacity-90 mt-1">Monitor all expenses</p>
              </div>
              <FileText className="h-8 w-8" />
            </div>
          </button>
          
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">System Settings</h3>
                <p className="text-sm opacity-90 mt-1">Configure system</p>
              </div>
              <Settings className="h-8 w-8" />
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'user' ? 'bg-blue-100' :
                  activity.type === 'expense' ? 'bg-green-100' :
                  activity.type === 'verification' ? 'bg-purple-100' :
                  'bg-gray-100'
                }`}>
                  {activity.type === 'user' && <Users className="h-5 w-5 text-blue-600" />}
                  {activity.type === 'expense' && <FileText className="h-5 w-5 text-green-600" />}
                  {activity.type === 'verification' && <Shield className="h-5 w-5 text-purple-600" />}
                  {activity.type === 'system' && <Settings className="h-5 w-5 text-gray-600" />}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{activity.action}</h3>
                  <p className="text-sm text-gray-600">by {activity.user}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Database</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">API Server</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Running</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Email Service</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Configured</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">File Storage</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
