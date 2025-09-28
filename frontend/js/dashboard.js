document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const student = getStudentData();
    
    // Update welcome message
    document.getElementById('studentName').textContent = student.name;

    try {
        // Fetch GPA data
        const gpaData = await apiCall('/students/gpa');
        document.getElementById('gpaValue').textContent = gpaData.gpa;
        document.getElementById('totalCourses').textContent = gpaData.totalCourses;

        // Fetch application status
        const appStatus = await apiCall('/applications/status');
        const statusElement = document.getElementById('specializationStatus');
        statusElement.textContent = appStatus.status || 'Not Applied';

    } catch (error) {
        console.error('Dashboard error:', error);
        if (error.message.includes('token')) {
            logout();
        }
    }

    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});