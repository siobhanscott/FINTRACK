import React from 'react';
import { motion } from 'framer-motion';
import {
    Utensils, Car, ShoppingBag, Film, Zap, Heart,
    Plane, ShoppingCart, CreditCard, DollarSign, ArrowLeftRight, MoreHorizontal
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// Configuration for categories: label, icon, and color
const categoryConfig = {
    food_dining: { label: 'Food & Dining', icon: Utensils, color: '#f97316' },
    transportation: { label: 'Transportation', icon: Car, color: '#3b82f6' },
    shopping: { label: 'Shopping', icon: ShoppingBag, color: '#ec4899' },
    entertainment: { label: 'Entertainment', icon: Film, color: '#8b5cf6' },
    utilities: { label: 'Utilities', icon: Zap, color: '#eab308' },
    healthcare: { label: 'Healthcare', icon: Heart, color: '#ef4444' },
    travel: { label: 'Travel', icon: Plane, color: '#06b6d4' },
    groceries: { label: 'Groceries', icon: ShoppingCart, color: '#22c55e' },
    subscriptions: { label: 'Subscriptions', icon: CreditCard, color: '#6366f1' },
    income: { label: 'Income', icon: DollarSign, color: '#10b981' },
    transfer: { label: 'Transfer', icon: ArrowLeftRight, color: '#64748b' },
    other: { label: 'Other', icon: MoreHorizontal, color: '#94a3b8' }
};

export default function CategoryBreakdown({ transactions }) {
    // Calculate spending by category (only expenses)
    const categoryTotals = transactions
        .filter(t => t.amount < 0)
        .reduce((acc, t) => {
            const cat = t.category || 'other';
            acc[cat] = (acc[cat] || 0) + Math.abs(t.amount);
            return acc;
        }, {});

    const totalSpending = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    // Prepare data for the pie chart
    const chartData = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
            name: categoryConfig[category]?.label || category,
            value: amount,
            color: categoryConfig[category]?.color || '#94a3b8',
            category
        }))
        .sort((a, b) => b.value - a.value);
    // Custom tooltip for pie chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-100">
                    <p className="font-medium text-slate-900">{data.name}</p>
                    <p className="text-slate-600">${data.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
            );
        }
        return null;
    };
    // Handle case with no expense data
    if (chartData.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending by Category</h3>
                <p className="text-slate-500 text-center py-8">No expense data to display</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Spending by Category</h3>

            <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Pie Chart */}
                <div className="w-full lg:w-1/2 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Category List */}
                <div className="w-full lg:w-1/2 space-y-3">
                    {chartData.slice(0, 6).map((item, index) => {
                        const Icon = categoryConfig[item.category]?.icon || MoreHorizontal;
                        const percentage = ((item.value / totalSpending) * 100).toFixed(1);

                        return (
                            <motion.div
                                key={item.category}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-3"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${item.color}15` }}
                                >
                                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-slate-700 truncate">{item.name}</span>
                                        <span className="text-sm font-semibold text-slate-900">
                                            ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.5, delay: index * 0.05 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500 w-12 text-right">{percentage}%</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}