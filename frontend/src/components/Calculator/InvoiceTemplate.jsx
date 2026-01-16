import React, { forwardRef } from 'react';

const InvoiceTemplate = forwardRef(({ data, customItems = [] }, ref) => {
    if (!data) return null;

    const totalMaterials = data.totals.aluminum + data.totals.materials;
    const totalExtras = customItems.reduce((acc, item) => acc + (parseFloat(item.cost) || 0), 0);
    const finalTotal = data.totals.grandTotal + totalExtras;
    const date = new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div id="print-area" ref={ref} className="bg-white p-6 max-w-4xl mx-auto hidden print:block text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-800 pb-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">INVOICE / ESTIMATE</h1>
                    <p className="text-gray-500 text-sm">Date: {date}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-lg font-bold text-blue-600">AluCalc</h2>
                    <p className="text-xs text-gray-600">Premium Aluminum Windows</p>
                    <p className="text-xs text-gray-500">+91 98765 43210</p>
                </div>
            </div>

            {/* Customer & Job Info - Compact Grid */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Specifications</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500 text-xs">Dimensions</p>
                        <p className="font-semibold">{data.dimensions.width} ft x {data.dimensions.height} ft</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Total Area</p>
                        <p className="font-semibold">{(data.dimensions.width * data.dimensions.height).toFixed(2)} sq.ft</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Finish</p>
                        <p className="font-semibold capitalize">{data.finishType?.replace('_', ' ')}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Alu. Weight</p>
                        <p className="font-semibold">{Number(data.weight || 0).toFixed(2)} kg</p>
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full mb-6 border-collapse">
                <thead>
                    <tr className="border-b border-gray-300">
                        <th className="text-left py-2 text-xs font-bold text-gray-600 uppercase">Item Description</th>
                        <th className="text-right py-2 text-xs font-bold text-gray-600 uppercase">Amount</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-800">Aluminum Profiles & Sections</td>
                        <td className="py-2 text-right font-medium">₹{data.totals.aluminum.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-800">Hardware Kit (Glass, Rubber, Locks, etc.)</td>
                        <td className="py-2 text-right font-medium">₹{data.totals.materials.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-800">Fabrication & Assembly Labour</td>
                        <td className="py-2 text-right font-medium">₹{data.totals.labour.toLocaleString()}</td>
                    </tr>

                    {/* Custom items */}
                    {customItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-2 text-gray-800 flex items-center gap-2">
                                {item.label}
                                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">Extra</span>
                            </td>
                            <td className="py-2 text-right font-medium">₹{parseFloat(item.cost).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals Section - Right Aligned */}
            <div className="flex justify-end mb-8">
                <div className="w-5/12">
                    <div className="flex justify-between py-1 text-sm border-b border-gray-100">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{finalTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 mt-1">
                        <span className="text-base font-bold text-gray-900">Total Payable</span>
                        <span className="text-lg font-bold text-blue-600">₹{finalTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Footer Terms */}
            <div className="pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-400 grid grid-cols-2 gap-8">
                    <div>
                        <p className="font-bold text-gray-500 mb-1">Terms & Conditions:</p>
                        <ul className="list-disc pl-3 space-y-0.5">
                            <li>Estimate valid for 7 days.</li>
                            <li>50% advance required for processing.</li>
                        </ul>
                    </div>
                    <div className="text-right self-end">
                        <p>Thank you for your business!</p>
                        <p className="italic">Authored by AluCalc System</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default InvoiceTemplate;
