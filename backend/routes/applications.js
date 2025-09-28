const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Get application status
router.get('/status', authenticateToken, async (req, res) => {
    try {
        const [applications] = await db.query(
            'SELECT * FROM applications WHERE student_id = ? ORDER BY id DESC LIMIT 1',
            [req.user.id]
        );

        if (applications.length === 0) {
            return res.json({ status: 'Not Applied' });
        }

        res.json(applications[0]);
    } catch (error) {
        console.error('Application status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Submit application
router.post('/submit', authenticateToken, async (req, res) => {
    try {
        const { choice1, choice2, choice3 } = req.body;

        if (!choice1 || !choice2 || !choice3) {
            return res.status(400).json({ error: 'All three choices are required' });
        }

        if (choice1 === choice2 || choice1 === choice3 || choice2 === choice3) {
            return res.status(400).json({ error: 'Please select different specialisations' });
        }

        // Check if already applied
        const [existing] = await db.query(
            'SELECT * FROM applications WHERE student_id = ?',
            [req.user.id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'You have already submitted an application' });
        }

        await db.query(
            'INSERT INTO applications (student_id, choice1, choice2, choice3, status, applied_date) VALUES (?, ?, ?, ?, ?, NOW())',
            [req.user.id, choice1, choice2, choice3, 'Pending']
        );

        res.json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Application submit error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
