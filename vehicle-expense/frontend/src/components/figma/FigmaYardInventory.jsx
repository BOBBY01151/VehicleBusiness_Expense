import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Package, Plus, Search, Filter, Move, Zap, AlertTriangle, Truck, X, Edit2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { FloatingButton } from '../ui/FloatingButton';

const mockYardItems = [
  {
    id: '1',
    name: 'Toyota Camry 2020',
    type: 'Vehicle',
    location: { zone: 'A', row: '3', position: '15' },
    status: 'Active',
    condition: 'Good',
    dateAdded: '2024-01-10',
    lastMoved: '2024-01-15',
    value: 18500,
    description: 'Accident damage to front end, engine intact'
  },
  {
    id: '2',
    name: 'BMW Engine Block',
    type: 'Part',
    location: { zone: 'B', row: '1', position: '8' },
    status: 'Ready to Move',
    condition: 'Excellent',
    dateAdded: '2024-01-12',
    lastMoved: '2024-01-12',
    value: 3200,
    description: '3.0L engine block, removed from 2019 BMW X5'
  },
  {
    id: '3',
    name: 'Hydraulic Lift',
    type: 'Equipment',
    location: { zone: 'C', row: '2', position: '5' },
    status: 'Under Repair',
    condition: 'Fair',
    dateAdded: '2023-12-20',
    lastMoved: '2024-01-08',
    value: 8500,
    description: 'Two-post lift, needs hydraulic seal replacement'
  },
  {
    id: '4',
    name: 'Mercedes Transmission',
    type: 'Part',
    location: { zone: 'A', row: '5', position: '22' },
    status: 'Active',
    condition: 'Good',
    dateAdded: '2024-01-18',
    lastMoved: '2024-01-18',
    value: 2800,
    description: '7-speed automatic transmission from 2021 Mercedes C-Class'
  },
  {
    id: '5',
    name: 'Ford F-150 2018',
    type: 'Vehicle',
    location: { zone: 'D', row: '1', position: '3' },
    status: 'Scrapped',
    condition: 'Poor',
    dateAdded: '2023-11-15',
    lastMoved: '2024-01-05',
    value: 1200,
    description: 'Total loss, salvaged for parts'
  },
  {
    id: '6',
    name: 'Audi Engine Parts Set',
    type: 'Part',
    location: { zone: 'B', row: '3', position: '12' },
    status: 'Active',
    condition: 'Excellent',
    dateAdded: '2024-01-20',
    lastMoved: '2024-01-20',
    value: 4500,
    description: 'Complete engine rebuild kit for Audi A4'
  }
];

const yardZones = [
  { id: 'A', name: 'Zone A - Vehicles', color: 'blue', items: 45 },
  { id: 'B', name: 'Zone B - Engine Parts', color: 'green', items: 128 },
  { id: 'C', name: 'Zone C - Equipment', color: 'emerald', items: 23 },
  { id: 'D', name: 'Zone D - Scrap', color: 'red', items: 67 }
];

export function FigmaYardInventory() {
  const [yardItems, setYardItems] = useState(mockYardItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedZone, setSelectedZone] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const filteredItems = yardItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesZone = !selectedZone || item.location.zone === selectedZone;
    return matchesSearch && matchesType && matchesStatus && matchesZone;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active': 
        return 'bg-green-500/20 text-green-400 border border-green-400/30';
      case 'Under Repair': 
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30';
      case 'Ready to Move': 
        return 'bg-blue-500/20 text-blue-400 border border-blue-400/30';
      case 'Scrapped': 
        return 'bg-red-500/20 text-red-400 border border-red-400/30';
      default: 
        return 'bg-gray-500/20 text-gray-400 border border-gray-400/30';
    }
  };

  const getConditionBadgeClass = (condition) => {
    switch (condition) {
      case 'Excellent': 
        return 'bg-green-500/20 text-green-400 border border-green-400/30';
      case 'Good': 
        return 'bg-blue-500/20 text-blue-400 border border-blue-400/30';
      case 'Fair': 
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30';
      case 'Poor': 
        return 'bg-red-500/20 text-red-400 border border-red-400/30';
      default: 
        return 'bg-gray-500/20 text-gray-400 border border-gray-400/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Vehicle': return Truck;
      case 'Part': return Package;
      case 'Equipment': return Zap;
      default: return Package;
    }
  };

  const getZoneColor = (zoneColor) => {
    switch (zoneColor) {
      case 'blue': return 'green';
      case 'green': return 'emerald';
      case 'emerald': return 'lime';
      case 'red': return 'red';
      default: return 'green';
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
          <h1 className="text-2xl text-white mb-2">Yard Inventory</h1>
          <p className="text-white/60">Track and manage items in your vehicle yard</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMap(!showMap)}
            className="px-4 py-2 border border-white/20 text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <MapPin className="w-4 h-4" />
            <span>{showMap ? 'List View' : 'Yard Map'}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Zone Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {yardZones.map((zone, index) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard 
                className={`p-4 cursor-pointer transition-all ${selectedZone === zone.id ? 'ring-2 ring-green-400' : ''}`}
                hover
                gradient={getZoneColor(zone.color)}
                onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{zone.name}</h3>
                    <p className="text-white/60 text-sm">{zone.items} items</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    zone.color === 'blue' ? 'bg-blue-400' :
                    zone.color === 'green' ? 'bg-green-400' :
                    zone.color === 'emerald' ? 'bg-emerald-400' :
                    'bg-red-400'
                  }`}></div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50 focus:bg-white/10 transition-all duration-300"
              />
            </div>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400/50 focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">All Types</option>
                <option value="Vehicle" className="bg-slate-800">Vehicles</option>
                <option value="Part" className="bg-slate-800">Parts</option>
                <option value="Equipment" className="bg-slate-800">Equipment</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400/50 focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="Active" className="bg-slate-800">Active</option>
                <option value="Under Repair" className="bg-slate-800">Under Repair</option>
                <option value="Ready to Move" className="bg-slate-800">Ready to Move</option>
                <option value="Scrapped" className="bg-slate-800">Scrapped</option>
              </select>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/60 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
              <span className="text-sm">Showing:</span>
              <span className="text-green-400 text-sm font-semibold">{filteredItems.length} items</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {showMap ? (
        /* Yard Map View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6 h-96" glow gradient="green">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-white text-lg mb-2">Interactive Yard Map</h3>
                <p className="text-white/60">Drag and drop functionality would be implemented here</p>
                <p className="text-white/40 text-sm mt-2">Click and drag items to move them between zones</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ) : (
        /* Items List View */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, index) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <GlassCard 
                    className="p-6 group cursor-pointer"
                    hover
                    gradient={item.status === 'Active' ? 'green' : item.status === 'Under Repair' ? 'emerald' : 'lime'}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-white/10">
                          <TypeIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white text-lg font-semibold">{item.name}</h3>
                          <p className="text-white/60 text-sm">{item.type}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionBadgeClass(item.condition)}`}>
                        {item.condition}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Location:</span>
                        <span className="text-white font-mono">
                          Zone {item.location.zone}-{item.location.row}-{item.location.position}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Value:</span>
                        <span className="text-white text-lg font-semibold">${item.value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Date Added:</span>
                        <span className="text-white">{item.dateAdded}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Last Moved:</span>
                        <span className="text-white">{item.lastMoved}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-white/90 text-sm">{item.description}</p>
                    </div>

                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-3 py-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Move className="w-4 h-4" />
                        <span>Move</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-3 py-2 text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </motion.button>
                      {item.status === 'Under Repair' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2 text-orange-400 hover:text-orange-300 hover:bg-orange-400/10 rounded-lg transition-all duration-200"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl font-bold">Add New Yard Item</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 mb-2">Item Name</label>
                    <input
                      type="text"
                      placeholder="Enter item name"
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-2">Type</label>
                    <select className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400/50">
                      <option value="" className="bg-slate-800">Select type</option>
                      <option value="Vehicle" className="bg-slate-800">Vehicle</option>
                      <option value="Part" className="bg-slate-800">Part</option>
                      <option value="Equipment" className="bg-slate-800">Equipment</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/90 mb-2">Zone</label>
                    <select className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400/50">
                      <option value="" className="bg-slate-800">Zone</option>
                      <option value="A" className="bg-slate-800">Zone A</option>
                      <option value="B" className="bg-slate-800">Zone B</option>
                      <option value="C" className="bg-slate-800">Zone C</option>
                      <option value="D" className="bg-slate-800">Zone D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/90 mb-2">Row</label>
                    <input
                      type="text"
                      placeholder="Row"
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-2">Position</label>
                    <input
                      type="text"
                      placeholder="Position"
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 mb-2">Condition</label>
                    <select className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400/50">
                      <option value="" className="bg-slate-800">Select condition</option>
                      <option value="Excellent" className="bg-slate-800">Excellent</option>
                      <option value="Good" className="bg-slate-800">Good</option>
                      <option value="Fair" className="bg-slate-800">Fair</option>
                      <option value="Poor" className="bg-slate-800">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/90 mb-2">Value ($)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 mb-2">Description</label>
                  <input
                    type="text"
                    placeholder="Item description"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-6 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-200"
                  >
                    Add Item
                  </motion.button>
                </div>
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
          onClick={() => setIsAddModalOpen(true)}
          variant="primary"
        >
          <Plus className="w-6 h-6" />
        </FloatingButton>
      </motion.div>
    </div>
  );
}

