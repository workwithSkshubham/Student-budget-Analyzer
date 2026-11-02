'use client';

function formatMoney(n) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function SummaryCards({ totalIncome, totalExpenses }) {
  const balance = totalIncome - totalExpenses;

  return (
    <section className="summary-cards">
      <div className="card card-income">
        <div className="card-icon">+</div>
        <div className="card-info">
          <span className="card-label">Total Income</span>
          <span className="card-amount">{formatMoney(totalIncome)}</span>
        </div>
      </div>
      <div className="card card-expense">
        <div className="card-icon">&minus;</div>
        <div className="card-info">
          <span className="card-label">Total Expenses</span>
          <span className="card-amount">{formatMoney(totalExpenses)}</span>
        </div>
      </div>
      <div className="card card-balance">
        <div className="card-icon">=</div>
        <div className="card-info">
          <span className="card-label">Balance</span>
          <span className="card-amount">{formatMoney(balance)}</span>
        </div>
      </div>
    </section>
  );
}
