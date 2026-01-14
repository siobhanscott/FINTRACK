import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '../api/mockBase44';
import { motion } from 'framer-motion';
import { Wallet, RefreshCw } from 'lucide-react';
import { Button } from "../components/ui/button";

import FileUploader from '../components/FileUploader';
import SpendingSummary from '../components/SpendingSummary';
import CategoryBreakdown from '../components/CategoryBreakdown';
import TransactionList from '../components/TransactionList';
import MonthlyTrends from '../components/MonthlyTrends';
import BudgetTracker from '../components/BudgetTracker';
// Dashboard Page Component
export default function Dashboard() {
    const queryClient = useQueryClient();
    const [monthlyBudget, setMonthlyBudget] = useState(0);
    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => base44.entities.Transaction.list('-date', 500),
    });
    // Handle new transactions after file upload
    const handleTransactionsParsed = (newTransactions, isReplace) => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
    };
    // Handle refresh button click
    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg">
                                <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-slate-900">Fintrack</h1>
                                <p className="text-sm text-slate-500">Track your spending</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRefresh}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* File Upload Section */}
                    <section>
                        <motion.h2
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-lg font-medium text-slate-900 mb-4"
                        >
                            Upload Statement
                        </motion.h2>
                        <FileUploader
                            onTransactionsParsed={handleTransactionsParsed}
                            existingCount={transactions.length}
                        />
                    </section>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
                        </div>
                    ) : transactions.length > 0 ? (
                        <>
                            {/* Summary Cards */}
                            <section>
                                <motion.h2
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-lg font-medium text-slate-900 mb-4"
                                >
                                    Overview
                                </motion.h2>
                                <SpendingSummary transactions={transactions} />
                            </section>
                            {/* Budget Tracker */}
                            <section>
                                <BudgetTracker
                                    transactions={transactions}
                                    budget={monthlyBudget}
                                    onBudgetUpdate={setMonthlyBudget}
                                />
                            </section>

                            {/* Monthly Trends */}
                            <section>
                                <MonthlyTrends transactions={transactions} />
                            </section>
                            {/* Category Breakdown */}
                            <section>
                                <CategoryBreakdown transactions={transactions} />
                            </section>

                            {/* Transaction List */}
                            <section>
                                <TransactionList transactions={transactions} />
                            </section>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <Wallet className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No transactions yet</h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Upload your first bank statement above to start tracking your spending automatically.
                            </p>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-100 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-slate-400">
                        Your data is secure and private
                    </p>
                </div>
            </footer>
        </div>
    );
}