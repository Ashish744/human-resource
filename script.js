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
  blogTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      blogTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Sidebar filter list
  const filterBtns = document.querySelectorAll('.filter-list button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
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
  const navLinks = document.querySelectorAll('.nav-links a');
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
      cards.forEach((_, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.addEventListener('click', () => { index = i; update(); });
        dotsWrap.appendChild(b);
      });
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
    window.addEventListener('resize', update);

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
      const email = emailInput.value.trim();
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (email && emailRegex.test(email)) {
        // Valid email - redirect to 404 page
        window.location.href = '404.html';
      } else {
        // Invalid email - show error
        alert('Please enter a valid email address');
      }
    });
  }

  // Sidebar subscribe button handler
  const sidebarSubscribeBtn = document.querySelector('.sidebar-subscribe button');
  if (sidebarSubscribeBtn) {
    sidebarSubscribeBtn.addEventListener('click', () => {
      // Show a simple prompt for email
      const email = prompt('Enter your work email:');
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (email && emailRegex.test(email)) {
        // Valid email - redirect to 404 page
        window.location.href = '404.html';
      } else if (email) {
        // Invalid email - show error
        alert('Please enter a valid email address');
      }
      // If user cancels (email is null), do nothing
    });
  }

  // Job application form handler (Apply for a Position)
  const jobApplicationForm = document.querySelector('#apply-for-a-job form');
  if (jobApplicationForm) {
    jobApplicationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('af-name');
      const emailInput = document.getElementById('af-email');
      const phoneInput = document.getElementById('af-phone');
      const coverLetterInput = document.getElementById('af-cover');
      
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();
      const coverLetter = coverLetterInput.value.trim();
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      // Check required fields
      if (!name) {
        alert('Please enter your full name');
        return;
      }
      
      if (!email || !emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
      }
      
      if (!phone) {
        alert('Please enter your phone number');
        return;
      }
      
      if (!coverLetter) {
        alert('Please write a cover letter');
        return;
      }
      
      // All validations passed - redirect to 404 page
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

  // Job posting form handler (Post a Job)
  const jobPostingForm = document.querySelector('#post-a-job form');
  if (jobPostingForm) {
    jobPostingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const titleInput = document.getElementById('pj-title');
      const companyInput = document.getElementById('pj-company');
      const descriptionInput = document.getElementById('pj-desc');
      const requirementsInput = document.getElementById('pj-req');
      
      const title = titleInput.value.trim();
      const company = companyInput.value.trim();
      const description = descriptionInput.value.trim();
      const requirements = requirementsInput.value.trim();
      
      // Check required fields
      if (!title) {
        alert('Please enter a job title');
        return;
      }
      
      if (!company) {
        alert('Please enter the company name');
        return;
      }
      
      if (!description) {
        alert('Please enter a job description');
        return;
      }
      
      if (!requirements) {
        alert('Please enter job requirements');
        return;
      }
      
      // All validations passed - redirect to 404 page
      window.location.href = '404.html';
    });
  }

  // Contact inquiry form handler
  const inquiryForm = document.querySelector('.sc-form form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = inquiryForm.querySelector('input[type="text"]');
      const emailInput = inquiryForm.querySelector('input[type="email"]');
      const messageInput = inquiryForm.querySelector('textarea');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nameInput.value.trim()) {
        alert('Please enter your full name');
        return;
      }

      if (!emailRegex.test(emailInput.value.trim())) {
        alert('Please enter a valid email address');
        return;
      }

      if (!messageInput.value.trim()) {
        alert('Please describe how we can help');
        return;
      }

      window.location.href = '404.html';
    });
  }
