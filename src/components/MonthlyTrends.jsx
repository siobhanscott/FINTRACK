import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

// Component to display monthly spending trends
export default function MonthlyTrends({ transactions }) {
    const monthlyData = transactions
        .filter(t => t.amount < 0)
        .reduce((acc, t) => {
            const date = new Date(t.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            if (!acc[monthKey]) {
                acc[monthKey] = { month: monthName, spending: 0, sortKey: monthKey };
            }
            acc[monthKey].spending += Math.abs(t.amount);
            return acc;
        }, {});

    // Transform the data into an array and sort by month
    const chartData = Object.values(monthlyData)
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
        .map(item => ({
            month: item.month,
            spending: Math.round(item.spending)
        }));

    if (chartData.length === 0) {
        return null;
    }
    // Calculate average spending
    const avgSpending = Math.round(chartData.reduce((sum, m) => sum + m.spending, 0) / chartData.length);
    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-100">
                    <p className="font-medium text-slate-900">{payload[0].payload.month}</p>
                    <p className="text-rose-500 font-semibold">
                        ${payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };
    // Render the component
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Monthly Spending Trends</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Average: ${avgSpending.toLocaleString()}/month
                    </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            stroke="#94a3b8"
                            fontSize={12}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="spending"
                            stroke="#ef4444"
                            strokeWidth={3}
                            dot={{ fill: '#ef4444', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}