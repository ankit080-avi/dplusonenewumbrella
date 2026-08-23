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
  const downloadCatalogBtn = document.getElementById('download-catalog-btn');
  const catalogModal = document.getElementById('catalog-modal');
  const closeCatalogModalBtn = document.querySelector('.close-catalog-modal');
  const printCatalogBtn = document.getElementById('print-catalog-action');
  const catalogTableContent = document.getElementById('catalog-table-content');

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
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
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
        card.style.animationDelay = `${index * 0.06}s`;

        const badgeHtml = product.badge ? `<span class="badge-top">${product.badge}</span>` : '';

        const specsEntries = Object.entries(product.specs);
        const specsSummary = specsEntries.slice(0, 3)
          .map(([k, v], i) => `<div class="${i % 2 === 0 ? 'spec-row-alt' : ''}"><strong>${k}:</strong> <span>${v}</span></div>`).join('');

        card.innerHTML = `
          <div class="product-img-wrapper">
            ${badgeHtml}
            <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            <div class="img-overlay">
              <button class="overlay-btn view-details-btn" data-id="${product.id}"><i class="fa-solid fa-images"></i> View Gallery & Specs</button>
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
              <button class="btn btn-outline view-details-btn" data-id="${product.id}"><i class="fa-solid fa-list-check"></i> Specs & Photos</button>
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

    }, 180);
  }

  // ── Category Filtering ──
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderProducts(tab.getAttribute('data-category'));
    });
  });

  // ── Multi-Image Gallery & Zoom in Product Modal ──
  function openProductModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product || !modal || !modalBody) return;

    // Collect all images (main + extra)
    const allImages = [product.image];
    if (product.extraImages && Array.isArray(product.extraImages)) {
      product.extraImages.forEach(img => {
        if (!allImages.includes(img)) allImages.push(img);
      });
    }

    // Build thumbnails HTML
    let thumbnailsHtml = '';
    if (allImages.length > 1) {
      thumbnailsHtml = `
        <div class="modal-thumbnails">
          ${allImages.map((img, idx) => `
            <button class="modal-thumb-btn ${idx === 0 ? 'active' : ''}" data-src="${img}">
              <img src="${img}" alt="${product.name} thumbnail ${idx + 1}">
            </button>
          `).join('')}
        </div>
      `;
    }

    // Build specs table HTML
    let specsHtml = '';
    Object.entries(product.specs).forEach(([key, val], i) => {
      const rowClass = i % 2 === 0 ? 'style="background:#f8fafc;"' : '';
      specsHtml += `<tr ${rowClass}><td class="spec-key">${key}</td><td class="spec-val">${val}</td></tr>`;
    });

    modalBody.innerHTML = `
      <div class="modal-header-section">
        <div class="modal-gallery">
          <div class="modal-main-img-container" id="zoom-img-container">
            <img src="${product.image}" alt="${product.name}" class="modal-product-img" id="main-modal-image">
            <div class="modal-zoom-badge"><i class="fa-solid fa-magnifying-glass-plus"></i> Hover to Zoom</div>
          </div>
          ${thumbnailsHtml}
        </div>
        <div class="modal-product-info">
          <span class="modal-badge">${product.badge || 'FACTORY STOCK'}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
            <a href="#contact" class="btn btn-primary" onclick="closeModalAndPreFill('${product.name.replace(/'/g, "\\'")}', '${(product.specs['Factory MOQ'] || '100 Pcs').replace(/'/g, "\\'")}')">
              <i class="fa-solid fa-paper-plane"></i> Request Wholesale Rate Card
            </a>
            <a href="tel:08037734447" class="btn btn-accent">
              <i class="fa-solid fa-phone"></i> Call 08037734447
            </a>
          </div>
        </div>
      </div>
      <div class="modal-specs-section">
        <h4><i class="fa-solid fa-clipboard-list"></i> Manufacturer Specifications & Packaging</h4>
        <table class="specs-table">
          ${specsHtml}
        </table>
      </div>
    `;

    // Interactive Thumbnail Switching
    const thumbBtns = modalBody.querySelectorAll('.modal-thumb-btn');
    const mainImg = modalBody.querySelector('#main-modal-image');
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        thumbBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const newSrc = btn.getAttribute('data-src');
        if (mainImg && newSrc) {
          mainImg.style.opacity = '0.4';
          setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
          }, 150);
        }
      });
    });

    // Dynamic Zoom on Cursor Movement
    const zoomContainer = modalBody.querySelector('#zoom-img-container');
    if (zoomContainer && mainImg) {
      zoomContainer.addEventListener('mousemove', (e) => {
        const rect = zoomContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        mainImg.style.transformOrigin = `${x}% ${y}%`;
      });
      zoomContainer.addEventListener('mouseleave', () => {
        mainImg.style.transformOrigin = 'center center';
      });
    }

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

  // ── Wholesale Catalog PDF Generator & Modal ──
  function openCatalogModal() {
    if (!catalogModal || !catalogTableContent) return;

    let rowsHtml = '';
    productsData.forEach((p, idx) => {
      rowsHtml += `
        <tr>
          <td><strong>#${idx + 1}</strong></td>
          <td><img src="${p.image}" alt="${p.name}" class="catalog-item-thumb"></td>
          <td>
            <strong>${p.name}</strong><br>
            <span style="font-size:0.75rem;color:#2563eb;text-transform:uppercase;font-weight:700;">${p.category} Series</span>
          </td>
          <td>${p.specs['Size'] || '-'}</td>
          <td>${p.specs['Material'] || '-'}</td>
          <td><span style="background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:4px;font-weight:700;font-size:0.8rem;">${p.specs['Factory MOQ'] || '100 Pcs'}</span></td>
          <td style="font-size:0.82rem;">${p.specs['Feature'] || p.specs['OEM / Logo Printing'] || 'Custom Branding Available'}</td>
        </tr>
      `;
    });

    catalogTableContent.innerHTML = `
      <table class="catalog-data-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Image</th>
            <th>Product Model</th>
            <th>Size</th>
            <th>Fabric / Material</th>
            <th>Master Carton MOQ</th>
            <th>Special Features / OEM</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;

    catalogModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (downloadCatalogBtn) {
    downloadCatalogBtn.addEventListener('click', openCatalogModal);
  }

  if (closeCatalogModalBtn) {
    closeCatalogModalBtn.addEventListener('click', () => {
      catalogModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (catalogModal) {
    catalogModal.addEventListener('click', (e) => {
      if (e.target === catalogModal) {
        catalogModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (printCatalogBtn) {
    printCatalogBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ── B2B FAQ Accordion Logic ──
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentItem = btn.parentElement;
      const isOpen = currentItem.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const q = item.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        currentItem.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (catalogModal && catalogModal.classList.contains('active')) {
        catalogModal.classList.remove('active');
        document.body.style.overflow = '';
      }
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
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);
      el.textContent = current.toLocaleString() + '+';
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // ── Quote Form Submission ──
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
