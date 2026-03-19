/* ============================================================
   Sisaviya.in — Premium Patient Growth System
   script.js
   ============================================================ */

'use strict';

/* ── NAVBAR ─────────────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('active');
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ── SMOOTH SCROLL ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── COUNT-UP ANIMATION ─────────────────────────────────────── */
function animateCount(el) {
  const target  = parseInt(el.dataset.target, 10);
  const prefix  = el.dataset.prefix  || '';
  const suffix  = el.dataset.suffix  || '';
  const duration = 1800;
  const step    = 16;
  const steps   = Math.ceil(duration / step);
  let current   = 0;

  const tick = () => {
    current++;
    const value = Math.round(easeOut(current / steps) * target);
    el.textContent = prefix + formatNum(value) + suffix;
    if (current < steps) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function formatNum(n) {
  if (n >= 100000) return (n / 100000).toFixed(1).replace(/\.0$/, '') + ' L';
  return n.toLocaleString('en-IN');
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

/* ── PARTICLE CANVAS ────────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = 80;
  const particles = Array.from({ length: COUNT }, () => createParticle(canvas));

  function createParticle(c) {
    return {
      x:       Math.random() * c.width,
      y:       Math.random() * c.height,
      r:       Math.random() * 1.8 + 0.4,
      dx:      (Math.random() - 0.5) * 0.4,
      dy:      (Math.random() - 0.5) * 0.4,
      alpha:   Math.random() * 0.5 + 0.1,
      color:   Math.random() > 0.5 ? '11,95,255' : '0,201,167',
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Move
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.12;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(11,95,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  // Respect reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw();
  }
})();

/* ── FAQ ACCORDION ──────────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item.active').forEach(other => {
      if (other !== item) {
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = '0';
        other.querySelector('.faq-question').setAttribute('aria-expanded', false);
      }
    });

    // Toggle current
    item.classList.toggle('active', !isOpen);
    answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', !isOpen);
  });
});

/* ── CHECKBOX LABELS (SERVICE CHECKBOXES) ───────────────────── */
document.querySelectorAll('.checkbox-label').forEach(label => {
  const input = label.querySelector('input[type="checkbox"]');
  input.addEventListener('change', () => {
    label.classList.toggle('selected', input.checked);
  });
});

/* ── OFFER TIMER (Super Plan) ───────────────────────────────── */
(function checkOffer() {
  const now = new Date();
  const isMarch2025 = now.getMonth() === 2 && now.getFullYear() === 2025;
  if (isMarch2025) {
    const offerEl = document.getElementById('superPlanOffer');
    const priceEl = document.getElementById('superPlanPrice');
    if (offerEl) offerEl.style.display = 'block';
    if (priceEl) priceEl.textContent = '₹45,000';
  }
})();

/* ── DEMO FORM ──────────────────────────────────────────────── */
const demoForm    = document.getElementById('demoForm');
const formSuccess = document.getElementById('formSuccess');

function showError(inputId, errorId) {
  document.getElementById(inputId).classList.add('error');
  document.getElementById(errorId).classList.add('show');
}
function clearError(inputId, errorId) {
  document.getElementById(inputId).classList.remove('error');
  document.getElementById(errorId).classList.remove('show');
}

['formName', 'formClinic', 'formCity', 'formPhone'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    const errorMap = { formName: 'nameError', formClinic: 'clinicError', formCity: 'cityError', formPhone: 'phoneError' };
    clearError(id, errorMap[id]);
  });
});

// Phone — digits only
document.getElementById('formPhone')?.addEventListener('input', e => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
});

if (demoForm) {
  demoForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name   = document.getElementById('formName').value.trim();
    const clinic = document.getElementById('formClinic').value.trim();
    const city   = document.getElementById('formCity').value.trim();
    const phone  = document.getElementById('formPhone').value.trim();

    if (!name)   { showError('formName',   'nameError');   valid = false; }
    if (!clinic) { showError('formClinic', 'clinicError'); valid = false; }
    if (!city)   { showError('formCity',   'cityError');   valid = false; }
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) { showError('formPhone', 'phoneError'); valid = false; }

    if (!valid) return;

    const services = [...document.querySelectorAll('input[name="services"]:checked')]
      .map(cb => cb.value).join(', ') || 'Not specified';

    const waMsg = `Hi Sisaviya.in,\n\nMy details for a Free Demo:\n• Name: ${name}\n• Clinic: ${clinic}\n• City: ${city}\n• Phone: ${phone}\n• Interested In: ${services}\n\nPlease contact me to schedule a 15-min demo.`;
    const waUrl = `https://wa.me/919798729776?text=${encodeURIComponent(waMsg)}`;

    // Show Success
    demoForm.style.display = 'none';
    formSuccess.classList.add('show');
    document.getElementById('waRedirectBtn').href = waUrl;

    // Auto-open WA after 1.5s
    setTimeout(() => { window.open(waUrl, '_blank', 'noopener'); }, 1500);
  });
}

/* ── MODAL — CASE STUDIES ───────────────────────────────────── */
const caseModal   = document.getElementById('caseModal');
const viewMoreBtn = document.getElementById('viewMoreCases');
const modalClose  = document.getElementById('modalClose');

viewMoreBtn?.addEventListener('click', () => {
  caseModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

function closeModal() {
  caseModal.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
caseModal?.addEventListener('click', e => { if (e.target === caseModal) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && caseModal?.classList.contains('active')) closeModal();
});

/* ── CHATBOT ────────────────────────────────────────────────── */
const chatbotWindow  = document.getElementById('chatbotWindow');
const chatbotToggle  = document.getElementById('chatbotToggle');
const chatbotClose   = document.getElementById('chatbotClose');
const chatbotInput   = document.getElementById('chatbotInput');
const chatbotSend    = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');

const SYSTEM_PROMPT = `You are a helpful assistant for Sisaviya.in, a digital marketing agency that helps dental clinics in India get more patients using Google Maps SEO, WhatsApp booking systems, AI chatbots, and automated reminders.

Keep answers SHORT (2-3 sentences max). Be friendly and professional. Speak naturally (mix of English is OK to match Indian style). Always end with a relevant next step.

Key facts:
- Simple Plan: ₹20,000 one-time
- Special Plan: ₹40,000 one-time  
- Super Plan: ₹60,000 one-time (includes free website)
- Results in 30-60 days
- 159+ dentists helped
- WhatsApp: +91 97987 29776
- Setup time: 7 days`;

let messages = [{ role: 'assistant', content: "Hi! I'm your AI assistant. How can I help you grow your dental clinic today?" }];
let chatOpen = false;

function toggleChat(open) {
  chatOpen = open;
  chatbotWindow.classList.toggle('open', open);
  const iconChat  = chatbotToggle.querySelector('.icon-chat');
  const iconClose = chatbotToggle.querySelector('.icon-close');
  if (iconChat)  iconChat.style.display  = open ? 'none' : '';
  if (iconClose) iconClose.style.display = open ? ''     : 'none';
}

chatbotToggle.addEventListener('click', () => toggleChat(!chatOpen));
chatbotClose.addEventListener('click',  () => toggleChat(false));

function appendMessage(role, content) {
  const div = document.createElement('div');
  div.className = `chat-message ${role}`;
  div.innerHTML = `<div class="message-content">${content}</div>`;
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return div;
}

function appendTyping() {
  const div = document.createElement('div');
  div.className = 'chat-message bot chat-typing';
  div.innerHTML = `<div class="message-content"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return div;
}

async function sendChatMessage() {
  const text = chatbotInput.value.trim();
  if (!text) return;

  chatbotInput.value  = '';
  chatbotSend.disabled = true;

  messages.push({ role: 'user', content: text });
  appendMessage('user', escapeHtml(text));

  const typing = appendTyping();

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer YOUR_OPENROUTER_KEY_HERE',
        'HTTP-Referer':  'https://sisaviya.in',
        'X-Title':       'Sisaviya.in',
      },
      body: JSON.stringify({
        model:    'openai/gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-8)],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data   = await response.json();
    const reply  = data?.choices?.[0]?.message?.content || 'Sorry, I couldn\'t get a response. Please WhatsApp us at +91 97987 29776.';
    typing.remove();
    messages.push({ role: 'assistant', content: reply });
    appendMessage('bot', escapeHtml(reply));
  } catch {
    typing.remove();
    appendMessage('bot', 'Oops! Something went wrong. Please <a href="https://wa.me/919798729776" style="color:var(--jade);">WhatsApp us directly.</a>');
  } finally {
    chatbotSend.disabled = false;
    chatbotInput.focus();
  }
}

chatbotSend.addEventListener('click', sendChatMessage);
chatbotInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(); });

function escapeHtml(str) {
  const d = document.createElement('div'); d.textContent = str; return d.innerHTML;
}

/* ── FEATURE CARD HOVER GLOW ────────────────────────────────── */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});
