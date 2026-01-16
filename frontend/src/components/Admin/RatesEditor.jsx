import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const LABELS = {
    'alu_color': 'Aluminum Color (Rs/kg)',
    'alu_silver': 'Aluminum Silver (Rs/kg)',
    'glass': 'Glass (Rs/sqft)',
    'glass_rubber': 'Glass Rubber (Rs/ft)',
    'mosquito_net': 'Mosquito Net (Rs/sqft)',

    'u_channel_fixed': 'U-Channel Set Cost (Rs)',
    'screw_fixed': 'Screw Set Cost (Rs)',

    'lock': 'Lock (Rs/unit)',
    'bearing': 'Bearings Set (Rs/window)',

    'labour_min': 'Labour Minimum (Rs)',
    'labour_sqft': 'Labour (Rs/sqft)'
};

const RatesEditor = () => {
    const [rates, setRates] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        try {
            const response = await api.get('/rates');
            if (response.data.success) {
                setRates(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching rates:', error);
            setMessage('Error loading rates');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRates(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const response = await api.put('/rates', rates);
            if (response.data.success) {
                setMessage('Rates updated successfully! Calculator logic updated.');
            }
        } catch (error) {
            console.error('Error updating rates:', error);
            setMessage('Failed to update rates');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading rates...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow rounded-lg p-6"
        >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Configuration & Rates</h2>
            <p className="text-sm text-gray-500 mb-6">
                Modify these values to update the calculator logic instantly.
            </p>

            {message && (
                <div className={`p-3 mb-6 rounded text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Grouping fields for better UI */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-600 border-b pb-2">Aluminum & Glass</h3>
                    {['alu_color', 'alu_silver', 'glass', 'glass_rubber', 'mosquito_net'].map(key => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{LABELS[key] || key}</label>
                            <input
                                type="number"
                                name={key}
                                value={rates[key] || 0}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-600 border-b pb-2">Hardware & Labour</h3>
                    {['lock', 'bearing', 'u_channel_fixed', 'screw_fixed', 'labour_min', 'labour_sqft'].map(key => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{LABELS[key] || key}</label>
                            <input
                                type="number"
                                name={key}
                                value={rates[key] || 0}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                </div>

                <div className="md:col-span-2 mt-4 pt-4 border-t">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-all ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
                    >
                        {saving ? 'Saving...' : 'Update Configuration'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default RatesEditor;
