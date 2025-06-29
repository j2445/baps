document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    if (username === 'baps' && password === 'Baps1907') {
        // Successful login
        sessionStorage.setItem('loggedIn', 'true'); // Changed from localStorage
        window.location.href = 'list.html'; // Redirect to your main page
    } else {
        // Failed login
        errorMessage.textContent = 'Invalid username or password.';
    }
});