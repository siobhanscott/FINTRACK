import React, { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from "../components/ui/button";
import { base44 } from '../api/mockBase44';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../components/ui/alert-dialog";
// FileUploader component for uploading and processing bank statements
export default function FileUploader({ onTransactionsParsed, existingCount }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null
    const [fileName, setFileName] = useState('');
    const [pendingFile, setPendingFile] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }, [existingCount]);

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = (file) => {
        if (existingCount > 0) {
            setPendingFile(file);
            setShowConfirmDialog(true);
        } else {
            processFile(file, false);
        }
    };

    const handleAddToExisting = () => {
        setShowConfirmDialog(false);
        processFile(pendingFile, false);
        setPendingFile(null);
    };

    const handleReplaceAll = async () => {
        setShowConfirmDialog(false);
        // For mock API compatibility: delete all transactions manually
        const allTransactions = await base44.entities.Transaction.list();
        for (const transaction of allTransactions) {
            await base44.entities.Transaction.delete(transaction.id);
        }
        processFile(pendingFile, true);
        setPendingFile(null);
    };

    const processFile = async (file, isReplace) => {
        // Validate file type - accept CSV and PDF
        const fileName = file.name.toLowerCase();
        const isCSV = fileName.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel';
        const isPDF = fileName.endsWith('.pdf') || file.type === 'application/pdf';
        
        if (!isCSV && !isPDF) {
            setFileName(file.name);
            setStatus('error');
            setIsProcessing(false);
            return;
        }

        setFileName(file.name);
        setIsProcessing(true);
        setStatus(null);

        try {
            // Upload the file first
            const { file_url } = await base44.integrations.Core.UploadFile({ file });

            // Extract transaction data using AI
            const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
                file_url,
                json_schema: {
                    type: "object",
                    properties: {
                        transactions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    date: { type: "string", description: "Transaction date in YYYY-MM-DD format" },
                                    description: { type: "string", description: "Clean merchant/transaction name" },
                                    original_description: { type: "string", description: "Original description from statement" },
                                    amount: { type: "number", description: "Amount (negative for expenses, positive for income)" },
                                    category: { 
                                        type: "string", 
                                        enum: ["food_dining", "transportation", "shopping", "entertainment", "utilities", "healthcare", "travel", "groceries", "subscriptions", "income", "transfer", "other"],
                                        description: "Best matching category for this transaction"
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (result.status === "success" && result.output?.transactions) {
                const batchId = Date.now().toString();
                const transactions = result.output.transactions.map(t => ({
                    ...t,
                    batch_id: batchId
                }));
                
                // Save transactions to database
                if (transactions.length > 0) {
                    await base44.entities.Transaction.bulkCreate(transactions);
                }
                
                setStatus('success');
                onTransactionsParsed(transactions, isReplace);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error processing file:', error);
            setStatus('error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
                    ${isDragging 
                        ? 'border-emerald-500 bg-emerald-50/50' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }
                    ${isProcessing ? 'pointer-events-none' : ''}
                `}
            >
                <input
                    type="file"
                    accept=".csv,.pdf,application/pdf,text/csv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isProcessing}
                />
                
                <AnimatePresence mode="wait">
                    {isProcessing ? (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-slate-600 animate-spin" />
                            </div>
                            <div>
                                <p className="text-slate-900 font-medium">Processing {fileName}</p>
                                <p className="text-slate-500 text-sm mt-1">Analyzing transactions...</p>
                            </div>
                        </motion.div>
                    ) : status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-slate-900 font-medium">Successfully parsed!</p>
                                <p className="text-slate-500 text-sm mt-1">Drop another file to add more</p>
                            </div>
                        </motion.div>
                    ) : status === 'error' ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <div>
                                <p className="text-slate-900 font-medium">
                                    {fileName && (fileName.endsWith('.csv') || fileName.endsWith('.pdf')) 
                                        ? 'Failed to parse file' 
                                        : 'Invalid file type'}
                                </p>
                                <p className="text-slate-500 text-sm mt-1">
                                    {fileName && (fileName.endsWith('.csv') || fileName.endsWith('.pdf')) 
                                        ? 'Try a different file' 
                                        : 'Please upload CSV or PDF only'}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className={`
                                w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300
                                ${isDragging ? 'bg-emerald-100' : 'bg-slate-100'}
                            `}>
                                <Upload className={`w-8 h-8 transition-colors duration-300 ${isDragging ? 'text-emerald-600' : 'text-slate-400'}`} />
                            </div>
                            <div>
                                <p className="text-slate-900 font-medium">
                                    Drop your bank statement here
                                </p>
                                <p className="text-slate-500 text-sm mt-1">
                                    Supports CSV Files (More formats coming soon!)
                                </p>
                            </div>
                            <Button variant="outline" className="mt-2 rounded-full px-6">
                                <FileText className="w-4 h-4 mr-2" />
                                Browse files
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You have existing transactions</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have {existingCount} existing transaction{existingCount !== 1 ? 's' : ''}. 
                            Would you like to add the new transactions to your existing data, or start over?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingFile(null)}>Cancel</AlertDialogCancel>
                        <Button variant="outline" onClick={handleAddToExisting}>
                            Add to Existing
                        </Button>
                        <AlertDialogAction onClick={handleReplaceAll} className="bg-red-500 hover:bg-red-600">
                            Replace All
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}