document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday is 0, Saturday is 6

    // Check if it's Saturday (dayOfWeek === 6)
    if (dayOfWeek !== 6) {
        // Not Saturday, show popup
        document.getElementById('notSaturdayPopup').style.display = 'flex';
        errorMessage.textContent = ''; // Clear any previous error message
        return; // Stop the login process
    }

    if (username === 'baps' && password === 'Baps1907') {
        // Successful login
        localStorage.setItem('loggedIn', 'true'); // Changed from sessionStorage to localStorage
        window.location.href = 'index.html';
    } else {
        // Failed login
        errorMessage.textContent = 'Invalid username or password.';
    }
});

// Close popup functionality
document.addEventListener('DOMContentLoaded', function() {
    const closePopupBtn = document.getElementById('closeNotSaturdayPopup');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function() {
            document.getElementById('notSaturdayPopup').style.display = 'none';
        });
    }
});
