const roleContent = {
  employer: {
    image: 'images/blog2.webp',
    alt: 'Colleagues celebrating in a bright office',
    quote: '&ldquo;The advisor in your first meeting is the advisor who runs the work.&rdquo;',
    cite: 'Stackly HR Partners',
    heading: 'Create your employer account.',
    subtext: 'Post roles and get matched with vetted, pre-briefed candidates.',
    roleLabel: 'Company name',
    rolePlaceholder: 'Volt Bank',
    emailLabel: 'Work email',
    emailPlaceholder: 'you@company.com',
    submit: 'Create employer account'
  },
  candidate: {
    image: 'images/blog5.webp',
    alt: 'Portrait of a smiling professional woman',
    quote: '&ldquo;One profile, considered roles, no scattergun applications.&rdquo;',
    cite: 'Stackly Candidate Care',
    heading: 'Create your candidate profile.',
    subtext: 'Apply once and let our advisors match you to the right mandates.',
    roleLabel: 'Current or most recent role',
    rolePlaceholder: 'Head of Finance',
    emailLabel: 'Email',
    emailPlaceholder: 'you@email.com',
    submit: 'Create candidate account'
  }
};

const form = document.querySelector('.si-form form');
const roleButtons = document.querySelectorAll('.si-toggle button');
const firstNameInput = document.getElementById('si-first');
const lastNameInput = document.getElementById('si-last');
const emailInput = document.getElementById('si-email');
const passwordInput = document.getElementById('si-password');
const passwordConfirmationInput = document.getElementById('si-password2');
const termsInput = document.getElementById('si-terms');

roleButtons.forEach(button => {
  button.addEventListener('click', () => {
    roleButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');

    const content = roleContent[button.dataset.role];
    document.getElementById('si-image').src = content.image;
    document.getElementById('si-image').alt = content.alt;
    document.getElementById('si-quote').innerHTML = content.quote;
    document.getElementById('si-cite').textContent = content.cite;
    document.getElementById('si-heading').textContent = content.heading;
    document.getElementById('si-subtext').textContent = content.subtext;
    document.getElementById('si-role-label').textContent = content.roleLabel;
    document.getElementById('si-role').placeholder = content.rolePlaceholder;
    document.getElementById('si-email-label').textContent = content.emailLabel;
    emailInput.placeholder = content.emailPlaceholder;
    document.getElementById('si-submit').textContent = content.submit;
  });
});

function setupPasswordToggle(input, button) {
  button.addEventListener('click', event => {
    event.preventDefault();
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    button.classList.toggle('active', isPassword);
    button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });
}

setupPasswordToggle(passwordInput, document.getElementById('si-password-toggle'));
setupPasswordToggle(passwordConfirmationInput, document.getElementById('si-password-toggle2'));

function clearValidationErrors() {
  form.querySelectorAll('.si-field-error').forEach(error => error.remove());
  form.querySelectorAll('.has-error').forEach(field => field.classList.remove('has-error'));
}

function showValidationError(input, message) {
  const field = input.closest('.si-field') || input.closest('.si-terms');
  if (!field) return;
  field.classList.add('has-error');
  const error = document.createElement('span');
  error.className = 'si-field-error';
  error.textContent = message;
  field.appendChild(error);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  clearValidationErrors();

  const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  let isValid = true;
  const validate = (input, condition, message) => {
    if (condition) return;
    showValidationError(input, message);
    isValid = false;
  };

  validate(firstNameInput, namePattern.test(firstNameInput.value.trim()), 'Enter a valid first name using letters only.');
  validate(lastNameInput, namePattern.test(lastNameInput.value.trim()), 'Enter a valid last name using letters only.');
  validate(document.getElementById('si-role'), document.getElementById('si-role').value.trim(), 'Enter your current or most recent role.');
  validate(document.getElementById('si-location'), document.getElementById('si-location').value.trim(), 'Enter your location.');
  validate(emailInput, emailPattern.test(emailInput.value.trim()), 'Enter a valid email address.');
  validate(passwordInput, passwordInput.value.length >= 8, 'Password must be at least 8 characters.');
  validate(passwordConfirmationInput, passwordConfirmationInput.value === passwordInput.value && passwordConfirmationInput.value.length >= 8, 'Passwords must match and be at least 8 characters.');
  validate(termsInput, termsInput.checked, 'Accept the terms of engagement and privacy policy.');

  if (!isValid) return;

  localStorage.setItem('stacklyUserEmail', emailInput.value.trim());
  form.reset();

  const successMessage = document.createElement('p');
  successMessage.className = 'si-success';
  successMessage.textContent = 'Account created successfully. Redirecting to sign in...';
  form.appendChild(successMessage);
  document.getElementById('si-submit').disabled = true;

  window.setTimeout(() => {
    window.location.href = 'signin.html';
  }, 1500);
});
