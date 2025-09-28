const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
    try {
        const { indexNo, password } = req.body;

        if (!indexNo || !password) {
            return res.status(400).json({ error: 'Please provide index number and password' });
        }

        const [students] = await db.query(
            'SELECT * FROM students WHERE indexNo = ?',
            [indexNo]
        );

        if (students.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const student = students[0];
        const validPassword = await bcrypt.compare(password, student.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: student.id, indexNo: student.indexNo },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            student: {
                id: student.id,
                indexNo: student.indexNo,
                name: student.name,
                program: student.program,
                batch: student.batch
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { indexNo, name, password, program, batch } = req.body;

        if (!indexNo || !name || !password) {
            return res.status(400).json({ error: 'Please provide index number, name and password' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if indexNo already exists
        const [existing] = await db.query(
            'SELECT id FROM students WHERE indexNo = ?',
            [indexNo]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Index number already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO students (indexNo, name, password, program, batch) VALUES (?, ?, ?, ?, ?)',
            [indexNo, name, hashedPassword, program || 'BSc Geomatics', batch || '2024']
        );

        const token = jwt.sign(
            { id: result.insertId, indexNo: indexNo },
            JWT_SECRET,
            { expiresIn: '4h' }
        );

        res.json({
            token,
            student: {
                id: result.insertId,
                indexNo: indexNo,
                name: name,
                program: program || 'BSc Geomatics',
                batch: batch || '2024'
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;