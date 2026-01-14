import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
    Utensils, Car, ShoppingBag, Film, Zap, Heart,
    Plane, ShoppingCart, CreditCard, DollarSign, ArrowLeftRight, MoreHorizontal,
    ChevronDown, Search, Filter
} from 'lucide-react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Configuration for transaction categories
const categoryConfig = {
    food_dining: { label: 'Food & Dining', icon: Utensils, color: '#f97316', bg: 'bg-orange-50' },
    transportation: { label: 'Transportation', icon: Car, color: '#3b82f6', bg: 'bg-blue-50' },
    shopping: { label: 'Shopping', icon: ShoppingBag, color: '#ec4899', bg: 'bg-pink-50' },
    entertainment: { label: 'Entertainment', icon: Film, color: '#8b5cf6', bg: 'bg-violet-50' },
    utilities: { label: 'Utilities', icon: Zap, color: '#eab308', bg: 'bg-yellow-50' },
    healthcare: { label: 'Healthcare', icon: Heart, color: '#ef4444', bg: 'bg-red-50' },
    travel: { label: 'Travel', icon: Plane, color: '#06b6d4', bg: 'bg-cyan-50' },
    groceries: { label: 'Groceries', icon: ShoppingCart, color: '#22c55e', bg: 'bg-green-50' },
    subscriptions: { label: 'Subscriptions', icon: CreditCard, color: '#6366f1', bg: 'bg-indigo-50' },
    income: { label: 'Income', icon: DollarSign, color: '#10b981', bg: 'bg-emerald-50' },
    transfer: { label: 'Transfer', icon: ArrowLeftRight, color: '#64748b', bg: 'bg-slate-50' },
    other: { label: 'Other', icon: MoreHorizontal, color: '#94a3b8', bg: 'bg-slate-50' }
};
// Component to display a list of transactions with filtering and search
export default function TransactionList({ transactions }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showAll, setShowAll] = useState(false);
    // Filter and sort transactions based on search query and category
    const filteredTransactions = transactions
        .filter(t => {
            const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const displayedTransactions = showAll ? filteredTransactions : filteredTransactions.slice(0, 10);
    // Handle case with no transactions
    if (transactions.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Transactions</h3>
                <p className="text-slate-500 text-center py-8">No transactions yet. Upload a bank statement to get started.</p>
            </div>
        );
    }
    // Render the transaction list with search and filter options
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
            <div className="p-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Transactions
                        <span className="ml-2 text-sm font-normal text-slate-500">
                            ({filteredTransactions.length})
                        </span>
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 w-48 rounded-full border-slate-200"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-40 rounded-full border-slate-200">
                                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {Object.entries(categoryConfig).map(([key, config]) => (
                                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-slate-50">
                <AnimatePresence>
                    {displayedTransactions.map((transaction, index) => {
                        const config = categoryConfig[transaction.category] || categoryConfig.other;
                        const Icon = config.icon;
                        const isExpense = transaction.amount < 0;

                        return (
                            <motion.div
                                key={transaction.id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.02 }}
                                className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors"
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg}`}
                                >
                                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 truncate">{transaction.description}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-sm text-slate-500">
                                            {format(new Date(transaction.date), 'MMM d, yyyy')}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span
                                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                                            style={{
                                                backgroundColor: `${config.color}15`,
                                                color: config.color
                                            }}
                                        >
                                            {config.label}
                                        </span>
                                    </div>
                                </div>
                                <div className={`text-right font-semibold ${isExpense ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {isExpense ? '-' : '+'}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {filteredTransactions.length > 10 && (
                <div className="p-4 border-t border-slate-100">
                    <Button
                        variant="ghost"
                        onClick={() => setShowAll(!showAll)}
                        className="w-full text-slate-600 hover:text-slate-900"
                    >
                        {showAll ? 'Show Less' : `Show All (${filteredTransactions.length - 10} more)`}
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                    </Button>
                </div>
            )}
        </motion.div>
    );
}