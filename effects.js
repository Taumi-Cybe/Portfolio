(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('liquid-canvas');
  const lens = document.querySelector('.liquid-lens');
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
    }, 2200);
  }

  if ('IntersectionObserver' in window) {
    const focusObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('mobile-focus', entry.isIntersecting));
    }, { rootMargin: '-27% 0px -27% 0px', threshold: .18 });
    document.querySelectorAll('.project-card, .method-card, .skill-row').forEach((item) => focusObserver.observe(item));
  }

  const boot = document.querySelector('.boot-sequence');
  if (boot) window.setTimeout(() => boot.remove(), reduceMotion ? 0 : 3100);
  if (reduceMotion || !canvas) return;

  const context = canvas.getContext('2d', { alpha: true });
  const root = document.documentElement;
  let width = 0;
  let height = 0;
  let ratio = 1;
  let lastFrame = performance.now();
  let pointerX = window.innerWidth * .62;
  let pointerY = window.innerHeight * .42;
  let lastPointerTime = -10000;
  let active = true;
  let scrollY = window.scrollY;
  let lensX = pointerX;
  let lensY = pointerY;
  const ripples = [];
  const sparks = [];
  const segments = [];
  let head = { x: pointerX, y: pointerY, vx: 0, vy: 0 };

  const segmentCount = () => width < 700 ? 34 : 54;
  const segmentGap = () => width < 700 ? 7 : 9;

  const resetSnake = () => {
    head = { x: width * .62, y: height * .42, vx: 0, vy: 0 };
    segments.length = 0;
    for (let index = 0; index < segmentCount(); index += 1) segments.push({ x: head.x - index * segmentGap(), y: head.y });
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = Math.min(window.devicePixelRatio || 1, 1.65);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    resetSnake();
  };

  const smoothPath = (points) => {
    if (points.length < 2) return;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length - 1; index += 1) {
      context.quadraticCurveTo(points[index].x, points[index].y, (points[index].x + points[index + 1].x) * .5, (points[index].y + points[index + 1].y) * .5);
    }
    const last = points[points.length - 1];
    context.lineTo(last.x, last.y);
  };

  const updateSnake = (delta, time) => {
    const autoX = width * (.5 + Math.sin(time * .00031) * .32 + Math.sin(time * .00083) * .1);
    const autoY = height * (.47 + Math.cos(time * .00039) * .28 + Math.sin(time * .00067) * .09);
    const pointerRecent = time - lastPointerTime < 1800;
    const targetX = pointerRecent ? pointerX * .72 + autoX * .28 : autoX;
    const targetY = pointerRecent ? pointerY * .72 + autoY * .28 : autoY;
    const spring = pointerRecent ? 6.8 : 3.5;
    head.vx += (targetX - head.x) * spring * delta;
    head.vy += (targetY - head.y) * spring * delta;
    const damping = Math.pow(.075, delta);
    head.vx *= damping;
    head.vy *= damping;
    head.x += head.vx * delta;
    head.y += head.vy * delta;
    segments[0].x += (head.x - segments[0].x) * Math.min(1, delta * 18);
    segments[0].y += (head.y - segments[0].y) * Math.min(1, delta * 18);
    const gap = segmentGap();
    for (let index = 1; index < segments.length; index += 1) {
      const previous = segments[index - 1];
      const current = segments[index];
      const dx = previous.x - current.x;
      const dy = previous.y - current.y;
      const distance = Math.hypot(dx, dy) || 1;
      const correction = (distance - gap) / distance;
      current.x += dx * correction * .88;
      current.y += dy * correction * .88;
    }
  };

  const drawSnake = (time) => {
    const hue = (time * .028 + scrollY * .055) % 360;
    root.style.setProperty('--snake-hue', hue.toFixed(1));
    const tail = segments[segments.length - 1];
    const gradient = context.createLinearGradient(tail.x, tail.y, segments[0].x, segments[0].y);
    gradient.addColorStop(0, `hsla(${(hue + 105) % 360},90%,60%,0)`);
    gradient.addColorStop(.34, `hsla(${(hue + 65) % 360},94%,61%,.5)`);
    gradient.addColorStop(.72, `hsla(${hue},100%,62%,.92)`);
    gradient.addColorStop(1, `hsla(${(hue + 315) % 360},100%,72%,1)`);

    context.save();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    smoothPath(segments);
    context.strokeStyle = gradient;
    context.lineWidth = width < 700 ? 11 : 15;
    context.globalAlpha = .16;
    context.shadowColor = `hsl(${hue},100%,62%)`;
    context.shadowBlur = 34;
    context.stroke();
    smoothPath(segments);
    context.globalAlpha = .72;
    context.lineWidth = width < 700 ? 3.2 : 4.2;
    context.shadowBlur = 17;
    context.stroke();
    smoothPath(segments.slice(0, Math.max(8, Math.floor(segments.length * .58))));
    context.strokeStyle = `hsla(${(hue + 25) % 360},100%,88%,.72)`;
    context.globalAlpha = .62;
    context.lineWidth = 1.15;
    context.shadowBlur = 9;
    context.stroke();

    const pulse = 8 + Math.sin(time * .006) * 2;
    const headGradient = context.createRadialGradient(head.x - 3, head.y - 3, 1, head.x, head.y, pulse * 1.8);
    headGradient.addColorStop(0, 'rgba(255,255,255,.95)');
    headGradient.addColorStop(.18, `hsla(${hue},100%,72%,.94)`);
    headGradient.addColorStop(1, `hsla(${hue},100%,55%,0)`);
    context.beginPath();
    context.arc(head.x, head.y, pulse * 1.8, 0, Math.PI * 2);
    context.fillStyle = headGradient;
    context.globalAlpha = 1;
    context.fill();
    for (let index = 0; index < 3; index += 1) {
      const angle = time * .0022 * (index % 2 ? -1 : 1) + index * 2.1;
      const orbit = 17 + index * 6;
      context.beginPath();
      context.arc(head.x + Math.cos(angle) * orbit, head.y + Math.sin(angle) * orbit, 1.8 + index * .35, 0, Math.PI * 2);
      context.fillStyle = `hsla(${(hue + index * 48) % 360},100%,72%,.88)`;
      context.shadowBlur = 12;
      context.fill();
    }
    context.restore();
  };

  const updateEffects = (delta, time) => {
    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      const ripple = ripples[index];
      ripple.radius += 150 * delta;
      ripple.life -= .82 * delta;
      context.beginPath();
      context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      context.strokeStyle = `hsla(${(time * .04 + index * 70) % 360},100%,68%,${Math.max(0,ripple.life) * .55})`;
      context.lineWidth = Math.max(.6, ripple.life * 2.2);
      context.stroke();
      if (ripple.life <= 0) ripples.splice(index, 1);
    }
    for (let index = sparks.length - 1; index >= 0; index -= 1) {
      const spark = sparks[index];
      spark.x += spark.vx * delta;
      spark.y += spark.vy * delta;
      spark.vy += 20 * delta;
      spark.life -= delta * 1.25;
      context.beginPath();
      context.arc(spark.x, spark.y, 1.8 * Math.max(.2, spark.life), 0, Math.PI * 2);
      context.fillStyle = `hsla(${(time * .05 + spark.hue) % 360},100%,70%,${Math.max(0,spark.life)})`;
      context.fill();
      if (spark.life <= 0) sparks.splice(index, 1);
    }
  };

  const frame = (time) => {
    const delta = Math.min((time - lastFrame) / 1000, .034);
    lastFrame = time;
    if (active) {
      context.clearRect(0, 0, width, height);
      updateSnake(delta, time);
      drawSnake(time);
      updateEffects(delta, time);
      if (lens && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
        lensX += (head.x - lensX) * .075;
        lensY += (head.y - lensY) * .075;
        lens.style.left = `${lensX}px`;
        lens.style.top = `${lensY}px`;
      }
    }
    window.requestAnimationFrame(frame);
  };

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    lastPointerTime = performance.now();
    if (lens) lens.classList.add('visible');
  }, { passive: true });
  window.addEventListener('pointerdown', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    lastPointerTime = performance.now();
    ripples.push({ x: event.clientX, y: event.clientY, radius: 5, life: 1 });
    for (let index = 0; index < 12; index += 1) {
      const angle = Math.PI * 2 * index / 12;
      const speed = 22 + Math.random() * 34;
      sparks.push({ x:event.clientX, y:event.clientY, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed, life:1, hue:index*23 });
    }
  }, { passive: true });
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => lens && lens.classList.remove('visible'));
  document.addEventListener('visibilitychange', () => { active = !document.hidden; lastFrame = performance.now(); });
  resize();
  window.requestAnimationFrame(frame);
})();
