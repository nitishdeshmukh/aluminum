import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import DashboardHelper from '../components/Admin/Dashboard';
import RatesEditor from '../components/Admin/RatesEditor';
import InvoiceTable from '../components/Admin/InvoiceTable';
import ProductManager from '../components/Admin/ProductManager';
import CategoryManager from '../components/Admin/CategoryManager'; // Added
import Calculator from '../pages/Calculator';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const tabs = [
        { id: 'dashboard', label: 'Overview' },
        { id: 'calculator', label: 'Calculator' },
        { id: 'products', label: 'Products' },
        { id: 'categories', label: 'Categories' }, // Added
        { id: 'rates', label: 'Manage Rates' },
        { id: 'invoices', label: 'Invoices' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Admin Console</h1>
                        <p className="text-gray-500">Manage rates, view invoices, and test pricing.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                        <div className="px-3">
                            <span className="block text-xs text-gray-400 uppercase font-bold">Logged in as</span>
                            <span className="text-sm font-semibold text-gray-800">{user?.username}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded hover:bg-red-100 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[120px] py-4 px-6 text-center text-sm font-medium transition-all duration-200 relative
                  ${activeTab === tab.id
                                        ? 'text-blue-600 bg-blue-50/50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="transition-all duration-300">
                    {activeTab === 'dashboard' && <DashboardHelper />}

                    {/* Render Calculator inside the Admin Panel */}
                    {activeTab === 'calculator' && (
                        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                            {/* We wrap it to ensure it fits well within the admin layout */}
                            <div className="transform scale-90 -mt-10 origin-top">
                                <Calculator />
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && <ProductManager />}
                    {activeTab === 'categories' && <CategoryManager />}
                    {activeTab === 'rates' && <RatesEditor />}
                    {activeTab === 'invoices' && <InvoiceTable />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
