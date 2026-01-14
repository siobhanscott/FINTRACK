import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Edit2, Check, X } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// BudgetTracker Component
export default function BudgetTracker({ transactions, budget, onBudgetUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [budgetAmount, setBudgetAmount] = useState(budget || 0);
    // Calculate total spent from transactions
    const totalSpent = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const remaining = budgetAmount - totalSpent;
    const percentage = budgetAmount > 0 ? Math.min((totalSpent / budgetAmount) * 100, 100) : 0;
    const isOverBudget = remaining < 0;
    // Handle saving the updated budget
    const handleSave = () => {
        onBudgetUpdate(budgetAmount);
        setIsEditing(false);
    };
    // Determine color classes based on budget status
    const getColorClass = () => {
        if (isOverBudget) return 'text-red-500';
        if (percentage > 80) return 'text-orange-500';
        return 'text-emerald-500';
    };
    // Determine bar color based on budget status
    const getBarColor = () => {
        if (isOverBudget) return 'bg-red-500';
        if (percentage > 80) return 'bg-orange-500';
        return 'bg-emerald-500';
    };
    // Render the BudgetTracker component
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                        <Target className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Monthly Budget</h3>
                        {budgetAmount > 0 && (
                            <p className={`text-sm font-medium ${getColorClass()}`}>
                                {isOverBudget ? 'Over budget by' : 'Remaining'}: ${Math.abs(remaining).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                        )}
                    </div>
                </div>
                {!isEditing && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit2 className="w-4 h-4 text-slate-400" />
                    </Button>
                )}
            </div>

            {isEditing ? (
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex-1">
                        <Input
                            type="number"
                            value={budgetAmount}
                            onChange={(e) => setBudgetAmount(Number(e.target.value))}
                            placeholder="Enter budget amount"
                            className="w-full"
                        />
                    </div>
                    <Button
                        size="icon"
                        onClick={handleSave}
                        className="bg-emerald-500 hover:bg-emerald-600"
                    >
                        <Check className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setBudgetAmount(budget || 0);
                            setIsEditing(false);
                        }}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : budgetAmount === 0 ? (
                <div className="text-center py-6">
                    <p className="text-slate-500 mb-3">Set a monthly budget to track your spending</p>
                    <Button onClick={() => setIsEditing(true)}>
                        Set Budget
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Spent: ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <span className="text-slate-600">Budget: ${budgetAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full rounded-full ${getBarColor()}`}
                        />
                    </div>
                    <div className="text-center">
                        <span className={`text-2xl font-bold ${getColorClass()}`}>
                            {percentage.toFixed(0)}%
                        </span>
                        <span className="text-slate-500 ml-2">of budget used</span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
