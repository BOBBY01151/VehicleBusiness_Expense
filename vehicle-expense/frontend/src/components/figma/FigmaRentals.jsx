import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Car, User, MapPin, Plus, Filter, CheckCircle, Eye } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { FloatingButton } from '../ui/FloatingButton';

const mockRentals = [
  {
    id: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    vehicleModel: 'Toyota Camry 2023',
    vehiclePlate: 'ABC-123',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    dailyRate: 89,
    totalAmount: 445,
    status: 'Active',
    pickupLocation: 'Downtown Branch',
    returnLocation: 'Airport Branch'
  },
  {
    id: '2',
    customerName: 'Sarah Smith',
    customerEmail: 'sarah@example.com',
    vehicleModel: 'Honda CR-V 2023',
    vehiclePlate: 'XYZ-789',
    startDate: '2024-01-18',
    endDate: '2024-01-25',
    dailyRate: 95,
    totalAmount: 665,
    status: 'Pending',
    pickupLocation: 'Mall Branch',
    returnLocation: 'Downtown Branch'
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    vehicleModel: 'BMW X3 2022',
    vehiclePlate: 'LMN-456',
    startDate: '2024-01-10',
    endDate: '2024-01-14',
    dailyRate: 125,
    totalAmount: 500,
    status: 'Completed',
    pickupLocation: 'Airport Branch',
    returnLocation: 'Airport Branch'
  },
  {
    id: '4',
    customerName: 'Emily Davis',
    customerEmail: 'emily@example.com',
    vehicleModel: 'Mercedes GLA 2023',
    vehiclePlate: 'QRS-101',
    startDate: '2024-01-22',
    endDate: '2024-01-28',
    dailyRate: 145,
    totalAmount: 870,
    status: 'Active',
    pickupLocation: 'Downtown Branch',
    returnLocation: 'Mall Branch'
  }
];

const availableVehicles = [
  { id: '1', model: 'Toyota Camry 2023', plate: 'ABC-123', dailyRate: 89, status: 'Rented' },
  { id: '2', model: 'Honda CR-V 2023', plate: 'XYZ-789', dailyRate: 95, status: 'Rented' },
  { id: '3', model: 'BMW X3 2022', plate: 'LMN-456', dailyRate: 125, status: 'Available' },
  { id: '4', model: 'Mercedes GLA 2023', plate: 'QRS-101', dailyRate: 145, status: 'Rented' },
  { id: '5', model: 'Audi Q5 2022', plate: 'TUV-202', dailyRate: 135, status: 'Available' },
  { id: '6', model: 'Nissan Altima 2023', plate: 'WXY-303', dailyRate: 75, status: 'Available' }
];

export function FigmaRentals() {
  const [rentals, setRentals] = useState(mockRentals);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRentals = rentals.filter(rental => {
    return statusFilter === 'all' || rental.status === statusFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Pending': return 'emerald';
      case 'Completed': return 'lime';
      case 'Cancelled': return 'red';
      default: return 'green';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active': 
        return 'bg-green-500/20 text-green-400 border border-green-400/30';
      case 'Pending': 
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30';
      case 'Completed': 
        return 'bg-blue-500/20 text-blue-400 border border-blue-400/30';
      case 'Cancelled': 
        return 'bg-red-500/20 text-red-400 border border-red-400/30';
      default: 
        return 'bg-gray-500/20 text-gray-400 border border-gray-400/30';
    }
  };

  const getVehicleStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available': 
        return 'bg-green-500/20 text-green-400 border border-green-400/30';
      case 'Rented': 
        return 'bg-blue-500/20 text-blue-400 border border-blue-400/30';
      case 'Maintenance': 
        return 'bg-orange-500/20 text-orange-400 border border-orange-400/30';
      default: 
        return 'bg-gray-500/20 text-gray-400 border border-gray-400/30';
    }
  };

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl text-white mb-2">Vehicle Rentals</h1>
          <p className="text-white/60">Manage rental bookings and track vehicle availability</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Booking</span>
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-white/60" />
                  <span className="text-white/90 text-sm">Filter by status:</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400/50 focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-800">All Status</option>
                  <option value="Active" className="bg-slate-800">Active</option>
                  <option value="Pending" className="bg-slate-800">Pending</option>
                  <option value="Completed" className="bg-slate-800">Completed</option>
                  <option value="Cancelled" className="bg-slate-800">Cancelled</option>
                </select>
              </div>
            </GlassCard>
          </motion.div>

          {/* Rentals List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredRentals.map((rental, index) => (
                <motion.div
                  key={rental.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <GlassCard 
                    className="p-6 group cursor-pointer"
                    hover
                    gradient={getStatusColor(rental.status)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-white/10">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white text-lg">{rental.vehicleModel}</h3>
                          <p className="text-white/60">Plate: {rental.vehiclePlate}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(rental.status)}`}>
                        {rental.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-white/60" />
                          <span className="text-white/90">{rental.customerName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-white/60" />
                          <span className="text-white/90">{rental.startDate} to {rental.endDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-white/60" />
                          <span className="text-white/90">{rental.pickupLocation}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Daily Rate:</span>
                          <span className="text-white">${rental.dailyRate}/day</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Total Amount:</span>
                          <span className="text-white text-lg font-semibold">${rental.totalAmount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60">Return:</span>
                          <span className="text-white/90 text-sm">{rental.returnLocation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-3 py-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </motion.button>
                      {rental.status === 'Pending' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 px-3 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Confirm</span>
                        </motion.button>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Available Vehicles */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-white text-lg mb-4">Available Vehicles</h3>
              <div className="space-y-3">
                {availableVehicles.map((vehicle) => (
                  <motion.div
                    key={vehicle.id}
                    whileHover={{ x: 4 }}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/90 text-sm">{vehicle.model}</p>
                        <p className="text-white/50 text-xs">{vehicle.plate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-semibold">${vehicle.dailyRate}/day</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs mt-1 ${getVehicleStatusBadgeClass(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6" glow gradient="green">
              <h3 className="text-white text-lg mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Active Rentals</span>
                  <span className="text-green-400 text-xl font-bold">
                    {rentals.filter(r => r.status === 'Active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Pending Bookings</span>
                  <span className="text-lime-400 text-xl font-bold">
                    {rentals.filter(r => r.status === 'Pending').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Available Vehicles</span>
                  <span className="text-emerald-400 text-xl font-bold">
                    {availableVehicles.filter(v => v.status === 'Available').length}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-2"></div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Monthly Revenue</span>
                  <span className="text-white text-xl font-bold">$12,450</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed bottom-8 right-8 z-50"
      >
        <FloatingButton 
          size="lg" 
          variant="primary"
        >
          <Plus className="w-6 h-6" />
        </FloatingButton>
      </motion.div>
    </div>
  );
}

