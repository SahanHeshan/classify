document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const student = getStudentData();
    document.getElementById('studentName').textContent = student.name;

    let allResults = [];

    try {
        // Fetch overall GPA
        const gpaData = await apiCall('/students/gpa');
        document.getElementById('gpaValue').textContent = gpaData.gpa;
        document.getElementById('totalCourses').textContent = gpaData.totalCourses;

        // Fetch results
        allResults = await apiCall('/students/results');
        displayResults(allResults);
        populateSemesterFilter(allResults);

    } catch (error) {
        console.error('Results error:', error);
        const container = document.getElementById('resultsContainer');
        container.innerHTML = '<div class="no-data">Failed to load results. Please try again.</div>';
        
        if (error.message.includes('token')) {
            logout();
        }
    }

    function displayResults(results, filterSemester = 'all') {
        const container = document.getElementById('resultsContainer');
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = '<div class="no-data">No results available yet.</div>';
            return;
        }

        // Group results by semester
        const resultsBySemester = {};
        results.forEach(result => {
            if (!resultsBySemester[result.semester]) {
                resultsBySemester[result.semester] = [];
            }
            resultsBySemester[result.semester].push(result);
        });

        const sortedSemesters = Object.keys(resultsBySemester).sort((a, b) => a - b);

        sortedSemesters.forEach(semester => {
            if (filterSemester !== 'all' && semester !== filterSemester) {
                return;
            }

            const semesterResults = resultsBySemester[semester];
            
            const semesterGPA = semesterResults[0].gpa || 'N/A';


            const semesterDiv = document.createElement('div');
            semesterDiv.className = 'semester-section';
            
            semesterDiv.innerHTML = `
                <div class="semester-header">
                    <h3>${semester}</h3>
                    <div class="semester-gpa">Semester GPA: ${semesterGPA}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Subject Name</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${semesterResults.map(result => `
                            <tr>
                                <td>${result.subject_name}</td>
                                <td><span class="grade-badge">${result.grade}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            container.appendChild(semesterDiv);
        });

        if (container.children.length === 0) {
            container.innerHTML = '<div class="no-data">No results for selected semester.</div>';
        }
    }

    function populateSemesterFilter(results) {
        const select = document.getElementById('semesterSelect');
        const semesters = [...new Set(results.map(r => r.semester))].sort((a, b) => a - b);

        semesters.forEach(semester => {
            const option = document.createElement('option');
            option.value = semester;
            option.textContent = `${semester}`;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            displayResults(allResults, e.target.value);
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});