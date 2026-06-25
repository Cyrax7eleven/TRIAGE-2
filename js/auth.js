/* =========================================================
   Triage — Authentication
   Demo-only auth: checks a hardcoded admin credential and
   stores a session flag so the main page knows the user
   is signed in. No real backend auth is involved.
   ========================================================= */

const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';
const SESSION_KEY = 'triage_session';

// If a session already exists, skip the login screen.
(function redirectIfLoggedIn() {
  if (sessionStorage.getItem(SESSION_KEY) === 'active') {
    window.location.href = 'main.html';
  }
})();

const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');
const loginErrorText = document.getElementById('loginErrorText');
const signInBtn = document.getElementById('signInBtn');
const signInBtnText = document.getElementById('signInBtnText');
const fillDemoBtn = document.getElementById('fillDemoBtn');

function showError(message) {
  loginErrorText.textContent = message;
  loginError.classList.add('show');
}

function hideError() {
  loginError.classList.remove('show');
}

fillDemoBtn.addEventListener('click', () => {
  usernameInput.value = DEMO_USERNAME;
  passwordInput.value = DEMO_PASSWORD;
  hideError();
  usernameInput.focus();
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  hideError();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showError('Please enter both username and password.');
    return;
  }

  // Tiny artificial delay so the sign-in button's loading
  // state is visible, matching the loading-spinner pattern
  // used later on the issues page.
  signInBtn.disabled = true;
  signInBtnText.textContent = 'Signing in…';

  setTimeout(() => {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'active');
      sessionStorage.setItem('triage_user', username);
      window.location.href = 'main.html';
    } else {
      signInBtn.disabled = false;
      signInBtnText.textContent = 'Sign in';
      showError('Invalid username or password. Try the demo credentials below.');
    }
  }, 400);
});
