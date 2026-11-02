const INCOME_CATEGORIES = ['salary', 'scholarship', 'allowance', 'freelance', 'other-income'];

const CATEGORY_CONFIG = {
  salary:          { label: 'Part-time Job', emoji: '💼', type: 'income' },
  scholarship:     { label: 'Scholarship',   emoji: '🎓', type: 'income' },
  allowance:       { label: 'Allowance',     emoji: '🏠', type: 'income' },
  freelance:       { label: 'Freelance',     emoji: '💻', type: 'income' },
  'other-income':  { label: 'Other Income',  emoji: '💰', type: 'income' },
  food:            { label: 'Food & Dining', emoji: '🍕', type: 'expense' },
  transport:       { label: 'Transport',     emoji: '🚌', type: 'expense' },
  books:           { label: 'Books',         emoji: '📚', type: 'expense' },
  rent:            { label: 'Rent',          emoji: '🏡', type: 'expense' },
  utilities:       { label: 'Utilities',     emoji: '⚡', type: 'expense' },
  entertainment:   { label: 'Entertainment', emoji: '🎮', type: 'expense' },
  health:          { label: 'Health',        emoji: '💊', type: 'expense' },
  clothing:        { label: 'Clothing',      emoji: '👕', type: 'expense' },
  subscriptions:   { label: 'Subscriptions', emoji: '📱', type: 'expense' },
  'other-expense': { label: 'Other',         emoji: '📦', type: 'expense' },
};

const CHART_COLORS = [
  '#7c5cfc', '#f87171', '#34d399', '#fbbf24', '#60a5fa',
  '#f472b6', '#a78bfa', '#fb923c', '#2dd4bf', '#e879f9',
];

let transactions = JSON.parse(localStorage.getItem('sba_transactions') || '[]');
let currentFilter = 'all';

const form = document.getElementById('transaction-form');
const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const dateInput = document.getElementById('date');
const listEl = document.getElementById('transactions-list');
const listEmpty = document.getElementById('list-empty');
const chartEmpty = document.getElementById('chart-empty');
const canvas = document.getElementById('pie-chart');
const legendEl = document.getElementById('chart-legend');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const balanceEl = document.getElementById('balance');

dateInput.value = new Date().toISOString().split('T')[0];

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const txn = {
    id: Date.now(),
    description: descInput.value.trim(),
    amount: parseFloat(amountInput.value),
    category: categorySelect.value,
    type: INCOME_CATEGORIES.includes(categorySelect.value) ? 'income' : 'expense',
    date: dateInput.value,
  };
  transactions.unshift(txn);
  save();
  render();
  form.reset();
  dateInput.value = new Date().toISOString().split('T')[0];
});

document.querySelectorAll('.filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderList();
  });
});

function save() {
  localStorage.setItem('sba_transactions', JSON.stringify(transactions));
}

function deleteTransaction(id) {
  transactions = transactions.filter(function (t) { return t.id !== id; });
  save();
  render();
}

function formatMoney(n) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function render() {
  var totalIncome = 0;
  var totalExpenses = 0;
  transactions.forEach(function (t) {
    if (t.type === 'income') totalIncome += t.amount;
    else totalExpenses += t.amount;
  });
  totalIncomeEl.textContent = formatMoney(totalIncome);
  totalExpensesEl.textContent = formatMoney(totalExpenses);
  balanceEl.textContent = formatMoney(totalIncome - totalExpenses);
  renderList();
  renderChart();
}

function renderList() {
  var filtered = transactions.filter(function (t) {
    if (currentFilter === 'all') return true;
    return t.type === currentFilter;
  });

  if (filtered.length === 0) {
    listEmpty.style.display = 'flex';
    var items = listEl.querySelectorAll('.transaction-item');
    items.forEach(function (el) { el.remove(); });
    return;
  }

  listEmpty.style.display = 'none';
  var html = '';
  filtered.forEach(function (t) {
    var config = CATEGORY_CONFIG[t.category] || { label: t.category, emoji: '💵' };
    var sign = t.type === 'income' ? '+' : '-';
    html += '<div class="transaction-item">'
      + '<div class="txn-icon ' + t.type + '">' + config.emoji + '</div>'
      + '<div class="txn-details">'
      + '<div class="txn-desc">' + escapeHtml(t.description) + '</div>'
      + '<div class="txn-meta"><span>' + config.label + '</span><span>' + formatDate(t.date) + '</span></div>'
      + '</div>'
      + '<span class="txn-amount ' + t.type + '">' + sign + formatMoney(t.amount) + '</span>'
      + '<button class="txn-delete" onclick="deleteTransaction(' + t.id + ')" title="Delete">&times;</button>'
      + '</div>';
  });

  var temp = document.createElement('div');
  temp.innerHTML = html;
  var items = listEl.querySelectorAll('.transaction-item');
  items.forEach(function (el) { el.remove(); });
  while (temp.firstChild) {
    listEl.appendChild(temp.firstChild);
  }
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  var parts = dateStr.split('-');
  var d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderChart() {
  var expensesByCategory = {};
  transactions.forEach(function (t) {
    if (t.type !== 'expense') return;
    if (!expensesByCategory[t.category]) expensesByCategory[t.category] = 0;
    expensesByCategory[t.category] += t.amount;
  });

  var entries = Object.keys(expensesByCategory).map(function (key) {
    return { category: key, amount: expensesByCategory[key] };
  });
  entries.sort(function (a, b) { return b.amount - a.amount; });

  if (entries.length === 0) {
    canvas.style.display = 'none';
    chartEmpty.style.display = 'flex';
    legendEl.innerHTML = '';
    return;
  }

  canvas.style.display = 'block';
  chartEmpty.style.display = 'none';

  var total = entries.reduce(function (sum, e) { return sum + e.amount; }, 0);
  var ctx = canvas.getContext('2d');
  var size = 220;
  var center = size / 2;
  var radius = size / 2 - 8;
  canvas.width = size * 2;
  canvas.height = size * 2;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(2, 2);
  ctx.clearRect(0, 0, size, size);

  var startAngle = -Math.PI / 2;
  entries.forEach(function (entry, i) {
    var sliceAngle = (entry.amount / total) * 2 * Math.PI;
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
  ctx.font = '600 16px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatMoney(total), center, center - 8);
  ctx.fillStyle = '#8888aa';
  ctx.font = '500 11px Inter, sans-serif';
  ctx.fillText('Total Spent', center, center + 10);

  var legendHtml = '';
  entries.forEach(function (entry, i) {
    var config = CATEGORY_CONFIG[entry.category] || { label: entry.category };
    var pct = ((entry.amount / total) * 100).toFixed(0);
    legendHtml += '<div class="legend-item">'
      + '<span class="legend-dot" style="background:' + CHART_COLORS[i % CHART_COLORS.length] + '"></span>'
      + '<span>' + config.label + ' (' + pct + '%)</span>'
      + '</div>';
  });
  legendEl.innerHTML = legendHtml;
}

render();
