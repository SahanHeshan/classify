document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const student = getStudentData();
    document.getElementById('studentName').textContent = student.name;

    try {
        // Fetch GPA
        const gpaData = await apiCall('/students/gpa');
        document.getElementById('gpaValue').textContent = gpaData.gpa;
        document.getElementById('fgpaValue').textContent = gpaData.gpa; // Same for now

        // Fetch results
        const results = await apiCall('/students/results');
        displayResults(results);

    } catch (error) {
        console.error('Results error:', error);
        if (error.message.includes('token')) {
            logout();
        }
    }

    function displayResults(results) {
        const tbody = document.querySelector('#resultsTable tbody');
        tbody.innerHTML = '';

        if (results.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No results available</td></tr>';
            return;
        }

        results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.subject_code}</td>
                <td>${result.subject_name}</td>
                <td><span class="grade-badge">${result.grade}</span></td>
                <td>${parseFloat(result.gpa).toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});