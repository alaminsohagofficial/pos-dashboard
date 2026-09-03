import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== API ROUTES ====================

// 1. Get All Customers
app.get('/api/customers', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, cg.group_name, cg.discount_percentage 
            FROM customers c 
            LEFT JOIN customer_groups cg ON c.group_id = cg.id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 2. Add a New Customer
app.post('/api/customers', async (req, res) => {
    try {
        const { name, phone, group_id, address } = req.body;
        const newCustomer = await pool.query(
            'INSERT INTO customers (name, phone, group_id, address) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, phone, group_id, address]
        );
        res.json(newCustomer.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 3. Get All Suppliers
app.get('/api/suppliers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM suppliers');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 4. Get Payment Accounts Balance
app.get('/api/payment-accounts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM payment_accounts');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 5. Add Expense Entry
app.post('/api/expenses', async (req, res) => {
    try {
        const { expense_date, category, amount, payment_account_id, notes } = req.body;
        const newExpense = await pool.query(
            'INSERT INTO expenses (expense_date, category, amount, payment_account_id, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [expense_date, category, amount, payment_account_id, notes]
        );
        res.json(newExpense.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
