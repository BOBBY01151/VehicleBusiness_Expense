import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, DollarSign, Eye, Heart, Filter, Search, Grid, List, Plus, X, Gauge, Fuel, Settings2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { FloatingButton } from '../ui/FloatingButton';

const mockVehicles = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 28500,
    mileage: 15000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'Silver',
    status: 'Available',
    features: ['Bluetooth', 'Backup Camera', 'Cruise Control', 'Heated Seats'],
    description: 'Excellent condition Toyota Camry with low mileage and full service history.',
    vin: 'JT2BF28K3X0123456',
    engine: '2.5L 4-Cylinder',
    drivetrain: 'FWD'
  },
  {
    id: '2',
    make: 'BMW',
    model: 'X3',
    year: 2022,
    price: 45900,
    mileage: 22000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'Black',
    status: 'Available',
    features: ['Navigation', 'Leather Seats', 'Sunroof', 'Premium Audio'],
    description: 'Luxury SUV with premium features and excellent performance.',
    vin: 'WBAXG1C54DD123456',
    engine: '2.0L Turbo',
    drivetrain: 'AWD'
  },
  {
    id: '3',
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    price: 32000,
    mileage: 8500,
    fuelType: 'Gasoline',
    transmission: 'CVT',
    color: 'White',
    status: 'Reserved',
    features: ['Honda Sensing', 'Apple CarPlay', 'All-Wheel Drive'],
    description: 'Nearly new Honda CR-V with advanced safety features.',
    vin: 'JHLRD2H85KC123456',
    engine: '1.5L Turbo',
    drivetrain: 'AWD'
  },
  {
    id: '4',
    make: 'Mercedes',
    model: 'GLA 250',
    year: 2022,
    price: 38500,
    mileage: 18000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'Red',
    status: 'Sold',
    features: ['MBUX Infotainment', 'LED Headlights', 'Panoramic Roof'],
    description: 'Compact luxury SUV with modern technology and style.',
    vin: 'WDC1J4KB4KF123456',
    engine: '2.0L Turbo',
    drivetrain: 'AWD'
  },
  {
    id: '5',
    make: 'Audi',
    model: 'Q5',
    year: 2022,
    price: 42000,
    mileage: 12000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'Blue',
    status: 'Available',
    features: ['Virtual Cockpit', 'Quattro AWD', 'LED Matrix Lights', 'Bang & Olufsen Audio'],
    description: 'Premium SUV with cutting-edge technology and luxury appointments.',
    vin: 'WA1L2AFP1HA123456',
    engine: '2.0L TFSI',
    drivetrain: 'AWD'
  }
];

export function FigmaSales() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'under30k' && vehicle.price < 30000) ||
                        (priceRange === '30k-50k' && vehicle.price >= 30000 && vehicle.price <= 50000) ||
                        (priceRange === 'over50k' && vehicle.price > 50000);
    return matchesSearch && matchesStatus && matchesPrice;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'green';
      case 'Reserved': return 'emerald';
      case 'Sold': return 'lime';
      case 'Under Review': return 'red';
      default: return 'green';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available': 
        return 'bg-green-500/20 text-green-400 border border-green-400/30';
      case 'Reserved': 
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30';
      case 'Sold': 
        return 'bg-blue-500/20 text-blue-400 border border-blue-400/30';
      case 'Under Review': 
        return 'bg-purple-500/20 text-purple-400 border border-purple-400/30';
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
          <h1 className="text-2xl text-white mb-2">Vehicle Sales</h1>
          <p className="text-white/60">Browse and manage vehicle inventory for sale</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1 border border-white/10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-green-500/30 text-green-400' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Grid className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-green-500/30 text-green-400' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50 focus:bg-white/10 transition-all duration-300"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400/50 focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="Available" className="bg-slate-800">Available</option>
                <option value="Reserved" className="bg-slate-800">Reserved</option>
                <option value="Sold" className="bg-slate-800">Sold</option>
                <option value="Under Review" className="bg-slate-800">Under Review</option>
              </select>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400/50 focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">All Prices</option>
                <option value="under30k" className="bg-slate-800">Under $30k</option>
                <option value="30k-50k" className="bg-slate-800">$30k - $50k</option>
                <option value="over50k" className="bg-slate-800">Over $50k</option>
              </select>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/60 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
              <span className="text-sm">Found:</span>
              <span className="text-green-400 text-sm font-semibold">{filteredVehicles.length} vehicles</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Vehicle Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
        <AnimatePresence>
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <GlassCard 
                className={`group cursor-pointer overflow-hidden ${viewMode === 'grid' ? 'p-0' : 'p-6'}`}
                hover
                gradient={getStatusColor(vehicle.status)}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* Vehicle Image */}
                    <div className="relative h-48 bg-gradient-to-r from-slate-800 to-slate-700 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Car className="w-16 h-16 text-white/20" />
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                        >
                          <Heart className="w-4 h-4 text-white" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white text-lg font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                          <p className="text-white/60 text-sm">{vehicle.mileage.toLocaleString()} miles • {vehicle.color}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white text-xl font-bold">${vehicle.price.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60 flex items-center space-x-1">
                            <Settings2 className="w-3 h-3" />
                            <span>Engine:</span>
                          </span>
                          <span className="text-white/90">{vehicle.engine}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60 flex items-center space-x-1">
                            <Gauge className="w-3 h-3" />
                            <span>Trans:</span>
                          </span>
                          <span className="text-white/90">{vehicle.transmission}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60 flex items-center space-x-1">
                            <Fuel className="w-3 h-3" />
                            <span>Fuel:</span>
                          </span>
                          <span className="text-white/90">{vehicle.fuelType}</span>
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedVehicle(vehicle)}
                          className="w-full px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-400/30 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </motion.button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-20 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Car className="w-10 h-10 text-white/40" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white text-lg font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                          <p className="text-white/60 text-sm">{vehicle.mileage.toLocaleString()} miles • {vehicle.engine} • {vehicle.color}</p>
                        </div>
                        <div className="text-right flex items-center space-x-4">
                          <div>
                            <p className="text-white text-xl font-bold">${vehicle.price.toLocaleString()}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadgeClass(vehicle.status)}`}>
                              {vehicle.status}
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedVehicle(vehicle)}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-400/30 rounded-lg transition-all duration-200"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Vehicle Details Modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVehicle(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl font-bold">
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </h2>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Vehicle Image */}
              <div className="h-64 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg flex items-center justify-center mb-6">
                <Car className="w-24 h-24 text-white/20" />
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex space-x-2 bg-white/5 p-1 rounded-lg">
                  {['overview', 'specs', 'features', 'history'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === tab
                          ? 'bg-green-500/30 text-green-400'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px]">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-white/60 text-sm">Price</p>
                        <p className="text-white text-2xl font-bold">${selectedVehicle.price.toLocaleString()}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-white/60 text-sm">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedVehicle.status)}`}>
                          {selectedVehicle.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-2">Description</p>
                      <p className="text-white/90">{selectedVehicle.description}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Engine:</span>
                        <span className="text-white">{selectedVehicle.engine}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Transmission:</span>
                        <span className="text-white">{selectedVehicle.transmission}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Drivetrain:</span>
                        <span className="text-white">{selectedVehicle.drivetrain}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Fuel Type:</span>
                        <span className="text-white">{selectedVehicle.fuelType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Mileage:</span>
                        <span className="text-white">{selectedVehicle.mileage.toLocaleString()} miles</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">VIN:</span>
                        <span className="text-white text-sm">{selectedVehicle.vin}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedVehicle.features.map((feature, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-white/90 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="text-white/60">
                    <p>Vehicle history and maintenance records would be displayed here.</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-white/10 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedVehicle(null)}
                  className="px-6 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  Close
                </motion.button>
                {selectedVehicle.status === 'Available' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg shadow-lg transition-all duration-200"
                    >
                      Reserve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-200"
                    >
                      Buy Now
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

