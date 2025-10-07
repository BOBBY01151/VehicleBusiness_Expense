import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, Edit, Trash2, Package, AlertTriangle, X } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { FloatingButton } from '../ui/FloatingButton';

const mockParts = [
  {
    id: '1',
    name: 'Engine Oil 5W-30',
    category: 'Lubricants',
    price: 45.99,
    stock: 127,
    minStock: 50,
    supplier: 'AutoParts Inc.',
    location: 'A-12-B',
    status: 'In Stock'
  },
  {
    id: '2',
    name: 'Brake Pads (Front)',
    category: 'Brakes',
    price: 89.99,
    stock: 23,
    minStock: 25,
    supplier: 'BrakeMax',
    location: 'B-08-A',
    status: 'Low Stock'
  },
  {
    id: '3',
    name: 'Air Filter',
    category: 'Engine',
    price: 24.99,
    stock: 0,
    minStock: 20,
    supplier: 'FilterPro',
    location: 'C-15-C',
    status: 'Out of Stock'
  },
  {
    id: '4',
    name: 'Spark Plugs (Set of 4)',
    category: 'Engine',
    price: 32.99,
    stock: 89,
    minStock: 30,
    supplier: 'IgnitionPlus',
    location: 'A-05-D',
    status: 'In Stock'
  },
  {
    id: '5',
    name: 'Timing Belt',
    category: 'Engine',
    price: 156.99,
    stock: 15,
    minStock: 10,
    supplier: 'TimingTech',
    location: 'D-03-A',
    status: 'In Stock'
  },
  {
    id: '6',
    name: 'Battery 12V',
    category: 'Electrical',
    price: 129.99,
    stock: 34,
    minStock: 15,
    supplier: 'PowerMax',
    location: 'E-07-B',
    status: 'In Stock'
  }
];

export function FigmaSpareParts() {
  const [parts, setParts] = useState(mockParts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          part.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(parts.map(part => part.category)))];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'green';
      case 'Low Stock': return 'emerald';
      case 'Out of Stock': return 'red';
      default: return 'green';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'In Stock': 
        return 'bg-green-500/20 text-green-400 border border-green-400/30';
      case 'Low Stock': 
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30';
      case 'Out of Stock': 
        return 'bg-red-500/20 text-red-400 border border-red-400/30';
      default: 
        return 'bg-gray-500/20 text-gray-400 border border-gray-400/30';
    }
  };

  const handleDelete = (id) => {
    setParts(parts.filter(part => part.id !== id));
  };

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl text-white mb-2">Spare Parts Inventory</h1>
          <p className="text-white/60">Manage your vehicle spare parts and inventory</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Part</span>
        </motion.button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search parts, suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50 focus:bg-white/10 transition-all duration-300"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400/50 focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredParts.map((part, index) => (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <GlassCard 
                className="p-6 group cursor-pointer"
                hover
                gradient={getStatusColor(part.status)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-lg">{part.name}</h3>
                      <p className="text-white/60 text-sm">{part.category}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(part.status)}`}>
                    {part.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Price:</span>
                    <span className="text-white text-lg font-semibold">${part.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Stock:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white">{part.stock}</span>
                      {part.stock <= part.minStock && (
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Location:</span>
                    <span className="text-white">{part.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Supplier:</span>
                    <span className="text-white text-sm">{part.supplier}</span>
                  </div>
                </div>

                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingPart(part)}
                    className="flex-1 px-3 py-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(part.id)}
                    className="flex-1 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(isAddModalOpen || editingPart) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsAddModalOpen(false);
              setEditingPart(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl">
                  {editingPart ? 'Edit Spare Part' : 'Add New Spare Part'}
                </h2>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingPart(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 mb-2">Part Name</label>
                    <input
                      type="text"
                      placeholder="Enter part name"
                      defaultValue={editingPart?.name}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-2">Category</label>
                    <select
                      defaultValue={editingPart?.category}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400/50"
                    >
                      <option value="" className="bg-slate-800">Select category</option>
                      <option value="Engine" className="bg-slate-800">Engine</option>
                      <option value="Brakes" className="bg-slate-800">Brakes</option>
                      <option value="Lubricants" className="bg-slate-800">Lubricants</option>
                      <option value="Electrical" className="bg-slate-800">Electrical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 mb-2">Price ($)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      defaultValue={editingPart?.price}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      placeholder="0"
                      defaultValue={editingPart?.stock}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 mb-2">Supplier</label>
                    <input
                      type="text"
                      placeholder="Supplier name"
                      defaultValue={editingPart?.supplier}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="e.g., A-12-B"
                      defaultValue={editingPart?.location}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingPart(null);
                    }}
                    className="px-6 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-200"
                  >
                    {editingPart ? 'Update Part' : 'Add Part'}
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

