document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const profile = await apiCall('/students/profile');
        
        document.getElementById('studentName').textContent = profile.name;
        document.getElementById('profileName').textContent = profile.name;
        document.getElementById('profileIndex').textContent = profile.indexNo;
        document.getElementById('profileProgram').textContent = profile.program;
        document.getElementById('profileBatch').textContent = profile.batch;

    } catch (error) {
        console.error('Profile error:', error);
        if (error.message.includes('token')) {
            logout();
        }
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