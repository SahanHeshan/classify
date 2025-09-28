const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Get student profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const [students] = await db.query(
            'SELECT id, name, email, program, batch FROM students WHERE id = ?',
            [req.user.id]
        );

        if (students.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(students[0]);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get student results
router.get('/results', authenticateToken, async (req, res) => {
    try {
        const [results] = await db.query(
            'SELECT * FROM results WHERE student_id = ? ORDER BY id DESC',
            [req.user.id]
        );

        res.json(results);
    } catch (error) {
        console.error('Results error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get student GPA
router.get('/gpa', authenticateToken, async (req, res) => {
    try {
        const [gpaData] = await db.query(
            'SELECT AVG(gpa) as average_gpa, COUNT(*) as total_courses FROM results WHERE student_id = ?',
            [req.user.id]
        );

        res.json({
            gpa: gpaData[0].average_gpa ? parseFloat(gpaData[0].average_gpa).toFixed(2) : '0.00',
            totalCourses: gpaData[0].total_courses
        });
    } catch (error) {
        console.error('GPA error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
