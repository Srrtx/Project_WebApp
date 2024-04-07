document.querySelector('#registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    // Get input values
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#comfirm_password').value;
    const firstname = document.querySelector('#firstname').value;
    const lastname = document.querySelector('#lastname').value;

    try {
        // Check if passwords match
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Send registration data to server
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                firstname,
                lastname
            })
        });

        // Handle response from server
        if (response.ok) {
            const message = await response.text();
            alert(message);
            // Optionally redirect user to login page or perform other actions
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        alert(error.message);
    }
});
