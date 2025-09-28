document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const signupForm = document.getElementById('signupForm');
    const errorDiv = document.getElementById('errorMessage');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const indexNo = document.getElementById('indexNo').value.trim();
        const name = document.getElementById('name').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const program = document.getElementById('program').value;
        const batch = document.getElementById('batch').value;

        // Clear previous errors
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';

        // Validation
        if (!indexNo || !name || !password || !confirmPassword) {
            showError('Please fill in all required fields');
            return;
        }

        // Index number format validation
        const indexPattern = /^\d{2}[A-Z]{3}\d{4}$/;
        if (!indexPattern.test(indexNo)) {
            showError('Invalid index number format.');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        try {
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;

            // Make API call
            const result = await apiCall('/auth/signup', 'POST', {
                indexNo,
                name,
                password,
                program,
                batch
            });

            // Store token and student data
            localStorage.setItem('token', result.token);
            localStorage.setItem('student', JSON.stringify(result.student));

            // Success - redirect to dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            showError(error.message || 'Signup failed. Please try again.');
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Create Account';
            submitBtn.disabled = false;
        }
    });

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Real-time password match validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    confirmPassword.addEventListener('input', () => {
        if (confirmPassword.value && password.value !== confirmPassword.value) {
            confirmPassword.style.borderColor = '#c33';
        } else {
            confirmPassword.style.borderColor = '#ddd';
        }
    });

    // Format index number as user types
    const indexNoInput = document.getElementById('indexNo');
    indexNoInput.addEventListener('input', (e) => {
        let value = e.target.value.toUpperCase();
        // Remove any characters that aren't numbers, letters, or forward slash
        value = value.replace(/[^0-9A-Z/]/g, '');
        e.target.value = value;
    });
});