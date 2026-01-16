import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, Award, Settings, ArrowRightCircle } from 'lucide-react';
import api from '../services/api';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            if (response.data.success) {
                setProducts(response.data.data.slice(0, 3)); // Show top 3 products
            }
        } catch (error) {
            console.error('Error fetching products for home:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />

            {/* Hero Section */}
            <div className="relative isolate overflow-hidden">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#60a5fa] to-[#1e40af] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 lg:flex lg:px-8 lg:py-24 items-center">
                    <motion.div
                        className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <div className="mt-12 sm:mt-32 lg:mt-16">
                            <motion.div variants={itemVariants} className="inline-flex space-x-6">
                                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                                    Version 1.0.0
                                </span>
                                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                                    <span>Just shipped</span>
                                    <ArrowRight className="h-4 w-4 text-gray-500" />
                                </span>
                            </motion.div>
                        </div>

                        <motion.h1 variants={itemVariants} className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Precision Aluminum <span className="text-blue-600">Cost Calculator</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="mt-6 text-lg leading-8 text-gray-600">
                            Instantly calculate material costs, weights, and detailed breakdown for 3-track sliding windows. Built for fabricators, designed for accuracy.
                        </motion.p>

                        <motion.div variants={itemVariants} className="mt-10 flex items-center gap-x-6">
                            <Link to="/products" className="group rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 flex items-center gap-2 transition-all">
                                View Products <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/calculator" // Keeping as a secondary option or for admins/testing
                                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-1"
                            >
                                <Calculator className="w-4 h-4" /> Quick Calc
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                            <img
                                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Modern Minimalist Window"
                                width={600}
                                height={400}
                                className="w-full max-w-sm lg:max-w-lg rounded-xl bg-gray-50/5 shadow-2xl ring-1 ring-gray-900/10 object-cover hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* PRODUCT SHOWCASE SECTION */}
            <div className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Collections</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600">
                            Discover our premium aluminum window and door systems.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {loadingProducts ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse bg-white h-96 rounded-2xl shadow-sm"></div>
                            ))
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    key={product._id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
                                >
                                    <div className="h-48 overflow-hidden bg-gray-200">
                                        <img src={product.imageUrl || 'https://via.placeholder.com/400x300'} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                                            <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase">{product.categoryId?.name || 'Standard'}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                            <span className="font-bold text-blue-600">₹{product.pricePerSqft}<span className="text-sm text-gray-400 font-normal">/sqft</span></span>
                                            <Link to="/calculator" className="text-sm font-semibold text-gray-900 flex items-center gap-1 hover:text-blue-600">
                                                Calculate <ArrowRightCircle className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-10 text-gray-500">
                                No products available yet. Check back soon.
                            </div>
                        )}
                    </div>
                    <div className="mt-12 text-center">
                        <Link to="/products" className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500 flex items-center justify-center gap-1">
                            View all products <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Section */}
            <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Why Use AluCalc?</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Stop manual calculations. Get error-free quotes in seconds with our specialized tool.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {[
                            {
                                name: 'Instant Quotes',
                                description: 'Get real-time price estimates based on exact window dimensions.',
                                icon: Calculator,
                                color: 'bg-blue-100 text-blue-600'
                            },
                            {
                                name: 'Premium Materials',
                                description: 'Supports both Powder Coated (Color) and Anodized Silver finishes.',
                                icon: Award,
                                color: 'bg-indigo-100 text-indigo-600'
                            },
                            {
                                name: 'Custom Fabrication',
                                description: 'Detailed breakdown of every component from screws to glass.',
                                icon: Settings,
                                color: 'bg-violet-100 text-violet-600'
                            },
                        ].map((feature) => (
                            <motion.div
                                key={feature.name}
                                className="flex flex-col bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100"
                                whileHover={{ y: -5 }}
                            >
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${feature.color}`}>
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </motion.div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Home;
