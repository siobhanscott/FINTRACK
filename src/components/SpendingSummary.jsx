import React from 'react';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

// Component to display spending summary statistics
export default function SpendingSummary({ transactions }) {
    const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    // Define statistics to display
    const stats = [
        { label: 'Total Expenses', value: totalExpenses, icon: TrendingDown, color: 'text-rose-500', iconBg: 'bg-rose-100', prefix: '-$' },
        { label: 'Total Income', value: totalIncome, icon: TrendingUp, color: 'text-emerald-500', iconBg: 'bg-emerald-100', prefix: '+$' },
        { label: 'Net Balance', value: Math.abs(netBalance), icon: Wallet, color: netBalance >= 0 ? 'text-emerald-500' : 'text-rose-500', iconBg: netBalance >= 0 ? 'bg-emerald-100' : 'bg-rose-100', prefix: netBalance >= 0 ? '+$' : '-$' }
    ];
    // Render the statistics
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                            <p className={`text-2xl md:text-3xl font-semibold mt-2 ${stat.color}`}>
                                {stat.prefix}{stat.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className={`${stat.iconBg} p-3 rounded-xl`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}