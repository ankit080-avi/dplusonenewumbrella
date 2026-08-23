// D PLUS ONE NEW UMBRELLA AND BRAND - PROFESSIONAL INTERACTIVE LOGIC

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products-container');
  const categoryTabs = document.querySelectorAll('.tab-btn');
  const modal = document.getElementById('product-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const modalBody = document.getElementById('modal-body');
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const quoteForm = document.getElementById('inquiry-form');
  const header = document.querySelector('header');

  // ── Scroll Reveal Animation ──
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // ── Header shrink on scroll ──
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  // ── Active nav link highlight on scroll ──
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }, { passive: true });

  // ── Mobile Drawer Toggle ──
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = navLinks.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }

  // ── Render Products ──
  function renderProducts(filterCategory = 'all') {
    if (!productsContainer) return;

    const filtered = filterCategory === 'all'
      ? productsData
      : productsData.filter(p => p.category === filterCategory);

    // Fade out, replace, fade in
    productsContainer.style.opacity = '0';
    productsContainer.style.transform = 'translateY(12px)';

    setTimeout(() => {
      productsContainer.innerHTML = '';

      if (filtered.length === 0) {
        productsContainer.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#64748b;font-size:1.1rem;">No products found in this category.</div>';
        productsContainer.style.opacity = '1';
        productsContainer.style.transform = 'translateY(0)';
        return;
      }

      filtered.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.08}s`;

        const badgeHtml = product.badge ? `<span class="badge-top">${product.badge}</span>` : '';

        const specsEntries = Object.entries(product.specs);
        const specsSummary = specsEntries.slice(0, 3)
          .map(([k, v], i) => `<div class="${i % 2 === 0 ? 'spec-row-alt' : ''}"><strong>${k}:</strong> <span>${v}</span></div>`).join('');

        card.innerHTML = `
          <div class="product-img-wrapper">
            ${badgeHtml}
            <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            <div class="img-overlay">
              <button class="overlay-btn view-details-btn" data-id="${product.id}"><i class="fa-solid fa-expand"></i> View Specs</button>
            </div>
          </div>
          <div class="product-info">
            <span class="product-tag">${product.category.toUpperCase()} SERIES</span>
            <h4 class="product-title">${product.name}</h4>
            <p class="product-desc">${product.description}</p>
            <div class="product-specs-preview">
              ${specsSummary}
            </div>
            <div class="product-actions">
              <button class="btn btn-outline view-details-btn" data-id="${product.id}"><i class="fa-solid fa-list-check"></i> Specs & MOQ</button>
              <a href="#contact" class="btn btn-primary get-quote-btn" data-name="${product.name}" data-moq="${product.specs['Factory MOQ'] || '100 Pcs'}"><i class="fa-solid fa-paper-plane"></i> Bulk Quote</a>
            </div>
          </div>
        `;

        productsContainer.appendChild(card);
      });

      // Bind event listeners
      document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const prodId = parseInt(e.currentTarget.getAttribute('data-id'));
          openProductModal(prodId);
        });
      });

      document.querySelectorAll('.get-quote-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const prodName = e.currentTarget.getAttribute('data-name');
          const moq = e.currentTarget.getAttribute('data-moq');
          const reqInput = document.getElementById('requirement');
          const inquiryTypeSelect = document.getElementById('inquiry-type');
          if (reqInput && prodName) {
            reqInput.value = `Wholesale Inquiry for ${prodName} (Factory MOQ: ${moq}). Requesting master carton rates & dispatch timeline.`;
          }
          if (inquiryTypeSelect) {
            inquiryTypeSelect.value = 'wholesale';
          }
        });
      });

      productsContainer.style.opacity = '1';
      productsContainer.style.transform = 'translateY(0)';

    }, 200);
  }

  // ── Category Filtering ──
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderProducts(tab.getAttribute('data-category'));
    });
  });

  // ── Product Modal ──
  function openProductModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product || !modal || !modalBody) return;

    let specsHtml = '';
    Object.entries(product.specs).forEach(([key, val], i) => {
      const rowClass = i % 2 === 0 ? 'style="background:#f8fafc;"' : '';
      specsHtml += `<tr ${rowClass}><td class="spec-key">${key}</td><td class="spec-val">${val}</td></tr>`;
    });

    modalBody.innerHTML = `
      <div class="modal-header-section">
        <img src="${product.image}" alt="${product.name}" class="modal-product-img">
        <div class="modal-product-info">
          <span class="modal-badge">${product.badge || 'FACTORY STOCK'}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <a href="#contact" class="btn btn-primary" onclick="closeModalAndPreFill('${product.name.replace(/'/g, "\\'")}', '${(product.specs['Factory MOQ'] || '100 Pcs').replace(/'/g, "\\'")}')">
            <i class="fa-solid fa-paper-plane"></i> Request Wholesale Rate Card
          </a>
        </div>
      </div>
      <div class="modal-specs-section">
        <h4><i class="fa-solid fa-clipboard-list"></i> Manufacturer Specifications & Packaging</h4>
        <table class="specs-table">
          ${specsHtml}
        </table>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.closeModalAndPreFill = function(productName, moq) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
    const reqInput = document.getElementById('requirement');
    if (reqInput) {
      reqInput.value = `Wholesale Inquiry for ${productName} (MOQ: ${moq}). Please send ex-factory pricing and freight terms.`;
      reqInput.focus();
    }
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ── Counter Animation for Stats ──
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.getAttribute('data-target');
        if (target && !isNaN(parseInt(target))) {
          animateCounter(el, 0, parseInt(target), 1500);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(start + (end - start) * eased);
      el.textContent = current.toLocaleString() + '+';
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // ── Quote Form ──
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const mobile = document.getElementById('mobile').value;
      const inquiryType = document.getElementById('inquiry-type');
      const city = document.getElementById('city').value;
      const requirement = document.getElementById('requirement').value;

      if (!name || !mobile) {
        alert('Please enter your contact name and mobile number.');
        return;
      }

      const typeLabel = inquiryType ? inquiryType.options[inquiryType.selectedIndex].text : 'Wholesale';

      // Show success state
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Inquiry Submitted Successfully!';
        submitBtn.style.background = '#059669';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = originalHtml;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          quoteForm.reset();
        }, 3000);
      }
    });
  }

  // ── Initial Render ──
  renderProducts('all');
});
