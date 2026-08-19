// Shared behaviour for employer-dashboard.html and candidate-dashboard.html

document.addEventListener('DOMContentLoaded', () => {

  const storedEmail = localStorage.getItem('stacklyUserEmail');
  const profileName = document.querySelector('.dash-name');
  if (storedEmail && profileName) profileName.textContent = storedEmail;

  // Profile dropdown
  const profile = document.querySelector('.dash-profile');
  const profileBtn = document.querySelector('.dash-profile-btn');
  if (profile && profileBtn){
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profile.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!profile.contains(e.target)) profile.classList.remove('open');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') profile.classList.remove('open');
    });
  }

  // Mobile sidebar drawer
  const menuBtn = document.querySelector('.dash-menu-btn');
  const sidebar = document.querySelector('.dash-sidebar');
  const overlay = document.querySelector('.dash-overlay');

  function openSidebar(){
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar(){
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (menuBtn && sidebar && overlay){
    menuBtn.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    overlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSidebar();
    });
    // Close drawer automatically if the viewport is resized back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeSidebar();
    });
  }

  // Sidebar nav item -> swaps which .dash-view panel is shown in the main content
  const navItems = document.querySelectorAll('.dash-nav-item');
  const views = document.querySelectorAll('.dash-view');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const target = item.getAttribute('data-view');
      if (target){
        views.forEach(v => v.classList.toggle('active', v.id === 'view-' + target));
      }
      closeSidebar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Filter tabs (Job Postings / My Applications views) — filter the rows below by data-status
  const filterGroups = document.querySelectorAll('.dash-filter-tabs');
  filterGroups.forEach(group => {
    const buttons = group.querySelectorAll('button');
    const list = group.nextElementSibling ? group.nextElementSibling.querySelector('.dash-list') : null;
    if (!list) return;
    const rows = list.querySelectorAll('.dash-row');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        rows.forEach(row => {
          const show = filter === 'all' || row.getAttribute('data-status') === filter;
          row.classList.toggle('dash-row-hidden', !show);
        });
      });
    });
  });

});
