document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const student = getStudentData();
    document.getElementById('studentName').textContent = student.name;

    const applicationForm = document.getElementById('applicationForm');
    const existingAppDiv = document.getElementById('existingApplication');
    const newAppDiv = document.getElementById('newApplication');
    const successDiv = document.getElementById('successMessage');
    const errorDiv = document.getElementById('errorMessage');

    try {
        // Check if already applied
        const appStatus = await apiCall('/applications/status');
        
        if (appStatus.choice1) {
            // Show existing application
            existingAppDiv.style.display = 'block';
            newAppDiv.style.display = 'none';
            
            document.getElementById('appStatus').textContent = appStatus.status;
            document.getElementById('appChoice1').textContent = appStatus.choice1;
            document.getElementById('appChoice2').textContent = appStatus.choice2;
            document.getElementById('appChoice3').textContent = appStatus.choice3;
            document.getElementById('appDate').textContent = new Date(appStatus.applied_date).toLocaleDateString();
        } else {
            // Show application form
            existingAppDiv.style.display = 'none';
            newAppDiv.style.display = 'block';
        }

    } catch (error) {
        console.error('Application status error:', error);
        if (error.message.includes('token')) {
            logout();
        }
    }

    // Handle form submission
    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const choice1 = document.getElementById('choice1').value;
            const choice2 = document.getElementById('choice2').value;
            const choice3 = document.getElementById('choice3').value;

            // Clear messages
            successDiv.style.display = 'none';
            errorDiv.style.display = 'none';

            // Validate choices
            if (!choice1 || !choice2 || !choice3) {
                showError('Please select all three choices');
                return;
            }

            if (choice1 === choice2 || choice1 === choice3 || choice2 === choice3) {
                showError('Please select three different specialisations');
                return;
            }

            try {
                const submitBtn = applicationForm.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;

                await apiCall('/applications/submit', 'POST', { choice1, choice2, choice3 });

                showSuccess('Application submitted successfully!');
                
                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            } catch (error) {
                showError(error.message || 'Failed to submit application');
                const submitBtn = applicationForm.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Submit Application';
                submitBtn.disabled = false;
            }
        });
    }

    function showSuccess(message) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        window.scrollTo(0, 0);
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        window.scrollTo(0, 0);
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