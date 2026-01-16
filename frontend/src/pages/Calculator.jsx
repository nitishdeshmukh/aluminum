import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import DimensionInput from '../components/Calculator/DimensionInput';
import FinishTypeToggle from '../components/Calculator/FinishTypeToggle';
import MaterialCheckboxes from '../components/Calculator/MaterialCheckboxes';
import PriceBreakdown from '../components/Calculator/PriceBreakdown';
import TotalDisplay from '../components/Calculator/TotalDisplay';
import InvoiceTemplate from '../components/Calculator/InvoiceTemplate';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, RefreshCw, Save, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Calculator = () => {
    const { user } = useAuth(); // Check if admin is logged in
    const [dimensions, setDimensions] = useState({ width: 4, height: 4 });
    const [finishType, setFinishType] = useState('color');
    const [selectedItems, setSelectedItems] = useState({
        glass: true,
        glassRubber: true,
        trackRubber: true,
        mosquitoNet: true,
        uChannel: true,
        lock: true,
        bearing: true,
        screw: true,
        labour: true
    });
    // Custom items: [{ id: 1, label: 'Discount', cost: -500 }]
    const [customItems, setCustomItems] = useState([]);
    const [calculationResult, setCalculationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [savingInvoice, setSavingInvoice] = useState(false);
    // Customer Info for Invoice
    const [customerName, setCustomerName] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            calculatePrice();
        }, 300);
        return () => clearTimeout(timer);
    }, [dimensions, finishType, selectedItems]);

    // Recalculate totals whenever custom items change
    useEffect(() => {
        if (calculationResult) {
            calculateTotalWithCustomItems(calculationResult);
        }
    }, [customItems]);

    const calculateTotalWithCustomItems = (baseResult) => {
        const customTotal = customItems.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
        const newGrandTotal = baseResult.totals.aluminum + baseResult.totals.materials + baseResult.totals.labour + customTotal;

        setCalculationResult({
            ...baseResult,
            totals: {
                ...baseResult.totals,
                grandTotal: newGrandTotal,
                customTotal: customTotal
            }
        });
    };

    const calculatePrice = async () => {
        if (dimensions.width <= 0 || dimensions.height <= 0) return;

        setLoading(true);
        try {
            const response = await api.post('/calculator/calculate', {
                width: parseFloat(dimensions.width),
                height: parseFloat(dimensions.height),
                finishType,
                selectedItems
            });

            if (response.data.success) {
                // Apply custom items logic immediately
                const baseData = response.data.data;
                const customTotal = customItems.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);

                setCalculationResult({
                    ...baseData,
                    totals: {
                        ...baseData.totals,
                        grandTotal: baseData.totals.grandTotal + customTotal,
                        customTotal
                    }
                });
            }
        } catch (error) {
            console.error('Calculation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDimensionChange = (e) => {
        const { name, value } = e.target;
        setDimensions(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedItems(prev => ({ ...prev, [name]: checked }));
    };

    // Custom Items Handlers
    const addCustomItem = () => {
        const id = Date.now();
        setCustomItems([...customItems, { id, label: 'Extra Charge / Discount', cost: 0 }]);
    };

    const updateCustomItem = (id, field, value) => {
        setCustomItems(items => items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const removeCustomItem = (id) => {
        setCustomItems(items => items.filter(item => item.id !== id));
    };

    const handleSaveInvoice = async () => {
        if (!customerName) {
            alert('Please enter a customer name to save invoice.');
            return;
        }
        setSavingInvoice(true);
        try {
            await api.post('/invoices', {
                customerName: customerName,
                width: dimensions.width,
                height: dimensions.height,
                totalAmount: calculationResult.totals.grandTotal,
                breakdown: calculationResult,
                customItems: customItems
                // phone and address are optional
            });
            alert('Invoice saved successfully!');
            setCustomerName('');
            setCustomItems([]);
        } catch (error) {
            console.error('Save invoice error:', error);
            alert('Failed to save invoice.');
        } finally {
            setSavingInvoice(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
            {/* Hidden Invoice Template for Printing */}
            <div className="hidden print:block">
                <InvoiceTemplate
                    data={calculationResult || {
                        dimensions: { width: 0, height: 0 },
                        totals: { aluminum: 0, materials: 0, labour: 0, grandTotal: 0 },
                        weight: 0,
                        finishType: 'color'
                    }}
                    customItems={customItems}
                />
            </div>

            {/* Main Application UI - Hidden when printing via CSS in index.css */}
            <div className="no-print">
                {/* Only show Navbar if not inside Admin Panel */}
                {!window.location.pathname.includes('/admin/dashboard') && <Navbar />}

                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {!window.location.pathname.includes('/admin/dashboard') && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-10"
                        >
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                                3-Track <span className="text-blue-600">Calculator</span>
                            </h1>
                            <p className="text-gray-500">Configure your window specifications below</p>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Panel: Inputs */}
                        <motion.div
                            className="lg:col-span-4 space-y-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
                                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                                    Dimensions & Finish
                                </h2>
                                <DimensionInput
                                    width={dimensions.width}
                                    height={dimensions.height}
                                    onChange={handleDimensionChange}
                                />
                                <div className="my-6 border-t border-gray-100"></div>
                                <FinishTypeToggle
                                    value={finishType}
                                    onChange={setFinishType}
                                />
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
                                    Components
                                </h2>
                                <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded border border-gray-200">
                                    Uncheck items you already have in stock to exclude them from the price.
                                </p>
                                <MaterialCheckboxes
                                    selectedItems={selectedItems}
                                    onChange={handleCheckboxChange}
                                    breakdown={calculationResult?.breakdown}
                                />
                            </div>
                        </motion.div>

                        {/* Right Panel: Results */}
                        <motion.div
                            className="lg:col-span-8"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-900/5 border-2 border-blue-500/20 relative overflow-hidden">
                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>

                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm">3</span>
                                        Cost Summary
                                    </h2>
                                    {loading && (
                                        <div className="flex items-center gap-2 text-sm text-blue-600">
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Updating...
                                        </div>
                                    )}
                                </div>

                                <AnimatePresence mode='wait'>
                                    {calculationResult ? (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <PriceBreakdown
                                                data={calculationResult}
                                                selectedItems={selectedItems}
                                            />

                                            {/* CUSTOM ITEMS SECTION */}
                                            <div className="mt-6 mb-2">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Additional Items</h4>
                                                    <button onClick={addCustomItem} className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium">
                                                        <Plus className="w-3 h-3" /> Add Item
                                                    </button>
                                                </div>
                                                {customItems.map(item => (
                                                    <div key={item.id} className="flex gap-2 mb-2 items-center">
                                                        <input
                                                            type="text"
                                                            value={item.label}
                                                            onChange={(e) => updateCustomItem(item.id, 'label', e.target.value)}
                                                            className="flex-1 p-2 text-sm border rounded"
                                                            placeholder="Item Name"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={item.cost}
                                                            onChange={(e) => updateCustomItem(item.id, 'cost', parseFloat(e.target.value))}
                                                            className="w-24 p-2 text-sm border rounded text-right"
                                                            placeholder="Price"
                                                        />
                                                        <button onClick={() => removeCustomItem(item.id)} className="text-red-400 hover:text-red-600">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {customItems.length > 0 && (
                                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm mb-4">
                                                        <span className="font-medium text-gray-600">Total Extras:</span>
                                                        <span className="font-bold text-gray-800">
                                                            {calculationResult.totals.customTotal > 0 ? '+' : ''}
                                                            ₹{calculationResult.totals.customTotal?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="my-6 border-t-2 border-dashed border-gray-200"></div>

                                            <TotalDisplay
                                                totals={calculationResult.totals}
                                                dimensions={calculationResult.dimensions}
                                                weight={calculationResult.weight}
                                            />

                                            {/* ACTIONS */}
                                            <div className="mt-8 flex flex-col md:flex-row gap-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handlePrint}
                                                    className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20"
                                                >
                                                    <Printer className="w-5 h-5" />
                                                    Print Official Quote
                                                </motion.button>

                                                {/* Show Save Invoice only if user is logged in (Admin) */}
                                                {user && (
                                                    <div className="flex-1 flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Customer Name"
                                                            value={customerName}
                                                            onChange={(e) => setCustomerName(e.target.value)}
                                                            className="flex-1 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                                                        />
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={handleSaveInvoice}
                                                            disabled={savingInvoice}
                                                            className="px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 whitespace-nowrap"
                                                        >
                                                            {savingInvoice ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                                            Save Invoice
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                            Enter dimensions to see the price estimate
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
