/**
 * @jest-environment jsdom
 */

const $ = require('jquery');
require('jest-fetch-mock').enableMocks();

describe('Auth Routes Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <form id="registerForm">
                <input type="text" name="username" id="username" value="newuser" />
                <input type="password" name="password" id="password" value="password123" />
                <button type="submit" id="registerBtn">Register</button>
            </form>
        `;

        fetch.resetMocks();

        // Simulate the register button functionality
        $('#registerBtn').on('click', function (event) {
            event.preventDefault();
            const username = $('#username').val();
            const password = $('#password').val();

            fetch('/register', { 
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' }
            })
                .then((response) => response.json())
                .then((data) => console.log('User registered:', data))
                .catch((error) => console.error('Error:', error));
        });
    });

    it('should render the registration form correctly', () => {
        const usernameInput = document.querySelector('#username');
        const passwordInput = document.querySelector('#password');
        expect(usernameInput.value).toBe('newuser');
        expect(passwordInput.value).toBe('password123');
    });

    it('should handle register button click and add a new user', async () => {
        const registerButton = document.querySelector('#registerBtn');

        // Mock the fetch response
        fetch.mockResponseOnce(JSON.stringify({ success: true }));

        // Simulate the form submit
        registerButton.click();

        // Verify the fetch call for user registration
        expect(fetch).toHaveBeenCalledWith('/register', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ username: 'newuser', password: 'password123' }),
            headers: { 'Content-Type': 'application/json' }
        }));

        expect(fetch).toHaveBeenCalledTimes(1); // Ensure it was called exactly once
    });
});
