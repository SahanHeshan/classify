document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const errorDiv = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const indexNo = document.getElementById('indexNo').value.trim();
        const password = document.getElementById('password').value;

        // Clear previous errors
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';

        // Basic validation
        if (!indexNo || !password) {
            showError('Please fill in all fields');
            return;
        }

        try {
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;

            // Make API call
            const result = await apiCall('/auth/login', 'POST', { indexNo, password });

            // Store token and student data
            localStorage.setItem('token', result.token);
            localStorage.setItem('student', JSON.stringify(result.student));

            // Redirect to dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            showError(error.message || 'Login failed. Please try again.');
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Log In';
            submitBtn.disabled = false;
        }
    });

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
});
