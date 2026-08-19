  const roleContent = {
    employer: {
      image: 'images/blog2.webp',
      alt: 'Colleagues celebrating in a bright office',
      quote: '&ldquo;The advisor in your first meeting is the advisor who runs the work.&rdquo;',
      cite: 'Stackly HR Partners',
      subtext: 'Sign in to your workspace to review shortlists and pipeline activity.',
      emailLabel: 'Work email',
      submit: 'Sign in'
    },
    candidate: {
      image: 'images/blog1.webp',
      alt: 'Candidates working together on laptops',
      quote: '&ldquo;Represented properly, briefed honestly, never sent blind.&rdquo;',
      cite: 'Stackly Candidate Care',
      subtext: 'Sign in to track your applications, interviews and offers.',
      emailLabel: 'Email',
      submit: 'Sign in as candidate'
    }
  };

  const roleBtns = document.querySelectorAll('.si-toggle button');
  const imageEl = document.getElementById('si-image');
  const quoteEl = document.getElementById('si-quote');
  const citeEl = document.getElementById('si-cite');
  const subtextEl = document.getElementById('si-subtext');
  const emailLabelEl = document.getElementById('si-email-label');
  const submitEl = document.getElementById('si-submit');
  const signInForm = document.querySelector('.si-form form');
  const emailInput = document.getElementById('si-email');

  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.getAttribute('data-role');
      const c = roleContent[role];
      imageEl.src = c.image;
      imageEl.alt = c.alt;
      quoteEl.innerHTML = c.quote;
      citeEl.textContent = c.cite;
      subtextEl.textContent = c.subtext;
      emailLabelEl.textContent = c.emailLabel;
      submitEl.textContent = c.submit;
    });
  });

  signInForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!signInForm.reportValidity()) return;

    if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(emailInput.value.trim())) {
      emailInput.setCustomValidity('Please enter a valid email address.');
      emailInput.reportValidity();
      emailInput.setCustomValidity('');
      return;
    }

    const selectedRole = document.querySelector('.si-toggle button.active')?.dataset.role;
    const dashboard = selectedRole === 'candidate'
      ? 'candidate-dashboard (2).html'
      : 'employer-dashboard (2).html';

    localStorage.setItem('stacklyUserEmail', emailInput.value.trim());
    window.location.href = dashboard;
  });

  // Password show/hide toggle
  const passwordInput = document.getElementById('si-password');
  const passwordToggle = document.getElementById('si-password-toggle');

  if (passwordToggle) {
    passwordToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      passwordToggle.classList.toggle('active');
    });
  }
