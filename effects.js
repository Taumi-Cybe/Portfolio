(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const roleWord = document.getElementById('role-word');

  if (roleWord && !reduceMotion) {
    const roles = ['RÉSEAUX', 'LINUX', 'ACTIVE DIRECTORY', 'DÉFENSE', 'SCRIPTING'];
    let roleIndex = 0;
    window.setInterval(() => {
      roleWord.classList.remove('swap');
      void roleWord.offsetWidth;
      roleWord.classList.add('swap');
      window.setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleWord.textContent = roles[roleIndex];
      }, 220);
    }, 2600);
  }

  if ('IntersectionObserver' in window) {
    const focusObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('mobile-focus', entry.isIntersecting));
    }, { rootMargin: '-27% 0px -27% 0px', threshold: .18 });
    document.querySelectorAll('.project-card, .method-card, .skill-row').forEach((item) => focusObserver.observe(item));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('section-in-view', entry.isIntersecting));
    }, { rootMargin: '-12% 0px -12% 0px', threshold: .08 });
    document.querySelectorAll('main .section').forEach((section) => sectionObserver.observe(section));
  }

  const boot = document.querySelector('.boot-sequence');
  if (boot) window.setTimeout(() => boot.remove(), reduceMotion ? 0 : 2200);
})();
