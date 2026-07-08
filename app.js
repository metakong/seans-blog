/**
 * app.js — Client-Side Interaction Engine
 * Sean's Portfolio & LinkedIn Blog
 * Built: July 2026 | Vanilla JS / Zero Dependencies
 *
 * Responsibilities:
 *  - Scroll progress indicator
 *  - Active nav link highlighting
 *  - Mobile nav drawer toggle
 *  - Blog card click tracking
 *  - Tool card expand/collapse panels
 *  - Contact form validation & submission handler
 *  - Toast notification system
 *  - Intersection Observer animations
 *  - Scroll-triggered stat counter animations
 *  - Future tool execution hook registry
 */

/* ═══════════════════════════════════════════════════
   1. UTILITY HELPERS
═══════════════════════════════════════════════════ */

/**
 * Debounce a function call.
 * @param {Function} fn
 * @param {number} delay - ms
 * @returns {Function}
 */
function debounce(fn, delay = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle a function call.
 * @param {Function} fn
 * @param {number} limit - ms
 * @returns {Function}
 */
function throttle(fn, limit = 60) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

/**
 * Query selector shorthand (single element).
 * @param {string} selector
 * @param {Element} [root=document]
 * @returns {Element|null}
 */
const $ = (selector, root = document) => root.querySelector(selector);

/**
 * Query selector all shorthand (NodeList → Array).
 * @param {string} selector
 * @param {Element} [root=document]
 * @returns {Element[]}
 */
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/* ═══════════════════════════════════════════════════
   2. SCROLL PROGRESS INDICATOR
═══════════════════════════════════════════════════ */

function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  const updateProgress = throttle(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(progress, 100)}%`;
  });

  window.addEventListener('scroll', updateProgress, { passive: true });
}

/* ═══════════════════════════════════════════════════
   3. ACTIVE NAV LINK DETECTION
═══════════════════════════════════════════════════ */

function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = $$('.nav__link, .nav__mobile-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();

    if (
      (currentPath === '' || currentPath === 'index.html') && (linkPage === '' || linkPage === 'index.html')
      || currentPath === linkPage
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/* ═══════════════════════════════════════════════════
   4. MOBILE NAV DRAWER
═══════════════════════════════════════════════════ */

function initMobileNav() {
  const hamburger = $('#nav-hamburger');
  const mobileNav = $('#nav-mobile');
  const mobileClose = $('#nav-mobile-close');
  const mobileLinks = $$('.nav__mobile-link');

  if (!hamburger || !mobileNav) return;

  const openNav = () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
  };

  const closeNav = () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
  };

  hamburger.addEventListener('click', openNav);
  if (mobileClose) mobileClose.addEventListener('click', closeNav);
  mobileLinks.forEach(link => link.addEventListener('click', closeNav));

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeNav();
  });

  // Close on backdrop click
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeNav();
  });
}

/* ═══════════════════════════════════════════════════
   5. TOAST NOTIFICATION SYSTEM
═══════════════════════════════════════════════════ */

let toastTimeout = null;

/**
 * Display a toast notification.
 * @param {string} message - Message text
 * @param {'success'|'error'|'info'} [type='info']
 * @param {number} [duration=3000] - Display duration in ms
 */
function showToast(message, type = 'info', duration = 3000) {
  let toast = $('#app-toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const colors = { success: '#30D158', error: '#FF453A', info: '#3E91FF' };

  toast.innerHTML = `<span style="color:${colors[type]};font-weight:700;">${icons[type]}</span> ${message}`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ═══════════════════════════════════════════════════
   6. BLOG CARD CLICK TRACKING
═══════════════════════════════════════════════════ */

function initBlogTracking() {
  const blogCards = $$('.blog-card[data-post-id]');

  blogCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const postId = card.dataset.postId;
      const postTitle = card.dataset.postTitle || `Post #${postId}`;

      // Lightweight event log (console + sessionStorage)
      const log = JSON.parse(sessionStorage.getItem('clickLog') || '[]');
      log.push({
        event: 'blog_card_click',
        postId,
        postTitle,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
      });
      sessionStorage.setItem('clickLog', JSON.stringify(log.slice(-50)));

      console.info(`[ANALYTICS] Blog card clicked: "${postTitle}" (ID: ${postId})`);

      // Future: swap with GA4 / Plausible hook here
      // gtag('event', 'blog_card_click', { post_id: postId });
    });
  });
}

/* ═══════════════════════════════════════════════════
   7. TOOL CARD EXPAND / COLLAPSE PANELS
═══════════════════════════════════════════════════ */

function initToolPanels() {
  const toggleBtns = $$('[data-tool-toggle]');

  toggleBtns.forEach(btn => {
    const targetId = btn.dataset.toolToggle;
    const panel = $(`#${targetId}`);
    if (!panel) return;

    btn.addEventListener('click', () => {
      const isOpen = panel.classList.contains('open');

      // Close all other panels
      $$('.tool-panel.open').forEach(p => {
        p.classList.remove('open');
        const relBtn = $(`[data-tool-toggle="${p.id}"]`);
        if (relBtn) {
          relBtn.textContent = 'Launch Tool';
          relBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (!isOpen) {
        panel.classList.add('open');
        btn.textContent = 'Close Tool';
        btn.setAttribute('aria-expanded', 'true');
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        btn.textContent = 'Launch Tool';
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   8. CONTACT FORM HANDLER
═══════════════════════════════════════════════════ */

function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  const submitBtn = $('#form-submit-btn');
  const fields = {
    name:    { el: $('#field-name'),    rules: [{ required: true, min: 2, label: 'Name' }] },
    email:   { el: $('#field-email'),   rules: [{ required: true, email: true, label: 'Email' }] },
    subject: { el: $('#field-subject'), rules: [{ required: true, label: 'Subject' }] },
    message: { el: $('#field-message'), rules: [{ required: true, min: 20, label: 'Message' }] }
  };

  /**
   * Validate a single field value against its rules.
   * @param {string} value
   * @param {Object[]} rules
   * @returns {string|null} Error message or null if valid
   */
  function validate(value, rules) {
    for (const rule of rules) {
      if (rule.required && !value.trim()) return `${rule.label} is required.`;
      if (rule.min && value.trim().length < rule.min) return `${rule.label} must be at least ${rule.min} characters.`;
      if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.';
    }
    return null;
  }

  /**
   * Show or clear an inline field error.
   * @param {Element} fieldEl
   * @param {string|null} errorMsg
   */
  function setFieldError(fieldEl, errorMsg) {
    if (!fieldEl) return;
    const wrapper = fieldEl.closest('.form-group');
    if (!wrapper) return;

    let errorEl = wrapper.querySelector('.form-error');

    if (errorMsg) {
      fieldEl.style.borderColor = 'var(--color-error)';
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error';
        errorEl.style.cssText = 'font-size:12px;color:var(--color-error);margin-top:4px;';
        wrapper.appendChild(errorEl);
      }
      errorEl.textContent = errorMsg;
    } else {
      fieldEl.style.borderColor = '';
      if (errorEl) errorEl.remove();
    }
  }

  // Real-time validation on blur
  Object.values(fields).forEach(({ el, rules }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      const err = validate(el.value, rules);
      setFieldError(el, err);
    });
    el.addEventListener('input', () => {
      if (el.style.borderColor === 'var(--color-error)' || el.style.borderColor === 'rgb(255, 69, 58)') {
        const err = validate(el.value, rules);
        setFieldError(el, err);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let hasErrors = false;
    Object.values(fields).forEach(({ el, rules }) => {
      if (!el) return;
      const err = validate(el.value, rules);
      setFieldError(el, err);
      if (err) hasErrors = true;
    });

    if (hasErrors) {
      showToast('Please fix the errors above.', 'error');
      return;
    }

    // Simulate async submission
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    await new Promise(resolve => setTimeout(resolve, 1400));

    // Collect form payload
    const payload = {
      name:    fields.name.el?.value.trim(),
      email:   fields.email.el?.value.trim(),
      subject: fields.subject.el?.value.trim(),
      message: fields.message.el?.value.trim(),
      sentAt:  new Date().toISOString()
    };

    console.info('[CONTACT FORM] Submission payload:', payload);

    // TODO: Wire to Formspree / Netlify Forms / your own endpoint
    // const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(payload), headers: {'Content-Type': 'application/json'} });

    showToast('Message sent! I\'ll be in touch soon.', 'success', 5000);
    form.reset();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

/* ═══════════════════════════════════════════════════
   9. INTERSECTION OBSERVER — FADE-IN ANIMATIONS
═══════════════════════════════════════════════════ */

function initRevealAnimations() {
  if (!window.IntersectionObserver) return;

  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .reveal.revealed { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: 0.1s; }
    .reveal-delay-2 { transition-delay: 0.2s; }
    .reveal-delay-3 { transition-delay: 0.3s; }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════
   10. STAT COUNTER ANIMATION
═══════════════════════════════════════════════════ */

function initStatCounters() {
  if (!window.IntersectionObserver) return;

  /**
   * Animate a number from 0 to target value.
   * @param {Element} el
   * @param {number} target
   * @param {string} suffix
   * @param {number} duration - ms
   */
  function animateCount(el, target, suffix = '', duration = 1200) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count || '0');
        const suffix = el.dataset.suffix || '';
        animateCount(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  $$('[data-count]').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════
   11. TOOL EXECUTION HOOK REGISTRY
   Placeholder registry for future client-side tools.
   All tools must be zero-dependency, vanilla JS only.
═══════════════════════════════════════════════════ */

const ToolRegistry = {
  _tools: {},

  /**
   * Register a tool with its ID and executor function.
   * @param {string} id - Unique tool identifier
   * @param {Object} config
   * @param {string} config.name - Human-readable name
   * @param {Function} config.run - Executor: (inputs) => output
   */
  register(id, config) {
    if (this._tools[id]) {
      console.warn(`[TOOLS] Tool "${id}" already registered. Overwriting.`);
    }
    this._tools[id] = { id, ...config };
    console.info(`[TOOLS] Registered tool: "${config.name}" (id: ${id})`);
  },

  /**
   * Execute a registered tool.
   * @param {string} id
   * @param {Object} inputs
   * @returns {*}
   */
  async run(id, inputs) {
    const tool = this._tools[id];
    if (!tool) throw new Error(`[TOOLS] No tool registered with id: "${id}"`);
    try {
      return await tool.run(inputs);
    } catch (err) {
      console.error(`[TOOLS] Error in tool "${id}":`, err);
      throw err;
    }
  },

  /**
   * List all registered tools.
   * @returns {Object[]}
   */
  list() {
    return Object.values(this._tools).map(({ id, name }) => ({ id, name }));
  }
};

// ── Example Tool: ROI Estimator (registered immediately) ──
ToolRegistry.register('roi-estimator', {
  name: 'AI ROI Estimator',
  /**
   * Estimates return-on-investment for an AI workflow integration.
   * @param {{ hoursPerWeek: number, hourlyRate: number, efficiencyGain: number }} inputs
   * @returns {{ monthlySavings: number, annualSavings: number, paybackWeeks: number }}
   */
  run({ hoursPerWeek, hourlyRate, efficiencyGain, implementationCost = 0 }) {
    const savedHours = hoursPerWeek * (efficiencyGain / 100);
    const weeklySavings = savedHours * hourlyRate;
    const monthlySavings = weeklySavings * 4.33;
    const annualSavings = weeklySavings * 52;
    const paybackWeeks = implementationCost > 0 ? (implementationCost / weeklySavings).toFixed(1) : 0;
    return { savedHoursPerWeek: savedHours.toFixed(1), monthlySavings: monthlySavings.toFixed(2), annualSavings: annualSavings.toFixed(2), paybackWeeks };
  }
});

/* ═══════════════════════════════════════════════════
   12. ROI ESTIMATOR UI WIRING
═══════════════════════════════════════════════════ */

function initROIEstimator() {
  const form = $('#roi-form');
  const output = $('#roi-output');
  if (!form || !output) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = {
      hoursPerWeek:       parseFloat($('#roi-hours').value) || 0,
      hourlyRate:         parseFloat($('#roi-rate').value) || 0,
      efficiencyGain:     parseFloat($('#roi-efficiency').value) || 0,
      implementationCost: parseFloat($('#roi-cost').value) || 0
    };

    if (!inputs.hoursPerWeek || !inputs.hourlyRate || !inputs.efficiencyGain) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (inputs.efficiencyGain > 100 || inputs.efficiencyGain < 1) {
      showToast('Efficiency gain must be between 1–100%.', 'error');
      return;
    }

    try {
      const result = await ToolRegistry.run('roi-estimator', inputs);
      output.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-top:16px;">
          <div style="background:var(--color-canvas);border:1px solid var(--color-border);border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:var(--color-accent);">${result.savedHoursPerWeek}h</div>
            <div style="font-size:11px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:.5px;margin-top:4px;">Saved / Week</div>
          </div>
          <div style="background:var(--color-canvas);border:1px solid var(--color-border);border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:var(--color-success);">$${Number(result.monthlySavings).toLocaleString()}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:.5px;margin-top:4px;">Monthly Savings</div>
          </div>
          <div style="background:var(--color-canvas);border:1px solid var(--color-border);border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:var(--color-success);">$${Number(result.annualSavings).toLocaleString()}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:.5px;margin-top:4px;">Annual Savings</div>
          </div>
          ${inputs.implementationCost > 0 ? `
          <div style="background:var(--color-canvas);border:1px solid var(--color-border);border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:var(--color-warning);">${result.paybackWeeks}w</div>
            <div style="font-size:11px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:.5px;margin-top:4px;">Payback Period</div>
          </div>` : ''}
        </div>
      `;
      output.style.display = 'block';
      showToast('ROI calculated successfully!', 'success');
    } catch (err) {
      showToast('Calculation error. Check your inputs.', 'error');
    }
  });
}

/* ═══════════════════════════════════════════════════
   13. COPY TO CLIPBOARD UTILITY
═══════════════════════════════════════════════════ */

function initCopyBtns() {
  $$('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        showToast('Copied to clipboard!', 'success', 2000);
        setTimeout(() => { btn.textContent = original; }, 2000);
      } catch {
        showToast('Could not copy. Try manually.', 'error');
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   14. SMOOTH ANCHOR SCROLL
═══════════════════════════════════════════════════ */

function initSmoothAnchors() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = $(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ═══════════════════════════════════════════════════
   15. PAGE FADE-IN ON LOAD
═══════════════════════════════════════════════════ */

function initPageFade() {
  document.body.classList.add('page-fade');
}

/* ═══════════════════════════════════════════════════
   16. EXPOSE GLOBALS FOR DEBUGGING
═══════════════════════════════════════════════════ */

window.SeanPortfolio = {
  showToast,
  ToolRegistry,
  version: '1.0.0',
  builtAt: '2026-07-08'
};

/* ═══════════════════════════════════════════════════
   17. BOOTSTRAP — INIT ALL MODULES ON DOM READY
═══════════════════════════════════════════════════ */

function boot() {
  initScrollProgress();
  initActiveNav();
  initMobileNav();
  initRevealAnimations();
  initStatCounters();
  initBlogTracking();
  initToolPanels();
  initContactForm();
  initROIEstimator();
  initCopyBtns();
  initSmoothAnchors();
  initPageFade();

  console.info('%c Sean\'s Portfolio %c v1.0.0 ', 'background:#3E91FF;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px;', 'background:#121212;color:#E5E5E7;padding:2px 6px;border-radius:0 4px 4px 0;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
