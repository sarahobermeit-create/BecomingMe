import { ArrowDownRight, ArrowUpRight, Plus, Trash2, Wallet, X } from "lucide-react";
import { useState } from "react";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { useBudget, useSaveTransaction } from "#client/features/budget/budget.api.ts";
import type { Transaction, TransactionType } from "#shared/budget.ts";

export function BudgetPage() {
  const budgetQuery = useBudget();
  const saveTransaction = useSaveTransaction();
  const todayStr = new Date().toISOString().split("T")[0] ?? "";

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [date, setDate] = useState(todayStr);

  const categories = [
    "Groceries",
    "Dining Out",
    "Housing & Rent",
    "Utilities",
    "Health",
    "Entertainment",
    "Subscriptions",
    "Salary",
    "Investments",
    "Other",
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmt = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmt) || parsedAmt <= 0) return;

    saveTransaction.mutate({
      id: crypto.randomUUID(),
      date,
      type,
      category,
      amount: parsedAmt,
      title: title.trim(),
      deleted: false,
      changedAt: Date.now(),
    });

    setTitle("");
    setAmount("");
    setIsAddOpen(false);
  };

  const handleDelete = (tx: Transaction) => {
    if (window.confirm(`Delete "${tx.title}"?`)) {
      saveTransaction.mutate({
        ...tx,
        deleted: true,
        changedAt: Date.now(),
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <QueryBoundary query={budgetQuery}>
        {(transactions) => {
          const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
          const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
          const netSavings = totalIncome - totalExpense;
          const filtered = transactions.filter((t) => filterType === "all" || t.type === filterType);

          return (
            <>
              {/* Header KPI cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl glass-panel border border-emerald-500/20">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" /> Total Income
                  </span>
                  <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">${totalIncome.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-2xl glass-panel border border-rose-500/20">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <ArrowDownRight className="w-4 h-4 text-rose-400" /> Total Expenses
                  </span>
                  <p className="text-2xl font-bold font-mono text-rose-400 mt-1">${totalExpense.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-cyan-400" /> Net Balance
                  </span>
                  <p className={`text-2xl font-bold font-mono mt-1 ${netSavings >= 0 ? "text-cyan-400" : "text-rose-400"}`}>
                    ${netSavings.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2 text-xs">
                  {(["all", "income", "expense"] as const).map((ft) => (
                    <button
                      key={ft}
                      onClick={() => setFilterType(ft)}
                      className={`px-3 py-1.5 rounded-xl border capitalize transition-all ${
                        filterType === ft
                          ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50"
                          : "bg-white/[0.03] text-slate-400 border-white/10 hover:text-white"
                      }`}
                    >
                      {ft}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Transaction</span>
                </button>
              </div>

              {/* Transaction List */}
              <div className="space-y-2">
                {filtered.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-xl glass-panel border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">{tx.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span className="capitalize">{tx.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-sm font-bold ${
                          tx.type === "income" ? "text-emerald-400" : "text-slate-200"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                      </span>
                      <button onClick={() => handleDelete(tx)} className="p-1 text-slate-600 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-xs text-slate-400 py-8 text-center">No transactions logged yet.</p>
                )}
              </div>

              {/* Add Transaction Modal */}
              {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel text-slate-100 shadow-2xl border border-emerald-500/30">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h2 className="text-lg font-bold">Add Transaction</h2>
                      <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddSubmit} className="space-y-3 mt-4 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                          <select
                            value={type}
                            onChange={(e) => setType(e.target.value as TransactionType)}
                            className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                          >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="45.00"
                            className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Description / Title</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Farmer's Market Organic Veggies"
                          className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg glass-input"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsAddOpen(false)}
                          className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          );
        }}
      </QueryBoundary>
    </div>
  );
}
