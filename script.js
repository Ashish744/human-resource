  // Count-up animation for stats + floating card
  function animateCount(el){
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const countEls = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  countEls.forEach(el => countObserver.observe(el));

  // Pricing billing toggle
  const billingBtns = document.querySelectorAll('.billing-option');
  const priceAmounts = document.querySelectorAll('.pt-price .amount[data-monthly]');
  billingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      billingBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-billing');
      priceAmounts.forEach(el => {
        el.textContent = mode === 'yearly' ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
      });
    });
  });

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  function setFaqHeight(item){
    const answer = item.querySelector('.faq-answer');
    answer.style.maxHeight = item.classList.contains('open') ? answer.scrollHeight + 'px' : '0px';
  }
  faqItems.forEach(item => {
    setFaqHeight(item);
    item.querySelector('.faq-question').addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      faqItems.forEach(i => { i.classList.remove('open'); setFaqHeight(i); });
      if(!wasOpen){
        item.classList.add('open');
        setFaqHeight(item);
      }
    });
  });
  window.addEventListener('resize', () => {
    faqItems.forEach(item => setFaqHeight(item));
  });

  // Blog category tabs
  const blogTabs = document.querySelectorAll('.blog-tabs button');
  const blogArticles = document.querySelectorAll('.post-card[data-category]');
  const featuredArticle = document.querySelector('.featured-article[data-category]');
  blogTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      blogTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const showAll = filter === 'all';
      blogArticles.forEach(article => {
        const isVisible = showAll || article.dataset.category === filter;
        article.hidden = !isVisible;
        article.classList.toggle('category-hidden', !isVisible);
      });

      if (featuredArticle) {
        const isVisible = showAll || featuredArticle.dataset.category === filter;
        featuredArticle.hidden = !isVisible;
        featuredArticle.classList.toggle('category-hidden', !isVisible);
      }
    });
  });

  // Sidebar filter list
  const filterBtns = document.querySelectorAll('.filter-list button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const showAll = filter === 'all';
      blogArticles.forEach(article => {
        const isVisible = showAll || article.dataset.sidebarCategory === filter;
        article.hidden = !isVisible;
        article.classList.toggle('category-hidden', !isVisible);
      });
      if (featuredArticle) {
        const isVisible = showAll || featuredArticle.dataset.category === filter;
        featuredArticle.hidden = !isVisible;
        featuredArticle.classList.toggle('category-hidden', !isVisible);
      }
    });
  });

  // Single-choice button groups in the hiring form
  const pillGroups = document.querySelectorAll('.pill-group');
  pillGroups.forEach(group => {
    const options = group.querySelectorAll('.pill-option');
    options.forEach(option => {
      option.setAttribute('aria-pressed', option.classList.contains('active') ? 'true' : 'false');
      option.addEventListener('click', () => {
        options.forEach(item => {
          item.classList.remove('active');
          item.setAttribute('aria-pressed', 'false');
        });
        option.classList.add('active');
        option.setAttribute('aria-pressed', 'true');
      });
    });
  });

  // Auto-tag headings & eyebrows for a subtle fade/rise entrance (skips ones already inside a .reveal block)
  const textTargets = document.querySelectorAll('main h1, main h2, main h3, .eyebrow, .fa-content h2, .cta-banner h2');
  textTargets.forEach(el => {
    if (!el.classList.contains('reveal') && !el.closest('.reveal')){
      el.classList.add('reveal-text');
    }
  });

  const effectTargets = document.querySelectorAll('main h1, main h2, main h3, main .eyebrow, main .quote, main .quote-text, main .cta-banner p');
  let headingIndex = 0;
  let subheadingIndex = 0;
  effectTargets.forEach(el => {
    let effect = 'fade';
    if (el.matches('h1')) effect = 'zoom';
    else if (el.matches('h2')) effect = ['slide-left', 'gradient', 'slide-right'][headingIndex++ % 3];
    else if (el.matches('h3')) effect = ['word', 'letter', 'slide-up'][subheadingIndex++ % 3];
    else if (el.classList.contains('eyebrow')) effect = 'typewriter';
    else effect = ['glow', 'blur', 'float'][subheadingIndex++ % 3];

    el.classList.add('text-effect', 'text-effect-' + effect);

    if ((effect === 'letter' || effect === 'word') && !el.children.length && !el.querySelector('br')) {
      const text = el.textContent.trim();
      el.textContent = '';
      el.setAttribute('aria-label', text);
      const parts = effect === 'letter' ? Array.from(text) : text.split(/(\s+)/);
      parts.forEach(part => {
        if (/^\s+$/.test(part)) el.appendChild(document.createTextNode(part));
        else {
          const span = document.createElement('span');
          span.textContent = part;
          span.setAttribute('aria-hidden', 'true');
          el.appendChild(span);
        }
      });
    }
  });

  const heroSections = document.querySelectorAll('main > section.hero, main > section.about-hero, main > section.contact-hero, main > section.pricing-hero');
  heroSections.forEach(hero => {
    const content = hero.querySelector('.hero-grid > div:first-child, .ah-inner, .ch-inner, .pricing-hero .wrap');
    const heading = content?.querySelector('h1');
    const highlight = content?.querySelector('.eyebrow, .badge-pill');
    const description = content?.querySelector('h1 ~ p');
    const actions = content?.querySelector('.hero-ctas, .ah-cta, .billing-toggle');
    if (!content || !heading) return;

    const effectClasses = ['text-effect', 'text-effect-fade', 'text-effect-slide-left', 'text-effect-slide-right', 'text-effect-slide-up', 'text-effect-zoom', 'text-effect-blur', 'text-effect-typewriter', 'text-effect-gradient', 'text-effect-glow', 'text-effect-float', 'text-effect-letter', 'text-effect-word', 'reveal-text'];
    [heading, highlight, description, actions].forEach(target => {
      if (target) target.classList.remove(...effectClasses);
    });

    heading.classList.add('hero-sequence-heading');
    if (highlight) {
      highlight.classList.add('hero-sequence-highlight');
      if (!highlight.children.length) {
        const text = highlight.textContent.trim();
        highlight.textContent = '';
        const parts = text.split(/(\s+)/);
        parts.forEach(part => {
          if (/^\s+$/.test(part)) highlight.appendChild(document.createTextNode(part));
          else {
            const span = document.createElement('span');
            span.textContent = part;
            span.setAttribute('aria-hidden', 'true');
            highlight.appendChild(span);
          }
        });
        highlight.setAttribute('aria-label', text);
      }
    }
    if (description) description.classList.add('hero-sequence-description');
    if (actions) actions.classList.add('hero-sequence-actions');
  });

  // Reveal on scroll (fade/slide-up for sections, text, and staggered card groups)
  const revealEls = document.querySelectorAll('.reveal, .reveal-text, .reveal-stagger, .text-effect, .hero-sequence-heading, .hero-sequence-highlight, .hero-sequence-description, .hero-sequence-actions');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  // Highlight the current page in the nav bar
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu > a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkPath = (link.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (linkPath === currentPath || (linkPath === '' && currentPath === 'index.html')){
      link.classList.add('active');
    }
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // What we do — accordion tabs
  const tabCols = document.querySelectorAll('.tab-col');
  function activateTab(target){
    tabCols.forEach(col => {
      const isTarget = col === target;
      col.classList.toggle('active', isTarget);
      col.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });
  }
  tabCols.forEach(col => {
    col.addEventListener('click', () => activateTab(col));
    col.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        activateTab(col);
      }
    });
  });

  // Reusable carousel (used by testimonials + hiring steps)
  function initCarousel(opts){
    const track = document.querySelector(opts.track);
    const cards = track ? Array.from(track.children) : [];
    const prevBtn = document.querySelector(opts.prev);
    const nextBtn = document.querySelector(opts.next);
    const dotsWrap = document.querySelector(opts.dots);
    if (!track || !cards.length || !prevBtn || !nextBtn || !dotsWrap) return;

    let index = 0;

    function visibleCount(){
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 900) return 2;
      return opts.maxVisible || 3;
    }

    function maxIndex(){
      return Math.max(0, cards.length - visibleCount());
    }

    function buildDots(){
      dotsWrap.innerHTML = '';
      const dotCount = maxIndex() + 1;
      for (let i = 0; i < dotCount; i += 1){
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.addEventListener('click', () => { index = i; update(); });
        dotsWrap.appendChild(b);
      }
    }

    function update(){
      const mIndex = maxIndex();
      if (index > mIndex) index = mIndex;
      if (index < 0) index = 0;

      const card = cards[0];
      const gap = 24;
      const step = card.getBoundingClientRect().width + gap;
      track.style.transform = `translateX(-${index * step}px)`;

      const dots = dotsWrap.querySelectorAll('button');
      dots.forEach((d, i) => d.classList.toggle('active', i === index));

      prevBtn.disabled = index === 0;
      nextBtn.disabled = index >= mIndex;
    }

    prevBtn.addEventListener('click', () => { index -= 1; update(); });
    nextBtn.addEventListener('click', () => { index += 1; update(); });
    let lastDotCount = maxIndex() + 1;
    window.addEventListener('resize', () => {
      const dotCount = maxIndex() + 1;
      if (dotCount !== lastDotCount){
        lastDotCount = dotCount;
        buildDots();
      }
      update();
    });

    buildDots();
    update();
  }

  initCarousel({
    track: '.test-track',
    prev: '.test-arrow.prev',
    next: '.test-arrow.next',
    dots: '.test-dots',
    maxVisible: 3
  });

  initCarousel({
    track: '.hs-track',
    prev: '.hs-prev',
    next: '.hs-next',
    dots: '.hs-dots',
    maxVisible: 3
  });

  // Newsletter subscription form handler
  const newsletterForm = document.querySelector('.nb-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const error = newsletterForm.querySelector('.nb-error');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
      error.textContent = '';
      emailInput.classList.remove('has-error');

      if (!emailInput.value.trim()) {
        error.textContent = 'Email is required.';
        emailInput.classList.add('has-error');
        return;
      }
      if (!emailRegex.test(emailInput.value.trim())) {
        error.textContent = 'Enter a valid email address.';
        emailInput.classList.add('has-error');
        return;
      }

      newsletterForm.reset();
      window.location.href = '404.html';
    });
  }

  // Sidebar subscribe button handler
  const sidebarSubscribeBtn = document.querySelector('.sidebar-subscribe button');
  if (sidebarSubscribeBtn) {
    sidebarSubscribeBtn.addEventListener('click', () => {
      window.location.href = '404.html';
    });
  }

  // Mobile navigation menu
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');

  if (navToggle && mobileMenu) {
    const closeMobileMenu = () => {
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('mobile-menu-open');
      document.body.classList.remove('mobile-menu-open');
    };

    navToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = navToggle.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      mobileMenu.classList.toggle('is-open', isOpen);
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.documentElement.classList.toggle('mobile-menu-open', isOpen);
      document.body.classList.toggle('mobile-menu-open', isOpen);
    });

    mobileMenu.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMobileMenu();
    });

    document.addEventListener('click', (event) => {
      if (!mobileMenu.contains(event.target) && !navToggle.contains(event.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMobileMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMobileMenu();
    });
  }

  function clearFormErrors(form){
    form.querySelectorAll('.field-error, .form-success').forEach(message => message.remove());
    form.querySelectorAll('.has-error').forEach(field => field.classList.remove('has-error'));
  }

  function showFieldError(target, message){
    const field = target.closest('.field') || target.closest('.pill-field') || target.parentElement;
    if (!field) return;
    field.classList.add('has-error');
    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    field.appendChild(error);
  }

  function showFormSuccess(form, message, duration = 0){
    const success = document.createElement('p');
    success.className = 'form-success';
    success.textContent = message;
    form.appendChild(success);
    if (duration > 0) {
      window.setTimeout(() => success.remove(), duration);
    }
  }

  function resetPillGroups(form){
    form.querySelectorAll('.pill-group').forEach(group => {
      const options = group.querySelectorAll('.pill-option');
      options.forEach((option, index) => {
        option.classList.toggle('active', index === 0);
        option.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      });
    });
  }

  // Job posting form handler (Post a Job)
  const jobPostingForm = document.querySelector('#post-a-job form');
  if (jobPostingForm) {
    jobPostingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors(jobPostingForm);
      const requiredFields = [
        ['pj-title', 'Please enter a job title.'],
        ['pj-company', 'Please enter the company name.'],
        ['pj-min', 'Please enter the minimum salary.'],
        ['pj-max', 'Please enter the maximum salary.'],
        ['pj-desc', 'Please enter a job description.'],
        ['pj-req', 'Please enter the job requirements.'],
        ['pj-benefits', 'Please enter the benefits and perks.'],
        ['pj-deadline', 'Please choose an application deadline.']
      ];
      let isValid = true;
      requiredFields.forEach(([id, message]) => {
        const input = document.getElementById(id);
        if (!input.value.trim()) {
          showFieldError(input, message);
          isValid = false;
        }
      });
      if (!isValid) return;

      jobPostingForm.reset();
      resetPillGroups(jobPostingForm);
      window.location.href = '404.html';
    });
  }

  document.querySelectorAll('.upload-zone .btn').forEach(button => {
    button.addEventListener('click', () => { window.location.href = '404.html'; });
  });

  // Candidate application form handler
  const jobApplicationForm = document.querySelector('#apply-for-a-job form');
  if (jobApplicationForm) {
    jobApplicationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors(jobApplicationForm);

      const fields = {
        name: document.getElementById('af-name'),
        email: document.getElementById('af-email'),
        phone: document.getElementById('af-phone'),
        linkedin: document.getElementById('af-linkedin'),
        cover: document.getElementById('af-cover'),
        salary: document.getElementById('af-salary'),
        start: document.getElementById('af-start')
      };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
      const nameRegex = /^[A-Za-z][A-Za-z' -]*$/;
      let isValid = true;
      const validate = (input, condition, message) => {
        if (!condition) {
          showFieldError(input, message);
          isValid = false;
        }
      };

      validate(fields.name, nameRegex.test(fields.name.value.trim()), 'Enter a name using letters only.');
      validate(fields.email, emailRegex.test(fields.email.value.trim()), 'Enter a valid email address.');
      validate(fields.phone, fields.phone.value.trim(), 'Please enter your phone number.');
      validate(fields.linkedin, fields.linkedin.value.trim(), 'Please enter your LinkedIn profile URL.');
      validate(fields.cover, fields.cover.value.trim(), 'Please enter a cover letter.');
      validate(fields.salary, fields.salary.value.trim(), 'Please enter your desired salary.');
      validate(fields.start, fields.start.value.trim(), 'Please choose your availability date.');

      if (!isValid) return;

      jobApplicationForm.reset();
      resetPillGroups(jobApplicationForm);
      window.location.href = '404.html';
    });
  }

  // Contact inquiry form handler
  const inquiryForm = document.querySelector('.sc-form form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors(inquiryForm);

      const nameInput = inquiryForm.querySelector('input[type="text"]');
      const emailInput = inquiryForm.querySelector('input[type="email"]');
      const messageInput = inquiryForm.querySelector('textarea');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
      const nameRegex = /^[A-Za-z][A-Za-z' -]*$/;
      let isValid = true;

      if (!nameRegex.test(nameInput.value.trim())) {
        showFieldError(nameInput, 'Enter a name using letters only.');
        isValid = false;
      }
      if (!emailRegex.test(emailInput.value.trim())) {
        showFieldError(emailInput, 'Enter a valid email address.');
        isValid = false;
      }
      if (!messageInput.value.trim()) {
        showFieldError(messageInput, 'Please describe how we can help.');
        isValid = false;
      }
      if (!isValid) return;

      inquiryForm.reset();
      window.location.href = '404.html';
    });
  }
