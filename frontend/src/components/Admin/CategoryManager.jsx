import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Tag, Loader2 } from 'lucide-react';
import api from '../../services/api';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setAdding(true);
        try {
            const response = await api.post('/categories', { name: newCategory });
            if (response.data.success) {
                setCategories([response.data.data, ...categories]);
                setNewCategory('');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Failed to create category');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This might affect products using this category.')) return;

        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter(c => c._id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                Manage Categories
            </h2>

            {/* Add Form */}
            <form onSubmit={handleAdd} className="flex gap-3 mb-8">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={adding}
                />
                <button
                    type="submit"
                    disabled={adding || !newCategory.trim()}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add
                </button>
            </form>

            {/* List */}
            {loading ? (
                <div className="text-center py-8 text-gray-400">Loading tags...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <AnimatePresence>
                        {categories.map((cat) => (
                            <motion.div
                                key={cat._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 group"
                            >
                                <span className="font-medium text-gray-700">{cat.name}</span>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Category"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {categories.length === 0 && (
                        <p className="col-span-2 text-center text-gray-400 italic">No categories found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
