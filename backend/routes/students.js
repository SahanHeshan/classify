const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Get profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const [students] = await db.query(
            'SELECT id, indexNo, name, program, batch FROM students WHERE id = ?',
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

//
router.get('/results', authenticateToken, async (req, res) => {
    try {
        const [student] = await db.query(
            'SELECT indexNo FROM students WHERE id = ?',
            [req.user.id]
        );
        const indexNo = student[0].indexNo;

        // Fetch all results
        const [results] = await db.query(
            'SELECT semester, subject_name, grade FROM results WHERE indexNo = ? ORDER BY semester, id',
            [indexNo]
        );

        // Fetch all semester GPAs
        const [semesterGPAs] = await db.query(
            'SELECT semester, gpa FROM semester_gpa WHERE indexNo = ?',
            [indexNo]
        );

        // Map GPA per semester for quick lookup
        const gpaMap = {};
        semesterGPAs.forEach(s => {
            gpaMap[s.semester] = parseFloat(s.gpa).toFixed(2); // ensure number
        });

        // Attach GPA to each result row
        const resultsWithGPA = results.map(r => ({
            ...r,
            gpa: gpaMap[r.semester] || null
        }));

        res.json(resultsWithGPA);
    } catch (err) {
        console.error('Results error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});



// Get overall GPA (average of all semester GPAs)
router.get('/gpa', authenticateToken, async (req, res) => {
    try {
        const [student] = await db.query('SELECT indexNo FROM students WHERE id = ?', [req.user.id]);
        const indexNo = student[0].indexNo;

        // Get average of semester GPAs
        const [gpaData] = await db.query(
            'SELECT AVG(gpa) as average_gpa FROM semester_gpa WHERE indexNo = ?',
            [indexNo]
        );

        // Get total courses count
        const [courseCount] = await db.query(
            'SELECT COUNT(*) as total_courses FROM results WHERE indexNo = ?',
            [indexNo]
        );

        res.json({
            gpa: gpaData[0].average_gpa ? parseFloat(gpaData[0].average_gpa).toFixed(2) : '0.00',
            totalCourses: courseCount[0].total_courses
        });
    } catch (error) {
        console.error('GPA error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;