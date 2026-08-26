// D PLUS ONE NEW UMBRELLA AND BRAND - COMPLETE PROFESSIONAL LOGIC & DUAL CATALOG ENGINE
// Features: Visual Brochure (AKC Multi-Page Style) + Wholesale Rate Card (Table) + Instant Search + Calculator

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
  
  // Rate Card Elements
  const downloadCatalogBtn = document.getElementById('download-catalog-btn');
  const navRateCardBtn = document.getElementById('nav-rate-card-btn');
  const catalogModal = document.getElementById('catalog-modal');
  const closeCatalogModalBtn = document.querySelector('.close-catalog-modal');
  const printCatalogBtn = document.getElementById('print-catalog-action');
  const catalogTableContent = document.getElementById('catalog-table-content');
  const mobileCatalogTrigger = document.getElementById('mobile-catalog-trigger');

  // Visual Brochure Elements
  const visualCatalogModal = document.getElementById('visual-catalog-modal');
  const closeBrochureModalBtn = document.querySelector('.close-brochure-modal');
  const openVisualCatalogBtn = document.getElementById('open-visual-catalog-btn');
  const navVisualCatalogBtn = document.getElementById('nav-visual-catalog-btn');
  const mobileVisualCatalogTrigger = document.getElementById('mobile-visual-catalog-trigger');
  const brochurePagesContainer = document.getElementById('brochure-pages-container');
  const brochurePrevBtn = document.getElementById('brochure-prev-btn');
  const brochureNextBtn = document.getElementById('brochure-next-btn');
  const brochurePageIndicator = document.getElementById('brochure-page-indicator');
  const brochureSeriesSelect = document.getElementById('brochure-series-select');
  const brochureViewToggle = document.getElementById('brochure-view-toggle');
  const printBrochureBtn = document.getElementById('print-brochure-action');
  const brochureViewport = document.getElementById('brochure-viewport');

  // Search Elements
  const searchInput = document.getElementById('product-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const searchCountBadge = document.getElementById('search-count-badge');

  let currentCategory = 'all';
  let currentSearchQuery = '';
  let currentBrochurePageIndex = 0;
  let isBrochureAllView = false;
  const totalBrochurePages = productsData.length + 1; // 1 Cover + 20 Product Pages = 21 Pages

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

    if (currentCategory !== 'all') {
      filtered = filtered.filter(p => p.category === currentCategory);
    }

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
            
            <div class="product-specs-chips">
              <div class="spec-chip"><i class="fa-solid fa-ruler-combined"></i> <span>Size: <strong>${sizeVal}</strong></span></div>
              <div class="spec-chip"><i class="fa-solid fa-boxes-packing"></i> <span>MOQ: <strong>${moqVal}</strong></span></div>
              <div class="spec-chip"><i class="fa-solid fa-shield-halved"></i> <span>${typeVal}</span></div>
              <div class="spec-chip"><i class="fa-solid fa-layer-group"></i> <span>${materialVal}</span></div>
            </div>

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

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      renderFilteredProducts();
    });
  });

  // ── Product Specs Modal ──
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

  // ═══════════════════════════════════════════════════════════
  // 1. 2026 VISUAL CATALOG BROCHURE (AKC MULTI-PAGE STYLE)
  // ═══════════════════════════════════════════════════════════
  function buildVisualBrochurePages() {
    if (!brochurePagesContainer) return;
    brochurePagesContainer.innerHTML = '';

    // Page 0: Cover Page
    const coverPage = document.createElement('div');
    coverPage.className = 'brochure-page brochure-cover-page';
    coverPage.setAttribute('data-page-index', '0');
    coverPage.innerHTML = `
      <div class="brochure-cover-inner">
        <div>
          <h2 class="cover-top-title">Product Catalog</h2>
          <span class="cover-edition-badge"><i class="fa-solid fa-award"></i> Official 2026 Wholesale Exporter Edition</span>
        </div>

        <div class="cover-center-brand">
          <div class="cover-official-logo-box">
            <img src="logo.png" alt="D Plus One New Umbrella and Brand Logo" class="cover-official-logo-large">
          </div>
          <h1 class="cover-brand-name">D PLUS ONE NEW UMBRELLA AND BRAND</h1>
          <p class="cover-brand-sub">Premier Umbrella Manufacturer & Wholesale Distributor</p>
          <div style="font-size:0.85rem;color:#1d4ed8;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-top:6px;">
            Factory: Bhiwandi, Maharashtra • GSTIN: 27GGVPP4625K1ZH
          </div>
        </div>

        <div>
          <div class="cover-series-grid">
            <span class="cover-series-chip"><i class="fa-solid fa-circle-check" style="color:#2563eb;"></i> Fold Series (8 Models)</span>
            <span class="cover-series-chip"><i class="fa-solid fa-circle-check" style="color:#2563eb;"></i> 23" Stick Series (5 Models)</span>
            <span class="cover-series-chip"><i class="fa-solid fa-circle-check" style="color:#2563eb;"></i> 25" Fiber Series (1 Model)</span>
            <span class="cover-series-chip"><i class="fa-solid fa-circle-check" style="color:#2563eb;"></i> Golf & Window Series (4 Models)</span>
            <span class="cover-series-chip"><i class="fa-solid fa-circle-check" style="color:#2563eb;"></i> Garden Canopies (2 Models)</span>
          </div>

          <div class="cover-footer-meta">
            <p><strong>Factory & Central Warehouse:</strong> Bhiwandi Industrial Corridor, Thane, Maharashtra — 421302</p>
            <p><strong>GSTIN:</strong> 27GGVPP4625K1ZH &nbsp;|&nbsp; <strong>Helpline:</strong> 08037734447 &nbsp;|&nbsp; <strong>Email:</strong> sales@dplusonenewumbrella.com</p>
          </div>
        </div>
      </div>
    `;
    brochurePagesContainer.appendChild(coverPage);

    // Pages 1 to 20: Product Pages
    productsData.forEach((p, idx) => {
      const pageNum = idx + 1;
      const formattedPageNum = pageNum < 10 ? `0${pageNum}` : `${pageNum}`;
      const catName = getCategoryLabel(p.category);
      const moqVal = p.specs['Factory MOQ'] || '100 PCS / BAG';
      const sizeVal = p.specs['Size'] || '24 Inch';
      const materialVal = p.specs['Material'] || 'High-Grade Polyester';
      const featureVal = p.specs['Feature'] || p.specs['Type'] || 'Windproof Steel Frame';

      const pageEl = document.createElement('div');
      pageEl.className = 'brochure-page';
      pageEl.setAttribute('data-page-index', `${pageNum}`);

      pageEl.innerHTML = `
        <div class="brochure-inner-frame">
          <!-- Page Header with Official Client Logo -->
          <div class="brochure-page-header">
            <div class="brochure-brand-logo-unit">
              <div class="brochure-official-logo-badge">
                <img src="logo.png" alt="D Plus One Logo" class="brochure-official-logo">
              </div>
              <div class="brochure-mini-brand-name">
                D PLUS ONE NEW UMBRELLA AND BRAND
                <span>DIRECT MANUFACTURER • BHIWANDI</span>
              </div>
            </div>
            <div class="brochure-series-tag">${catName}</div>
          </div>

          <!-- Page Body & Giant Product Hero Image with Logo Watermark -->
          <div class="brochure-page-body">
            <img src="logo.png" alt="D Plus One Watermark Logo" class="brochure-logo-watermark">
            <img src="${p.image}" alt="${p.name}" class="brochure-product-img" loading="lazy">
          </div>

          <!-- Page Footer Info -->
          <div>
            <div class="brochure-page-footer-content">
              <div class="brochure-product-title-wrap">
                <div class="brochure-badge-line">
                  <span class="brochure-category-pill">${catName}</span>
                  <span class="brochure-moq-pill"><i class="fa-solid fa-boxes-packing"></i> Factory MOQ: ${moqVal}</span>
                  <span class="brochure-season-pill"><i class="fa-solid fa-cloud-showers-heavy"></i> ${p.specs['Season'] || 'Heavy Rain / All Weather'}</span>
                </div>
                <h3 class="brochure-product-title">${p.name}</h3>
                
                <!-- Complete Technical Specifications Grid -->
                <div class="brochure-specs-grid">
                  <div class="brochure-spec-item">
                    <i class="fa-solid fa-ruler-combined"></i>
                    <span>Size: <strong>${sizeVal}</strong></span>
                  </div>
                  <div class="brochure-spec-item">
                    <i class="fa-solid fa-layer-group"></i>
                    <span>Fabric: <strong>${materialVal}</strong></span>
                  </div>
                  <div class="brochure-spec-item">
                    <i class="fa-solid fa-shield-halved"></i>
                    <span>Frame: <strong>${featureVal}</strong></span>
                  </div>
                  <div class="brochure-spec-item">
                    <i class="fa-solid fa-palette"></i>
                    <span>Colors: <strong>${p.specs['Colors'] || 'Assorted Multiple Colors'}</strong></span>
                  </div>
                </div>

                <p class="brochure-mini-desc">${p.description}</p>
              </div>

              <div class="brochure-badge-column">
                <div class="brochure-packaging-badge">
                  <i class="fa-solid fa-box"></i>
                  <div>
                    <div style="font-size:0.62rem;opacity:0.85;">PACKAGING</div>
                    <div>${moqVal.replace(' / Carton', '').replace(' / Bag', '')}</div>
                  </div>
                </div>
                <div class="brochure-page-num">${formattedPageNum}</div>
              </div>
            </div>

            <!-- Page Subfooter -->
            <div class="brochure-page-subfooter">
              🌐 www.dplusonenewumbrella.com &nbsp;|&nbsp; 📞 08037734447 &nbsp;|&nbsp; 🏭 Direct Bhiwandi Factory • GSTIN: 27GGVPP4625K1ZH
            </div>
          </div>
        </div>
      `;

      brochurePagesContainer.appendChild(pageEl);
    });
  }

  function updateBrochureView() {
    const pages = brochurePagesContainer.querySelectorAll('.brochure-page');
    if (!pages.length) return;

    if (isBrochureAllView) {
      pages.forEach(p => p.style.display = 'flex');
      if (brochurePageIndicator) brochurePageIndicator.textContent = `All 21 Pages`;
      if (brochureViewToggle) brochureViewToggle.innerHTML = `<i class="fa-solid fa-file"></i> Single Page Mode`;
    } else {
      pages.forEach((p, idx) => {
        if (idx === currentBrochurePageIndex) {
          p.style.display = 'flex';
        } else {
          p.style.display = 'none';
        }
      });
      if (brochurePageIndicator) {
        brochurePageIndicator.textContent = `Page ${currentBrochurePageIndex + 1} / ${totalBrochurePages}`;
      }
      if (brochureViewToggle) {
        brochureViewToggle.innerHTML = `<i class="fa-solid fa-scroll"></i> View All 21 Pages`;
      }
    }

    if (brochureSeriesSelect && !isBrochureAllView) {
      if (currentBrochurePageIndex === 0) brochureSeriesSelect.value = "0";
      else if (currentBrochurePageIndex <= 8) brochureSeriesSelect.value = "1";
      else if (currentBrochurePageIndex <= 13) brochureSeriesSelect.value = "9";
      else if (currentBrochurePageIndex <= 14) brochureSeriesSelect.value = "14";
      else if (currentBrochurePageIndex <= 18) brochureSeriesSelect.value = "15";
      else brochureSeriesSelect.value = "19";
    }

    if (brochureViewport) brochureViewport.scrollTop = 0;
  }

  function openVisualBrochure(startPage = 0) {
    if (!visualCatalogModal) return;
    buildVisualBrochurePages();
    currentBrochurePageIndex = startPage;
    isBrochureAllView = false;
    updateBrochureView();
    visualCatalogModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (openVisualCatalogBtn) {
    openVisualCatalogBtn.addEventListener('click', () => openVisualBrochure(0));
  }
  if (navVisualCatalogBtn) {
    navVisualCatalogBtn.addEventListener('click', () => openVisualBrochure(0));
  }
  if (mobileVisualCatalogTrigger) {
    mobileVisualCatalogTrigger.addEventListener('click', () => openVisualBrochure(0));
  }

  if (brochurePrevBtn) {
    brochurePrevBtn.addEventListener('click', () => {
      isBrochureAllView = false;
      currentBrochurePageIndex = (currentBrochurePageIndex - 1 + totalBrochurePages) % totalBrochurePages;
      updateBrochureView();
    });
  }

  if (brochureNextBtn) {
    brochureNextBtn.addEventListener('click', () => {
      isBrochureAllView = false;
      currentBrochurePageIndex = (currentBrochurePageIndex + 1) % totalBrochurePages;
      updateBrochureView();
    });
  }

  if (brochureSeriesSelect) {
    brochureSeriesSelect.addEventListener('change', (e) => {
      isBrochureAllView = false;
      currentBrochurePageIndex = parseInt(e.target.value);
      updateBrochureView();
    });
  }

  if (brochureViewToggle) {
    brochureViewToggle.addEventListener('click', () => {
      isBrochureAllView = !isBrochureAllView;
      updateBrochureView();
    });
  }

  if (printBrochureBtn) {
    printBrochureBtn.addEventListener('click', () => {
      // Ensure all 21 pages are rendered and visible
      const pages = brochurePagesContainer.querySelectorAll('.brochure-page');
      pages.forEach(p => p.style.display = 'flex');
      document.body.classList.add('printing-brochure');
      
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.body.classList.remove('printing-brochure');
          updateBrochureView();
        }, 800);
      }, 150);
    });
  }

  if (closeBrochureModalBtn) {
    closeBrochureModalBtn.addEventListener('click', () => {
      visualCatalogModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (visualCatalogModal) {
    visualCatalogModal.addEventListener('click', (e) => {
      if (e.target === visualCatalogModal) {
        visualCatalogModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 2. WHOLESALE RATE CARD MODAL (TABLE INDEX)
  // ═══════════════════════════════════════════════════════════
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
    const catTabs = document.querySelectorAll('.cat-modal-tab');
    catTabs.forEach(t => {
      if (t.getAttribute('data-cat') === 'all') t.classList.add('active');
      else t.classList.remove('active');
    });

    renderCatalogTable('all');
    catalogModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

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
  if (navRateCardBtn) {
    navRateCardBtn.addEventListener('click', openCatalogModal);
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
      document.body.classList.remove('printing-brochure');
      window.print();
    });
  }

  // ── Bulk Order & Master Carton Calculator ──
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
      if (visualCatalogModal && visualCatalogModal.classList.contains('active')) {
        visualCatalogModal.classList.remove('active');
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

  // Initial render
  renderFilteredProducts();
});
