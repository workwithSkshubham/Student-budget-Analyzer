'use client';

import { useState } from 'react';

export default function TransactionForm({ onSubmit }) {
  const today = new Date().toISOString().split('T')[0];
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(today);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ description, amount, category, date });
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(today);
  }

  return (
    <section className="panel add-transaction">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            placeholder="e.g. Textbooks, Part-time job"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Select category</option>
            <optgroup label="Income">
              <option value="salary">Part-time Job</option>
              <option value="scholarship">Scholarship</option>
              <option value="allowance">Allowance</option>
              <option value="freelance">Freelance</option>
              <option value="other-income">Other Income</option>
            </optgroup>
            <optgroup label="Expenses">
              <option value="food">Food &amp; Dining</option>
              <option value="transport">Transport</option>
              <option value="books">Books &amp; Supplies</option>
              <option value="rent">Rent</option>
              <option value="utilities">Utilities</option>
              <option value="entertainment">Entertainment</option>
              <option value="health">Health</option>
              <option value="clothing">Clothing</option>
              <option value="subscriptions">Subscriptions</option>
              <option value="other-expense">Other Expense</option>
            </optgroup>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Transaction</button>
      </form>
    </section>
  );
}
