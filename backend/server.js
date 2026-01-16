require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const seedDatabase = require('./seeder');

connectDB().then(() => {
  seedDatabase();
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rates', require('./routes/ratesRoutes'));
app.use('/api/calculator', require('./routes/calculatorRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));

app.get('/', (req, res) => {
  res.json({ message: '3-Track Aluminum Window Calculator API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
