const header = document.querySelector('.site-header');
const glow = document.querySelector('.cursor-glow');
const links = [...document.querySelectorAll('.nav-link')];

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 25);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.reading-progress span').style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
}, { passive: true });

window.addEventListener('pointermove', (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const slides = [...document.querySelectorAll('.cyber-slide')];
const slideTitles = ['Analyse des flux', 'Infrastructure connectée', 'Veille & innovation'];
let activeSlide = 0;
if (slides.length) {
  window.setInterval(() => {
    slides[activeSlide].classList.remove('active');
    activeSlide = (activeSlide + 1) % slides.length;
    slides[activeSlide].classList.add('active');
    document.getElementById('slide-number').textContent = String(activeSlide + 1).padStart(2, '0');
    document.getElementById('slide-title').textContent = slideTitles[activeSlide];
  }, 2500);
}

const sections = [...document.querySelectorAll('main section[id]')];
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach((section) => navObserver.observe(section));

document.getElementById('year').textContent = new Date().getFullYear();

const projects = {
  network: {
    category: 'RÉSEAU · WIRESHARK',
    title: 'Analyse de trafic réseau',
    intro: 'Étude du trafic réseau afin de comprendre les échanges entre machines et de repérer des communications à surveiller.',
    tasks: ['Capture de paquets sur un environnement de test.', 'Lecture des échanges TCP/IP et identification des adresses, ports et protocoles.', 'Analyse de requêtes DNS et de flux HTTP.', 'Repérage d’anomalies de communication et interprétation des résultats.'],
    tags: ['Wireshark', 'TCP/IP', 'DNS', 'HTTP', 'Analyse réseau'],
    learning: 'Ce projet a renforcé ma capacité à lire un trafic réseau et à raisonner à partir d’éléments concrets : protocoles, requêtes, connexions et comportements inhabituels.'
  },
  windows: {
    category: 'SYSTÈMES · WINDOWS',
    title: 'Sécurisation d’un système Windows',
    intro: 'Mise en place de mesures de protection essentielles pour renforcer la sécurité d’un poste de travail Windows.',
    tasks: ['Création et gestion de comptes utilisateurs avec des droits adaptés.', 'Configuration du pare-feu Windows pour limiter les communications non nécessaires.', 'Application des mises à jour système et vérification de leur rôle dans la sécurité.', 'Mise en œuvre de bonnes pratiques et de politiques de sécurité de base.'],
    tags: ['Windows', 'Pare-feu', 'Comptes utilisateurs', 'Mises à jour', 'Politiques de sécurité'],
    learning: 'J’ai appris à associer l’administration quotidienne d’un poste à une logique de sécurité : moins de privilèges, davantage de contrôle et des protections maintenues à jour.'
  },
  linux: {
    category: 'SYSTÈMES · LINUX',
    title: 'Administration Linux',
    intro: 'Prise en main des fonctions essentielles d’administration d’un système Linux dans un environnement d’apprentissage.',
    tasks: ['Gestion des utilisateurs, groupes et droits d’accès.', 'Configuration des permissions sur les fichiers et répertoires.', 'Vérification des accès afin de limiter les actions non autorisées.', 'Consultation des journaux système pour suivre l’activité et identifier des événements utiles.'],
    tags: ['Linux', 'Utilisateurs', 'Permissions', 'Droits d’accès', 'Journaux système'],
    learning: 'Ce projet m’a permis de comprendre l’importance des permissions et de la traçabilité dans un système Linux, deux bases indispensables pour l’administration et la sécurité.'
  }
};

const dialog = document.getElementById('project-dialog');
const closeDialog = () => dialog.close();
document.querySelectorAll('[data-project]').forEach((button) => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  document.getElementById('dialog-category').textContent = project.category;
  document.getElementById('dialog-title').textContent = project.title;
  document.getElementById('dialog-intro').textContent = project.intro;
  document.getElementById('dialog-tasks').replaceChildren(...project.tasks.map((task) => { const item = document.createElement('li'); item.textContent = task; return item; }));
  document.getElementById('dialog-tags').replaceChildren(...project.tags.map((tag) => { const item = document.createElement('span'); item.textContent = tag; return item; }));
  document.getElementById('dialog-learning').textContent = project.learning;
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('motion-ready');

// Give repeated elements a subtle cascade as they enter the viewport.
document.querySelectorAll('.skills-list, .projects-grid, .method-grid, .timeline').forEach((group) => {
  [...group.children].forEach((item, index) => item.style.setProperty('--reveal-delay', `${Math.min(index * 90, 360)}ms`));
});

if (!reducedMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  const cursor = document.querySelector('.motion-cursor');
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let cursorX = pointerX;
  let cursorY = pointerY;

  const animateCursor = () => {
    cursorX += (pointerX - cursorX) * .18;
    cursorY += (pointerY - cursorY) * .18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    window.requestAnimationFrame(animateCursor);
  };
  animateCursor();

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursor.classList.add('is-visible');
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));

  document.querySelectorAll('a, button, .project-card, .method-card').forEach((target) => {
    target.addEventListener('pointerenter', () => cursor.classList.add('is-active'));
    target.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
  });

  // Magnetic calls-to-action remain restrained so labels stay easy to click.
  document.querySelectorAll('.button').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const box = button.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      button.style.transform = `translate3d(${x * .1}px,${y * .16 - 3}px,0)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });

  // Interactive light follows the pointer across cards.
  document.querySelectorAll('.project-card, .method-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect();
      const percentX = ((event.clientX - box.left) / box.width) * 100;
      const percentY = ((event.clientY - box.top) / box.height) * 100;
      card.style.setProperty('--pointer-x', `${percentX}%`);
      card.style.setProperty('--pointer-y', `${percentY}%`);

      if (card.classList.contains('project-interactive')) {
        const x = percentX / 100 - .5;
        const y = percentY / 100 - .5;
        card.style.transform = `perspective(1000px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-7px)`;
      }
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--pointer-x');
      card.style.removeProperty('--pointer-y');
      if (card.classList.contains('project-interactive')) card.style.transform = '';
    });
  });

  // Layered parallax in the hero gives the composition real depth.
  const heroArt = document.querySelector('.hero-art');
  if (heroArt) {
    heroArt.classList.add('motion-depth');
    heroArt.addEventListener('pointermove', (event) => {
      const box = heroArt.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      heroArt.style.setProperty('--art-x-sm', `${x * 5}px`);
      heroArt.style.setProperty('--art-y-sm', `${y * 5}px`);
      heroArt.style.setProperty('--art-x', `${x * 13}px`);
      heroArt.style.setProperty('--art-y', `${y * 13}px`);
      heroArt.style.setProperty('--art-x-lg', `${x * 22}px`);
      heroArt.style.setProperty('--art-y-lg', `${y * 22}px`);
      heroArt.style.setProperty('--art-x-neg', `${x * -11}px`);
      heroArt.style.setProperty('--art-y-neg', `${y * -11}px`);
    });
    heroArt.addEventListener('pointerleave', () => {
      ['--art-x-sm','--art-y-sm','--art-x','--art-y','--art-x-lg','--art-y-lg','--art-x-neg','--art-y-neg'].forEach((property) => heroArt.style.removeProperty(property));
    });
  }
}
