const express = require('express');
const app = express();
app.use(express.json());

// In-memory store (swap for a real DB in production)
let expenses = [
  { id: 1, title: 'Groceries', amount: 54.32, category: 'Food' },
  { id: 2, title: 'Bus Pass', amount: 100.0, category: 'Transport' }
];
let nextId = 3;

// Liveness/readiness probes for Kubernetes
app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/readyz', (req, res) => res.status(200).json({ status: 'ready' }));

app.get('/api/expenses', (req, res) => res.json(expenses));

app.get('/api/expenses/:id', (req, res) => {
  const expense = expenses.find(e => e.id === parseInt(req.params.id, 10));
  if (!expense) return res.status(404).json({ error: 'Not found' });
  res.json(expense);
});

app.post('/api/expenses', (req, res) => {
  const { title, amount, category } = req.body;
  if (!title || amount == null) {
    return res.status(400).json({ error: 'title and amount are required' });
  }
  const expense = { id: nextId++, title, amount, category: category || 'Uncategorized' };
  expenses.push(expense);
  res.status(201).json(expense);
});

app.delete('/api/expenses/:id', (req, res) => {
  const before = expenses.length;
  expenses = expenses.filter(e => e.id !== parseInt(req.params.id, 10));
  if (expenses.length === before) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`expense-tracker-api listening on ${PORT}`));
}

module.exports = app;
