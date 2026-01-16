import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalInvoices: 0,
        totalRevenue: 0,
        recentSales: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Since we don't have a dedicated stats endpoint, we'll derive from invoices
            const response = await api.get('/invoices');
            if (response.data.success) {
                const invoices = response.data.data;
                const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
                // Count sales from last 30 days
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const recentSales = invoices.filter(inv => new Date(inv.createdAt) > thirtyDaysAgo).length;

                setStats({
                    totalInvoices: invoices.length,
                    totalRevenue,
                    recentSales
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Invoices</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalInvoices}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-800">Rs {stats.totalRevenue.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Recent Sales (30d)</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.recentSales}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
