/* ============================================================
   Sisaviya.in — Patient Growth System for Dentists
   script.js — All interactive functionality
   ============================================================ */

// ── CONFIGURABLE VARIABLES ──────────────────────────────────
// Toggle this to true/false to enable/disable the March offer on Super Plan
const MARCH_OFFER = true; // {{MARCH_OFFER}} — set to false to hide the March offer

// WhatsApp number (country code, no +)
const WA_NUMBER = '919798729776'; // {{WA_NUMBER}}

// ── MARCH OFFER LOGIC ───────────────────────────────────────
(function applyMarchOffer() {
  if (!MARCH_OFFER) return;
  const offerEl = document.getElementById('superPlanOffer');
  const priceEl = document.getElementById('superPlanPrice');
  if (offerEl) offerEl.style.display = 'block';
  if (priceEl) priceEl.textContent = '₹50,000';
})();

// ── NAVBAR SCROLL EFFECT ────────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

// ── HAMBURGER MENU ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
  const isOpen = navLinks.classList.contains('active');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ── FAQ ACCORDION ───────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isActive = item.classList.contains('active');

    // Close all others
    document.querySelectorAll('.faq-item').forEach(faq => {
      faq.classList.remove('active');
      faq.querySelector('.faq-answer').style.maxHeight = null;
      faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Toggle clicked one
    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── SCROLL REVEAL ANIMATION ─────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});
revealElements.forEach(el => revealObserver.observe(el));

// ── CASE STUDY MODAL ────────────────────────────────────────
const caseModal = document.getElementById('caseModal');
const viewMoreBtn = document.getElementById('viewMoreCases');
const modalClose = document.getElementById('modalClose');

viewMoreBtn.addEventListener('click', () => {
  caseModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

modalClose.addEventListener('click', closeModal);
caseModal.addEventListener('click', (e) => {
  if (e.target === caseModal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && caseModal.classList.contains('active')) closeModal();
});

function closeModal() {
  caseModal.classList.remove('active');
  document.body.style.overflow = '';
}

// ── CHECKBOX STYLING ────────────────────────────────────────
document.querySelectorAll('.checkbox-label input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', () => {
    cb.closest('.checkbox-label').classList.toggle('selected', cb.checked);
  });
});

// ── DEMO FORM LOGIC ─────────────────────────────────────────
const demoForm = document.getElementById('demoForm');
const formSuccess = document.getElementById('formSuccess');
const waRedirectBtn = document.getElementById('waRedirectBtn');

demoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Reset errors
  document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
  document.querySelectorAll('.form-group input').forEach(el => el.classList.remove('error'));

  const name = document.getElementById('formName').value.trim();
  const clinic = document.getElementById('formClinic').value.trim();
  const city = document.getElementById('formCity').value.trim();
  const phone = document.getElementById('formPhone').value.trim();

  let valid = true;

  // Validate Name
  if (!name) {
    showError('formName', 'nameError');
    valid = false;
  }
  // Validate Clinic
  if (!clinic) {
    showError('formClinic', 'clinicError');
    valid = false;
  }
  // Validate City
  if (!city) {
    showError('formCity', 'cityError');
    valid = false;
  }
  // Validate Phone (Indian mobile: starts with 6-9, 10 digits)
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    showError('formPhone', 'phoneError');
    valid = false;
  }

  if (!valid) return;

  // Collect selected services
  const services = [];
  document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
    services.push(cb.value);
  });
  const servicesText = services.length > 0 ? services.join(', ') : 'Not specified';

  // Build WhatsApp URL with prefilled message
  const waMessage = `Hi, I want a demo for Dental Patient Growth System.
Name: ${name}
Clinic: ${clinic}
City: ${city}
Phone: ${phone}
Interested in: ${servicesText}`;

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  // Set the WhatsApp redirect button href
  waRedirectBtn.href = waUrl;

  // Show success, hide form
  demoForm.style.display = 'none';
  formSuccess.classList.add('show');

  // Smooth scroll to the success message
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function showError(inputId, errorId) {
  document.getElementById(inputId).classList.add('error');
  document.getElementById(errorId).classList.add('show');
}

// ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height + spacing
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── PHONE INPUT — NUMBERS ONLY ──────────────────────────────
const phoneInput = document.getElementById('formPhone');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  });
}

// ── CHATBOT ──────────────────────────────────────────────────
const OPENROUTER_API_KEY = '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';
const CHATBOT_MODEL = 'openai/gpt-4o-mini'; // gpt-oss-20b maps to gpt-4o-mini on OpenRouter

const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose  = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput  = document.getElementById('chatbotInput');
const chatbotSend   = document.getElementById('chatbotSend');
const iconChat      = chatbotToggle.querySelector('.icon-chat');
const iconClose     = chatbotToggle.querySelector('.icon-close');

// Conversation history for context
const chatHistory = [
  {
    role: 'system',
    content: `You are a helpful AI assistant for Sisaviya.in, a dental patient growth system. 
You help dental clinic owners understand our services: Google Maps SEO (Top 3 ranking), 
WhatsApp Booking System, 24/7 AI Website Chatbot, and Appointment Reminders + Review Requests.
Pricing: Simple Plan ₹20,000, Special Plan ₹40,000, Super Plan ₹60,000 (all one-time fees). 
You help dentists get 15-20 extra patients per month. Be friendly, concise, and helpful. 
If someone wants to book a demo, direct them to fill the form on the page or WhatsApp: +91 97987 29776.`
  }
];

function openChatbot() {
  chatbotWindow.classList.add('open');
  iconChat.style.display = 'none';
  iconClose.style.display = 'flex';
  chatbotInput.focus();
}

function closeChatbot() {
  chatbotWindow.classList.remove('open');
  iconChat.style.display = 'flex';
  iconClose.style.display = 'none';
}

chatbotToggle.addEventListener('click', () => {
  chatbotWindow.classList.contains('open') ? closeChatbot() : openChatbot();
});
chatbotClose.addEventListener('click', closeChatbot);

function appendMessage(text, role) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${role}`;
  msgDiv.innerHTML = `<div class="message-content">${text}</div>`;
  chatbotMessages.appendChild(msgDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return msgDiv;
}

function showTyping() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message bot chat-typing';
  typingDiv.id = 'chatTyping';
  typingDiv.innerHTML = `<div class="message-content"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  chatbotMessages.appendChild(typingDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('chatTyping');
  if (t) t.remove();
}

async function sendChatMessage() {
  const text = chatbotInput.value.trim();
  if (!text) return;

  chatbotInput.value = '';
  chatbotSend.disabled = true;

  appendMessage(text, 'user');
  chatHistory.push({ role: 'user', content: text });
  showTyping();

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sisaviya.in',
        'X-Title': 'Sisaviya AI Chatbot'
      },
      body: JSON.stringify({
        model: CHATBOT_MODEL,
        messages: chatHistory,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await res.json();
    removeTyping();

    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response. Please try again!";
    chatHistory.push({ role: 'assistant', content: reply });
    appendMessage(reply, 'bot');
  } catch (err) {
    removeTyping();
    appendMessage("Oops! Something went wrong. Please try again or WhatsApp us at +91 97987 29776.", 'bot');
  } finally {
    chatbotSend.disabled = false;
    chatbotInput.focus();
  }
}

chatbotSend.addEventListener('click', sendChatMessage);
chatbotInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
});

