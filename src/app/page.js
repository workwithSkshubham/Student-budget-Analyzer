'use client';

import { useState, useEffect } from 'react';
import SummaryCards from '@/components/SummaryCards';
import TransactionForm from '@/components/TransactionForm';
import ExpenseChart from '@/components/ExpenseChart';
import TransactionHistory from '@/components/TransactionHistory';

const INCOME_CATEGORIES = ['salary', 'scholarship', 'allowance', 'freelance', 'other-income'];

export default function Home() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('sba_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sba_transactions', JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction(data) {
    const txn = {
      id: Date.now(),
      description: data.description,
      amount: parseFloat(data.amount),
      category: data.category,
      type: INCOME_CATEGORIES.includes(data.category) ? 'income' : 'expense',
      date: data.date,
    };
    setTransactions((prev) => [txn, ...prev]);
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="app">
      <header>
        <div className="logo">
          <span className="logo-icon">$</span>
          <h1>Student Budget Analyzer</h1>
        </div>
        <p className="subtitle">Track your spending. Stay on top of your finances.</p>
      </header>

      <main>
        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />

        <div className="content-grid">
          <TransactionForm onSubmit={addTransaction} />
          <ExpenseChart transactions={transactions} />
        </div>

        <TransactionHistory
          transactions={transactions}
          onDelete={deleteTransaction}
        />
      </main>

      <footer>
        <p>Student Budget Analyzer &mdash; Take control of your finances</p>
      </footer>
    </div>
  );
}
