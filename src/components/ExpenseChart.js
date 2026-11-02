'use client';

import { useRef, useEffect } from 'react';

const CATEGORY_CONFIG = {
  food:            { label: 'Food & Dining' },
  transport:       { label: 'Transport' },
  books:           { label: 'Books' },
  rent:            { label: 'Rent' },
  utilities:       { label: 'Utilities' },
  entertainment:   { label: 'Entertainment' },
  health:          { label: 'Health' },
  clothing:        { label: 'Clothing' },
  subscriptions:   { label: 'Subscriptions' },
  'other-expense': { label: 'Other' },
};

const CHART_COLORS = [
  '#7c5cfc', '#f87171', '#34d399', '#fbbf24', '#60a5fa',
  '#f472b6', '#a78bfa', '#fb923c', '#2dd4bf', '#e879f9',
];

function formatMoney(n) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function ExpenseChart({ transactions }) {
  const canvasRef = useRef(null);

  const expensesByCategory = {};
  transactions.forEach((t) => {
    if (t.type !== 'expense') return;
    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
  });

  const entries = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const total = entries.reduce((sum, e) => sum + e.amount, 0);

  useEffect(() => {
    if (entries.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const size = 220;
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, size, size);

    const center = size / 2;
    const radius = size / 2 - 8;
    let startAngle = -Math.PI / 2;

    entries.forEach((entry, i) => {
      const sliceAngle = (entry.amount / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = CHART_COLORS[i % CHART_COLORS.length];
      ctx.fill();
      startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(center, center, radius * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();

    ctx.fillStyle = '#e8e8f0';
    ctx.font = '600 16px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatMoney(total), center, center - 8);
    ctx.fillStyle = '#a0a0be';
    ctx.font = '500 11px DM Sans, sans-serif';
    ctx.fillText('Total Spent', center, center + 10);
  }, [entries, total]);

  return (
    <section className="panel budget-breakdown">
      <h2>Expense Breakdown</h2>
      <div className="chart-container">
        {entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">&#128200;</div>
            <p>Add some expenses to see your breakdown</p>
          </div>
        ) : (
          <>
            <canvas ref={canvasRef} style={{ maxWidth: 220, maxHeight: 220 }} />
            <div className="legend">
              {entries.map((entry, i) => {
                const config = CATEGORY_CONFIG[entry.category] || { label: entry.category };
                const pct = ((entry.amount / total) * 100).toFixed(0);
                return (
                  <div className="legend-item" key={entry.category}>
                    <span
                      className="legend-dot"
                      style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span>{config.label} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
