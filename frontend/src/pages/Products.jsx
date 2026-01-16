import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../services/api';
import { ArrowRight, Star } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-16 max-w-7xl text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold text-gray-900 mb-4"
                    >
                        Premium Aluminum Collections
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-500 max-w-2xl mx-auto"
                    >
                        Explore our range of high-performance windows and doors designed for modern living.
                    </motion.p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading catalog...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.length === 0 ? (
                            <div className="col-span-full text-center py-20">
                                <p className="text-gray-500 text-lg">Our catalog is being updated. Check back soon!</p>
                            </div>
                        ) : (
                            products.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={product.imageUrl || 'https://via.placeholder.com/600x400?text=Premium+Window'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">
                                                {product.categoryId?.name || 'Series 1.5mm'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-1">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-semibold">Starting From</p>
                                                <p className="text-xl font-bold text-gray-900">₹{product.pricePerSqft}<span className="text-sm font-normal text-gray-500">/sqft</span></p>
                                            </div>
                                            <Link
                                                to="/calculator"
                                                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                                            >
                                                Calculate Price
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
