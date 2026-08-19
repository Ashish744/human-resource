  const roleContent = {
    employer: {
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop',
      alt: 'Colleagues celebrating in a bright office',
      quote: '&ldquo;The advisor in your first meeting is the advisor who runs the work.&rdquo;',
      cite: 'Stackly HR Partners',
      heading: 'Create your employer account.',
      subtext: 'Post roles and get matched with vetted, pre-briefed candidates.',
      roleLabel: 'Company name',
      rolePlaceholder: 'Volt Bank',
      locationPlaceholder: 'London, UK',
      emailLabel: 'Work email',
      emailPlaceholder: 'you@company.com',
      submit: 'Create employer account'
    },
    candidate: {
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1200&auto=format&fit=crop',
      alt: 'Portrait of a smiling professional woman',
      quote: '&ldquo;One profile, considered roles, no scattergun applications.&rdquo;',
      cite: 'Stackly Candidate Care',
      heading: 'Create your candidate profile.',
      subtext: 'Apply once and let our advisors match you to the right mandates.',
      roleLabel: 'Current or most recent role',
      rolePlaceholder: 'Head of Finance',
      locationPlaceholder: 'London, UK',
      emailLabel: 'Email',
      emailPlaceholder: 'you@email.com',
      submit: 'Create candidate account'
    }
  };

  const roleBtns = document.querySelectorAll('.si-toggle button');
  const imageEl = document.getElementById('si-image');
  const quoteEl = document.getElementById('si-quote');
  const citeEl = document.getElementById('si-cite');
  const headingEl = document.getElementById('si-heading');
  const subtextEl = document.getElementById('si-subtext');
  const roleLabelEl = document.getElementById('si-role-label');
  const roleInputEl = document.getElementById('si-role');
  const locationInputEl = document.getElementById('si-location');
  const emailLabelEl = document.getElementById('si-email-label');
  const emailInputEl = document.getElementById('si-email');
  const submitEl = document.getElementById('si-submit');

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
      headingEl.textContent = c.heading;
      subtextEl.textContent = c.subtext;
      roleLabelEl.textContent = c.roleLabel;
      roleInputEl.placeholder = c.rolePlaceholder;
      locationInputEl.placeholder = c.locationPlaceholder;
      emailLabelEl.textContent = c.emailLabel;
      emailInputEl.placeholder = c.emailPlaceholder;
      submitEl.textContent = c.submit;
    });
  });

  // Password show/hide toggle
  const passwordInput = document.getElementById('si-password');
  const passwordToggle = document.getElementById('si-password-toggle');
  const password2Input = document.getElementById('si-password2');
  const password2Toggle = document.getElementById('si-password-toggle2');

  function setupPasswordToggle(input, toggle) {
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        toggle.classList.toggle('active');
      });
    }
  }

  setupPasswordToggle(passwordInput, passwordToggle);
  setupPasswordToggle(password2Input, password2Toggle);
