import React, { useState } from 'react';
import { useLife } from '../../context/LifeContext';
import {
  Wallet,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  PieChart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import { TransactionType } from '../../types';

export const BudgetModule: React.FC = () => {
  const { state, todayDate, addTransaction, deleteTransaction } = useLife();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // New Transaction Form State
  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [date, setDate] = useState(todayDate);
  const [notes, setNotes] = useState('');

  const categories = [
    'Groceries',
    'Dining Out',
    'Housing & Rent',
    'Utilities',
    'Health & Fitness',
    'Entertainment',
    'Subscriptions',
    'Shopping',
    'Travel',
    'Salary',
    'Investments',
    'Other',
  ];

  const totalIncome = state.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  // Category breakdown for expenses
  const categoryExpenses: Record<string, number> = {};
  state.transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1]);

  const filteredTransactions = state.transactions.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    addTransaction({
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      date,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setAmount('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <span>Budget & Spendings Tracker</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain financial mindfulness, monitor recurring expenses, and track net savings.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Cashflow</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div
            className={`text-2xl font-black font-mono ${
              netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {netSavings >= 0 ? '+' : ''}${netSavings.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Savings Rate: <span className="text-emerald-300 font-bold">{savingsRate}%</span>
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Income</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            ${totalIncome.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> All inflows recorded
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Expenses</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            ${totalExpense.toFixed(2)}
          </div>
          <p className="text-[11px] text-rose-400 mt-1 font-medium flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Outflows recorded
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Transactions</span>
            <PieChart className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {state.transactions.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Logged entries</p>
        </div>
      </div>

      {/* Expense Categories Breakdown Bar */}
      {sortedCategories.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Top Expense Categories
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total ${totalExpense.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {sortedCategories.slice(0, 4).map(([cat, val]) => {
              const pct = totalExpense > 0 ? Math.round((val / totalExpense) * 100) : 0;
              return (
                <div
                  key={cat}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{cat}</span>
                    <span className="font-mono text-slate-300 font-bold">${val.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">{pct}% of spend</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transactions Table & Filters */}
      <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-4">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              Income Inflows
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              Expenses
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="glass-input px-2.5 py-1 rounded-lg text-xs"
            >
              <option value="all" className="bg-[#12141f]">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#12141f]">{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-2">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {isIncome ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{tx.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono">{tx.date}</span>
                        <span>•</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300">
                          {tx.category}
                        </span>
                        {tx.notes && <span className="italic text-slate-400 truncate max-w-xs">{tx.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-sm font-bold ${
                        isIncome ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 italic py-4 text-center">
              No transactions matching the selected filters.
            </p>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141f] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Add Transaction</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  >
                    <option value="expense" className="bg-[#12141f]">Expense (Outflow)</option>
                    <option value="income" className="bg-[#12141f]">Income (Inflow)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Title / Vendor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whole Foods Organic Market"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-[#12141f]">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Additional context or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-900/30"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
