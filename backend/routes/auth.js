const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const [students] = await db.query(
            'SELECT * FROM students WHERE email = ?',
            [email]
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
            { id: student.id, email: student.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            student: {
                id: student.id,
                name: student.name,
                email: student.email,
                program: student.program,
                batch: student.batch
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
