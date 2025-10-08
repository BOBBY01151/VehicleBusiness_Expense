import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, Users, FileText, Package, ArrowRight, Sparkles } from 'lucide-react'

const FigmaAdminDashboard = () => {
  const navigate = useNavigate()

  const dashboards = [
    {
      title: 'Japan Exporter Dashboard',
      description: 'Design and test the exporter interface',
      icon: Truck,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      path: '/exporter',
      features: ['Create Expenses', 'Share with Sri Lanka', 'Manage Parts', 'View Statistics']
    },
    {
      title: 'Sri Lanka User Dashboard',
      description: 'Beautiful Figma-style UI with glassmorphism',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-green-600 to-emerald-600',
      hoverColor: 'hover:from-green-700 hover:to-emerald-700',
      path: '/figma-dashboard',
      features: ['Glassmorphism Design', 'Animated Charts', 'Modern UI Components', 'Real-time Analytics'],
      badge: '✨ Premium Design'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 UI Design Mode
          </h1>
          <p className="text-xl text-gray-600">
            Choose a dashboard to design and test
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Direct access for UI/UX designers - No authentication required
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {dashboards.map((dashboard) => {
            const Icon = dashboard.icon
            return (
              <div
                key={dashboard.path}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`${dashboard.color} p-6 text-white relative overflow-hidden`}>
                  {dashboard.badge && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                      {dashboard.badge}
                    </div>
                  )}
                  <Icon className="h-12 w-12 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">{dashboard.title}</h2>
                  <p className="text-white/90">{dashboard.description}</p>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Features to Design:</h3>
                  <ul className="space-y-2 mb-6">
                    {dashboard.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => navigate(dashboard.path)}
                    className={`w-full ${dashboard.color} ${dashboard.hoverColor} text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors`}
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Access Features */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Quick Access Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-purple-50 rounded-lg">
              <FileText className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Expense Management</h3>
              <p className="text-sm text-gray-600">Create, edit, and share vehicle expenses</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <Package className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Parts Inventory</h3>
              <p className="text-sm text-gray-600">Manage vehicle parts and accessories</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">User Collaboration</h3>
              <p className="text-sm text-gray-600">Share and review expenses between users</p>
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default FigmaAdminDashboard
