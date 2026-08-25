// D PLUS ONE NEW UMBRELLA AND BRAND - COMPLETE PROFESSIONAL LOGIC & CATALOG ENGINE

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
  const searchInput = document.getElementById('product-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const searchCountBadge = document.getElementById('search-count-badge');
  const mobileCatalogTrigger = document.getElementById('mobile-catalog-trigger');

  let currentCategory = 'all';
  let currentSearchQuery = '';
  let catalogModalCategory = 'all';

  // ── Scroll Reveal Animation ──
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // ── Header shrink on scroll ──
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
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
      const sectionTop = section.offsetTop - 130;
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

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }

  // ── Category Names Helper ──
  function getCategoryLabel(cat) {
    const map = {
      'fold': 'Fold Series',
      'stick': '23" Stick Series',
      'fiber': '25" Fiber Series',
      'golf': 'Golf & Window',
      'garden': 'Garden & Gazebo'
    };
    return map[cat] || cat.toUpperCase();
  }

  // ── Render Products with Category & Live Search ──
  function renderFilteredProducts() {
    if (!productsContainer) return;

    let filtered = productsData;

    // Filter by Category
    if (currentCategory !== 'all') {
      filtered = filtered.filter(p => p.category === currentCategory);
    }

    // Filter by Search Query
    if (currentSearchQuery.trim() !== '') {
      const q = currentSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const catMatch = p.category.toLowerCase().includes(q);
        const specsMatch = Object.values(p.specs).some(val => val.toLowerCase().includes(q));
        return nameMatch || descMatch || catMatch || specsMatch;
      });
    }

    // Update result count badge
    if (searchCountBadge) {
      searchCountBadge.textContent = `Showing ${filtered.length} Product${filtered.length === 1 ? '' : 's'}`;
    }

    productsContainer.style.opacity = '0';
    productsContainer.style.transform = 'translateY(8px)';

    setTimeout(() => {
      productsContainer.innerHTML = '';

      if (filtered.length === 0) {
        productsContainer.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:50px 20px;color:#64748b;background:white;border-radius:14px;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <i class="fa-solid fa-umbrella" style="font-size:2.6rem;color:#94a3b8;margin-bottom:12px;"></i>
            <h4 style="color:#0a1128;font-size:1.2rem;font-weight:800;margin-bottom:6px;">No products match your search</h4>
            <p style="font-size:0.9rem;color:#64748b;">Try searching for "24 inch", "fold", "rainbow", "golf", or clear the filter.</p>
          </div>
        `;
        productsContainer.style.opacity = '1';
        productsContainer.style.transform = 'translateY(0)';
        return;
      }

      filtered.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.04}s`;

        const badgeHtml = product.badge ? `<span class="badge-top"><i class="fa-solid fa-tag"></i> ${product.badge}</span>` : '';
        const catLabel = getCategoryLabel(product.category);

        const sizeVal = product.specs['Size'] || 'Standard';
        const moqVal = product.specs['Factory MOQ'] || '100 Pcs';
        const typeVal = product.specs['Type'] || product.specs['Feature'] || 'Windproof';
        const materialVal = product.specs['Material'] || 'High-Grade Polyester';

        card.innerHTML = `
          <div class="product-img-wrapper">
            ${badgeHtml}
            <span class="badge-category">${catLabel}</span>
            <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            <div class="img-overlay">
              <button class="overlay-btn view-details-btn" data-id="${product.id}">
                <i class="fa-solid fa-expand"></i> Inspect Specs & Photos
              </button>
            </div>
          </div>
          <div class="product-info">
            <div class="product-title-row">
              <h4 class="product-title">${product.name}</h4>
            </div>
            
            <p class="product-desc">${product.description}</p>
            
            <!-- 4-Point Specs Matrix -->
            <div class="product-specs-chips">
              <div class="spec-chip"><i class="fa-solid fa-ruler-combined"></i> <span>Size: <strong>${sizeVal}</strong></span></div>
              <div class="spec-chip"><i class="fa-solid fa-boxes-packing"></i> <span>MOQ: <strong>${moqVal}</strong></span></div>
              <div class="spec-chip"><i class="fa-solid fa-shield-halved"></i> <span>${typeVal}</span></div>
              <div class="spec-chip"><i class="fa-solid fa-layer-group"></i> <span>${materialVal}</span></div>
            </div>

            <!-- Ready Stock Indicator -->
            <div class="card-stock-indicator">
              <span class="stock-dot"></span> <span>Factory Direct • Bhiwandi Stock</span>
            </div>

            <div class="product-actions">
              <button class="btn btn-outline view-details-btn" data-id="${product.id}">
                <i class="fa-solid fa-images"></i> Full Specs
              </button>
              <a href="#contact" class="btn btn-primary get-quote-btn" data-name="${product.name}" data-moq="${moqVal}">
                <i class="fa-solid fa-paper-plane"></i> Request Rate
              </a>
            </div>
          </div>
        `;

        productsContainer.appendChild(card);
      });

      // Bind modal & quote listeners
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

    }, 120);
  }

  // ── Live Search Input Listeners ──
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      if (searchClearBtn) {
        if (currentSearchQuery.length > 0) {
          searchClearBtn.classList.add('visible');
        } else {
          searchClearBtn.classList.remove('visible');
        }
      }
      renderFilteredProducts();
    });
  }

  if (searchClearBtn && searchInput) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      searchClearBtn.classList.remove('visible');
      renderFilteredProducts();
      searchInput.focus();
    });
  }

  // ── Category Tab Listeners ──
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      renderFilteredProducts();
    });
  });

  // ── Multi-Image Gallery & Dynamic Cursor Zoom in Product Modal ──
  function openProductModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product || !modal || !modalBody) return;

    const allImages = [product.image];
    if (product.extraImages && Array.isArray(product.extraImages)) {
      product.extraImages.forEach(img => {
        if (!allImages.includes(img)) allImages.push(img);
      });
    }

    let thumbnailsHtml = '';
    if (allImages.length > 1) {
      thumbnailsHtml = `
        <div class="modal-thumbnails">
          ${allImages.map((img, idx) => `
            <button class="modal-thumb-btn ${idx === 0 ? 'active' : ''}" data-src="${img}" title="View Angle ${idx + 1}">
              <img src="${img}" alt="${product.name} angle ${idx + 1}">
            </button>
          `).join('')}
        </div>
      `;
    }

    let specsHtml = '';
    Object.entries(product.specs).forEach(([key, val], i) => {
      const rowClass = i % 2 === 0 ? 'style="background:#f8fafc;"' : '';
      specsHtml += `<tr ${rowClass}><td class="spec-key"><i class="fa-solid fa-check" style="color:#1d4ed8;margin-right:6px;font-size:0.75rem;"></i> ${key}</td><td class="spec-val"><strong>${val}</strong></td></tr>`;
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
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span class="modal-badge">${product.badge || 'FACTORY STOCK'}</span>
            <span class="modal-category-tag">${getCategoryLabel(product.category)}</span>
          </div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">
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
        <h4><i class="fa-solid fa-clipboard-list"></i> Complete Technical Specifications & Packaging Data</h4>
        <table class="specs-table">
          ${specsHtml}
        </table>
      </div>
    `;

    // Thumbnail Switcher
    const thumbBtns = modalBody.querySelectorAll('.modal-thumb-btn');
    const mainImg = modalBody.querySelector('#main-modal-image');
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        thumbBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const newSrc = btn.getAttribute('data-src');
        if (mainImg && newSrc) {
          mainImg.style.opacity = '0.3';
          setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
          }, 100);
        }
      });
    });

    // Dynamic Cursor Zoom Lens
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

  // ── Wholesale Catalog PDF Generator & Interactive Modal ──
  function renderCatalogTable(categoryFilter = 'all') {
    if (!catalogTableContent) return;

    let filtered = productsData;
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    let rowsHtml = '';
    filtered.forEach((p, idx) => {
      const sizeVal = p.specs['Size'] || '-';
      const matVal = p.specs['Material'] || 'High-Grade Polyester';
      const moqVal = p.specs['Factory MOQ'] || '100 Pcs / Ctn';
      const featureVal = p.specs['Feature'] || p.specs['OEM / Logo Printing'] || 'Windproof Frame, Custom Branding';

      rowsHtml += `
        <tr>
          <td style="text-align:center;font-weight:800;color:#64748b;">#${idx + 1}</td>
          <td style="text-align:center;">
            <img src="${p.image}" alt="${p.name}" class="catalog-item-thumb">
          </td>
          <td>
            <strong style="color:#0a1128;font-size:0.92rem;display:block;">${p.name}</strong>
            <span class="catalog-table-category">${getCategoryLabel(p.category)}</span>
          </td>
          <td><span class="cat-spec-pill"><i class="fa-solid fa-ruler-combined"></i> ${sizeVal}</span></td>
          <td style="font-size:0.84rem;color:#334155;">${matVal}</td>
          <td><span class="catalog-moq-badge">${moqVal}</span></td>
          <td style="font-size:0.82rem;color:#475569;">${featureVal}</td>
          <td style="text-align:center;">
            <button class="btn btn-primary cat-row-inquire-btn" data-name="${p.name}" data-moq="${moqVal}">
              <i class="fa-solid fa-paper-plane"></i> Inquire
            </button>
          </td>
        </tr>
      `;
    });

    catalogTableContent.innerHTML = `
      <table class="catalog-data-table">
        <thead>
          <tr>
            <th style="width:40px;text-align:center;">No.</th>
            <th style="width:70px;text-align:center;">Photo</th>
            <th>Product Model & Category</th>
            <th>Canopy Size</th>
            <th>Fabric / Material</th>
            <th>Master Carton MOQ</th>
            <th>Features / OEM</th>
            <th style="width:110px;text-align:center;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;

    // Bind row inquire buttons
    catalogTableContent.querySelectorAll('.cat-row-inquire-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = e.currentTarget.getAttribute('data-name');
        const moq = e.currentTarget.getAttribute('data-moq');
        if (catalogModal) {
          catalogModal.classList.remove('active');
          document.body.style.overflow = '';
        }
        const reqInput = document.getElementById('requirement');
        const inquirySelect = document.getElementById('inquiry-type');
        if (reqInput) {
          reqInput.value = `Wholesale Catalog Inquiry: ${name} (MOQ: ${moq}). Please share today's ex-factory master carton pricing and transport LR terms.`;
          reqInput.focus();
        }
        if (inquirySelect) inquirySelect.value = 'wholesale';
        const contactSection = document.getElementById('contact');
        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function openCatalogModal() {
    if (!catalogModal) return;

    // Reset tabs
    const catTabs = document.querySelectorAll('.cat-modal-tab');
    catTabs.forEach(t => {
      if (t.getAttribute('data-cat') === 'all') t.classList.add('active');
      else t.classList.remove('active');
    });

    renderCatalogTable('all');
    catalogModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Inside Catalog Modal Category Filter Tabs
  document.querySelectorAll('.cat-modal-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-modal-tab').forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const cat = e.currentTarget.getAttribute('data-cat');
      renderCatalogTable(cat);
    });
  });

  if (downloadCatalogBtn) {
    downloadCatalogBtn.addEventListener('click', openCatalogModal);
  }

  if (mobileCatalogTrigger) {
    mobileCatalogTrigger.addEventListener('click', openCatalogModal);
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

  // ── Interactive Bulk Order & Master Carton Calculator ──
  const calcProductSelect = document.getElementById('calc-product-select');
  const calcQtyRange = document.getElementById('calc-qty-range');
  const calcQtyDisplay = document.getElementById('calc-qty-display');
  const calcPills = document.querySelectorAll('.qty-pill');
  const calcDestState = document.getElementById('calc-dest-state');
  const metricCartons = document.getElementById('metric-cartons');
  const metricCartonNote = document.getElementById('metric-carton-note');
  const metricUnits = document.getElementById('metric-units');
  const metricWeight = document.getElementById('metric-weight');
  const metricTransit = document.getElementById('metric-transit');
  const calcOrderBtn = document.getElementById('calc-order-quote-btn');

  // Populate Calculator Product Dropdown
  if (calcProductSelect && productsData.length > 0) {
    calcProductSelect.innerHTML = productsData.map(p => `
      <option value="${p.id}">${p.name} (${getCategoryLabel(p.category)} - ${p.specs['Size'] || ''})</option>
    `).join('');
  }

  function updateCalculator() {
    if (!calcProductSelect || !calcQtyRange) return;

    const selectedId = parseInt(calcProductSelect.value);
    const product = productsData.find(p => p.id === selectedId) || productsData[0];
    const qty = parseInt(calcQtyRange.value);

    if (calcQtyDisplay) calcQtyDisplay.textContent = `${qty.toLocaleString()} Pcs`;

    // Extract MOQ per carton from product specs
    let pcsPerCarton = 100;
    const moqText = product.specs['Factory MOQ'] || '';
    const match = moqText.match(/(\d+)/);
    if (match) {
      pcsPerCarton = parseInt(match[1]);
    }

    const cartons = Math.ceil(qty / pcsPerCarton);
    const estWeightKg = Math.round(qty * 0.44);

    const transitTimes = {
      mh: 'Same Day / 24h',
      guj: '24 to 48 Hours',
      north: '2 to 3 Days',
      south: '2 to 3 Days',
      east: '3 to 4 Days'
    };
    const region = calcDestState ? calcDestState.value : 'mh';

    if (metricCartons) metricCartons.textContent = `${cartons} Carton${cartons > 1 ? 's' : ''}`;
    if (metricCartonNote) metricCartonNote.textContent = `${pcsPerCarton} Pcs / Master Carton`;
    if (metricUnits) metricUnits.textContent = `${qty.toLocaleString()} Pcs`;
    if (metricWeight) metricWeight.textContent = `~${estWeightKg} Kg`;
    if (metricTransit) metricTransit.textContent = transitTimes[region] || '24-48 Hours';

    if (calcOrderBtn) {
      calcOrderBtn.onclick = () => {
        const reqInput = document.getElementById('requirement');
        const inquirySelect = document.getElementById('inquiry-type');
        if (reqInput) {
          reqInput.value = `Bulk Master Carton Inquiry: ${product.name} — Quantity: ${qty} units (${cartons} Master Cartons, MOQ: ${pcsPerCarton}/ctn). Destination: ${calcDestState ? calcDestState.options[calcDestState.selectedIndex].text : 'Maharashtra'}. Please share ex-factory price and dispatch LR terms.`;
          reqInput.focus();
        }
        if (inquirySelect) inquirySelect.value = 'wholesale';
      };
    }
  }

  if (calcProductSelect) calcProductSelect.addEventListener('change', updateCalculator);
  if (calcDestState) calcDestState.addEventListener('change', updateCalculator);

  if (calcQtyRange) {
    calcQtyRange.addEventListener('input', () => {
      calcPills.forEach(p => {
        if (parseInt(p.getAttribute('data-qty')) === parseInt(calcQtyRange.value)) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
      updateCalculator();
    });
  }

  calcPills.forEach(pill => {
    pill.addEventListener('click', () => {
      calcPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const val = parseInt(pill.getAttribute('data-qty'));
      if (calcQtyRange) calcQtyRange.value = val;
      updateCalculator();
    });
  });

  updateCalculator();

  // ── B2B FAQ Accordion Logic ──
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentItem = btn.parentElement;
      const isOpen = currentItem.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const q = item.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

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
          animateCounter(el, 0, parseInt(target), 1400);
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

      if (!name || !mobile) {
        alert('Please enter your contact name and mobile number.');
        return;
      }

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

  // ── Initial Product Render ──
  renderFilteredProducts();
});
