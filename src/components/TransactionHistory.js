'use client';

import { useState } from 'react';

const CATEGORY_CONFIG = {
  salary:          { label: 'Part-time Job', emoji: '💼' },
  scholarship:     { label: 'Scholarship',   emoji: '🎓' },
  allowance:       { label: 'Allowance',     emoji: '🏠' },
  freelance:       { label: 'Freelance',     emoji: '💻' },
  'other-income':  { label: 'Other Income',  emoji: '💰' },
  food:            { label: 'Food & Dining', emoji: '🍕' },
  transport:       { label: 'Transport',     emoji: '🚌' },
  books:           { label: 'Books',         emoji: '📚' },
  rent:            { label: 'Rent',          emoji: '🏡' },
  utilities:       { label: 'Utilities',     emoji: '⚡' },
  entertainment:   { label: 'Entertainment', emoji: '🎮' },
  health:          { label: 'Health',        emoji: '💊' },
  clothing:        { label: 'Clothing',      emoji: '👕' },
  subscriptions:   { label: 'Subscriptions', emoji: '📱' },
  'other-expense': { label: 'Other',         emoji: '📦' },
};

function formatMoney(n) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatDate(dateStr) {
  const parts = dateStr.split('-');
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TransactionHistory({ transactions, onDelete }) {
  const [filter, setFilter] = useState('all');

  const filtered = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <section className="panel transaction-history">
      <div className="history-header">
        <h2>Transaction History</h2>
        <div className="filter-group">
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'income' ? 'Income' : 'Expenses'}
            </button>
          ))}
        </div>
      </div>
      <div className="transactions-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">&#128203;</div>
            <p>No transactions yet. Add one above!</p>
          </div>
        ) : (
          filtered.map((t) => {
            const config = CATEGORY_CONFIG[t.category] || { label: t.category, emoji: '💵' };
            const sign = t.type === 'income' ? '+' : '-';
            return (
              <div className="transaction-item" key={t.id}>
                <div className={`txn-icon ${t.type}`}>{config.emoji}</div>
                <div className="txn-details">
                  <div className="txn-desc">{t.description}</div>
                  <div className="txn-meta">
                    <span>{config.label}</span>
                    <span>{formatDate(t.date)}</span>
                  </div>
                </div>
                <span className={`txn-amount ${t.type}`}>{sign}{formatMoney(t.amount)}</span>
                <button
                  className="txn-delete"
                  onClick={() => onDelete(t.id)}
                  title="Delete"
                >
                  &times;
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
