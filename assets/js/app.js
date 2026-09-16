/**
 * Luxury Cabs - Main Application UI Controller & Animations
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initCurrencySelector();
  initHeroBookingForm();
  renderFleetGrid("all");
  initFleetFilterTabs();
  initFareCalculatorWidget();
  initBookingTracker();
  initFaqAccordion();
  initTestimonialsSlider();
  initSmoothScroll();
  initStatsCounter();
  initScrollReveal();
  initHeroGoldenParticles();
  initActiveNavSpy();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector(".luxury-navbar");
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav-drawer");
  const mobileClose = document.querySelector(".mobile-nav-close");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

  // Sticky navbar shadow on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });

  // Mobile menu open/close
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener("click", () => {
      mobileNav.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  }

  const closeDrawer = () => {
    mobileNav?.classList.remove("open");
    document.body.style.overflow = "auto";
  };

  if (mobileClose) mobileClose.addEventListener("click", closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });
}

/* Active Nav Spy on Scroll */
function initActiveNavSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active-nav");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active-nav");
      }
    });
  });
}

/* ==========================================================================
   2. CURRENCY SELECTOR
   ========================================================================== */
function initCurrencySelector() {
  const currencySelects = document.querySelectorAll(".currency-selector");
  const current = getGlobalCurrency();

  currencySelects.forEach(select => {
    select.value = current;
    select.addEventListener("change", (e) => {
      const val = e.target.value;
      setGlobalCurrency(val);
      currencySelects.forEach(s => s.value = val);
      renderFleetGrid(document.querySelector(".fleet-tab-btn.active")?.dataset.category || "all");
      if (typeof updateCalculatorWidgetUI === "function") updateCalculatorWidgetUI();
    });
  });

  document.addEventListener("currencyChanged", () => {
    renderFleetGrid(document.querySelector(".fleet-tab-btn.active")?.dataset.category || "all");
    if (typeof updateCalculatorWidgetUI === "function") updateCalculatorWidgetUI();
  });
}

/* ==========================================================================
   3. HERO QUICK BOOKING FORM
   ========================================================================== */
function initHeroBookingForm() {
  const heroForm = document.getElementById("hero-booking-form");
  const heroTripBtns = document.querySelectorAll(".hero-tab-btn");

  let selectedTripType = "one-way";

  heroTripBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      heroTripBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedTripType = btn.dataset.type;

      const dropWrap = document.getElementById("hero-drop-wrap");
      const hoursWrap = document.getElementById("hero-hours-wrap");

      if (selectedTripType === "hourly") {
        if (dropWrap) dropWrap.style.display = "none";
        if (hoursWrap) hoursWrap.style.display = "block";
      } else {
        if (dropWrap) dropWrap.style.display = "block";
        if (hoursWrap) hoursWrap.style.display = "none";
      }
    });
  });

  if (heroForm) {
    heroForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const pickup = document.getElementById("hero-pickup")?.value.trim();
      const drop = document.getElementById("hero-drop")?.value.trim();
      const date = document.getElementById("hero-date")?.value;
      const time = document.getElementById("hero-time")?.value;
      const fleetTier = document.getElementById("hero-fleet-tier")?.value;
      const hours = parseInt(document.getElementById("hero-hours")?.value) || 4;

      if (!pickup) {
        bookingEngine.showToast("Please enter a pickup location", "warning");
        document.getElementById("hero-pickup")?.focus();
        return;
      }

      if (selectedTripType !== "hourly" && !drop) {
        bookingEngine.showToast("Please enter a destination", "warning");
        document.getElementById("hero-drop")?.focus();
        return;
      }

      let carId = "mercedes-s-class";
      if (fleetTier === "royal") carId = "rolls-royce-ghost";
      else if (fleetTier === "suv") carId = "range-rover-vogue";
      else if (fleetTier === "van") carId = "mercedes-v-class";
      else if (fleetTier === "sedan") carId = "bmw-7-series";

      bookingEngine.openModal({
        tripType: selectedTripType,
        pickupLocation: pickup,
        dropLocation: drop,
        pickupDate: date || bookingEngine.bookingData.pickupDate,
        pickupTime: time || "14:00",
        carId: carId,
        hours: hours
      });
    });
  }
}

/* ==========================================================================
   4. FLEET SHOWCASE & 3D TILT EFFECT
   ========================================================================== */
function renderFleetGrid(category = "all") {
  const container = document.getElementById("fleet-grid-container");
  if (!container) return;

  const curr = getGlobalCurrency();
  const filtered = category === "all"
    ? FLEET_DATA
    : FLEET_DATA.filter(car => car.category === category);

  container.innerHTML = filtered.map((car, index) => {
    const rate = car.rates[curr] || car.rates.INR;
    return `
      <div class="fleet-card reveal-on-scroll stagger-${(index % 3) + 1}" data-tilt data-car-id="${car.id}">
        <div class="fleet-card-badge">${car.badge}</div>
        <div class="fleet-img-container">
          <img src="${car.image}" alt="${car.name}" loading="lazy" class="fleet-img">
          <div class="fleet-img-overlay">
            <span class="rating-pill"><i class="icon-star"></i> ${car.rating} (${car.reviewsCount} VIP reviews)</span>
          </div>
        </div>
        
        <div class="fleet-card-body">
          <div class="fleet-header">
            <h3 class="fleet-title">${car.name}</h3>
            <p class="fleet-tagline">${car.tagline}</p>
          </div>

          <div class="fleet-specs-grid">
            <div class="spec-item">
              <i class="icon-users"></i>
              <span>${car.passengers} Passengers</span>
            </div>
            <div class="spec-item">
              <i class="icon-briefcase"></i>
              <span>${car.luggage} Luggage Bags</span>
            </div>
            <div class="spec-item">
              <i class="icon-gauge"></i>
              <span>${car.fuel}</span>
            </div>
            <div class="spec-item">
              <i class="icon-wifi"></i>
              <span>5G Wi-Fi Onboard</span>
            </div>
          </div>

          <div class="fleet-amenities-list">
            ${car.features.slice(0, 3).map(f => `
              <div class="amenity-item">
                <i class="icon-check-circle"></i>
                <span>${f}</span>
              </div>
            `).join("")}
          </div>

          <div class="fleet-pricing-footer">
            <div class="fleet-price-col">
              <span class="price-prefix">From</span>
              <span class="price-figure">${formatPrice(rate.baseFare, curr)}</span>
              <span class="price-suffix">/ Base</span>
            </div>
            <div class="fleet-rate-badges">
              <span class="rate-tag">${formatPrice(rate.perKm, curr)}/km</span>
              <span class="rate-tag">${formatPrice(rate.hourlyRate, curr)}/hr</span>
            </div>
          </div>

          <div class="fleet-card-actions">
            <button class="btn btn-gold w-full book-car-btn" data-car-id="${car.id}">
              <span>Reserve This Car</span>
              <i class="icon-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Attach button click listeners
  container.querySelectorAll(".book-car-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const carId = btn.dataset.carId;
      bookingEngine.openModal({ carId: carId });
    });
  });

  apply3DTilt();
  initScrollReveal();
}

function initFleetFilterTabs() {
  const tabs = document.querySelectorAll(".fleet-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const category = tab.dataset.category;
      renderFleetGrid(category);
    });
  });
}

function apply3DTilt() {
  const cards = document.querySelectorAll("[data-tilt]");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
}

/* ==========================================================================
   5. LIVE FARE CALCULATOR SECTION
   ========================================================================== */
function initFareCalculatorWidget() {
  const carSelect = document.getElementById("calc-car");
  const typeSelect = document.getElementById("calc-type");
  const distanceRange = document.getElementById("calc-distance-range");
  const distanceNumber = document.getElementById("calc-distance-number");
  const hoursGroup = document.getElementById("calc-hours-group");
  const hoursSelect = document.getElementById("calc-hours");
  const promoInput = document.getElementById("calc-promo-input");
  const promoBtn = document.getElementById("calc-apply-promo");
  const calculateBookBtn = document.getElementById("calc-proceed-booking");

  if (carSelect) {
    carSelect.innerHTML = FLEET_DATA.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  }

  const updateUI = () => {
    const carId = carSelect?.value || FLEET_DATA[0].id;
    const tripType = typeSelect?.value || "one-way";
    const distanceKm = parseFloat(distanceRange?.value) || 25;
    const hours = parseInt(hoursSelect?.value) || 4;
    const promoCode = promoInput?.value || "";
    const curr = getGlobalCurrency();

    if (hoursGroup) {
      hoursGroup.style.display = tripType === "hourly" ? "block" : "none";
    }

    const fare = calculateFareEstimate({
      carId,
      tripType,
      distanceKm,
      hours,
      promoCode,
      currency: curr
    });

    const displayDist = document.getElementById("calc-display-dist");
    const displayBase = document.getElementById("calc-display-base");
    const displayPerKm = document.getElementById("calc-display-perkm");
    const displayTax = document.getElementById("calc-display-tax");
    const displayDiscountRow = document.getElementById("calc-discount-row");
    const displayDiscount = document.getElementById("calc-display-discount");
    const displayGrand = document.getElementById("calc-display-grand");

    if (displayDist) displayDist.textContent = `${distanceKm} KM`;
    if (displayBase) displayBase.textContent = formatPrice(fare.baseRate, curr);
    if (displayPerKm) displayPerKm.textContent = formatPrice(fare.distanceCost + fare.timeCost, curr);
    if (displayTax) displayTax.textContent = formatPrice(fare.taxes, curr);

    if (displayDiscountRow && displayDiscount) {
      if (fare.discountAmount > 0) {
        displayDiscountRow.style.display = "flex";
        displayDiscount.textContent = `-${formatPrice(fare.discountAmount, curr)}`;
      } else {
        displayDiscountRow.style.display = "none";
      }
    }

    if (displayGrand) displayGrand.textContent = formatPrice(fare.grandTotal, curr);
  };

  window.updateCalculatorWidgetUI = updateUI;

  carSelect?.addEventListener("change", updateUI);
  typeSelect?.addEventListener("change", updateUI);

  distanceRange?.addEventListener("input", (e) => {
    if (distanceNumber) distanceNumber.value = e.target.value;
    updateUI();
  });

  distanceNumber?.addEventListener("input", (e) => {
    if (distanceRange) distanceRange.value = e.target.value;
    updateUI();
  });

  hoursSelect?.addEventListener("change", updateUI);

  promoBtn?.addEventListener("click", () => {
    const code = promoInput?.value.trim().toUpperCase();
    if (code && PROMO_CODES[code]) {
      bookingEngine.showToast(`Applied promo ${code}!`, "success");
    } else if (code) {
      bookingEngine.showToast("Invalid Promo Code", "error");
    }
    updateUI();
  });

  calculateBookBtn?.addEventListener("click", () => {
    bookingEngine.openModal({
      carId: carSelect?.value,
      tripType: typeSelect?.value,
      promoCode: promoInput?.value.trim().toUpperCase()
    });
  });

  updateUI();
}

/* ==========================================================================
   6. BOOKING TRACKER
   ========================================================================== */
function initBookingTracker() {
  const form = document.getElementById("track-ride-form");
  const resultContainer = document.getElementById("track-result-container");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const idInput = document.getElementById("track-booking-id");
    const id = idInput?.value.trim().toUpperCase();

    if (!id) {
      bookingEngine.showToast("Please enter your Booking ID (e.g. LC-VIP-78921)", "warning");
      return;
    }

    const bookings = JSON.parse(localStorage.getItem("luxury_cabs_bookings") || "[]");
    let record = bookings.find(b => b.bookingId === id);

    if (!record) {
      record = {
        bookingId: id,
        guestName: "Distinguished VIP Guest",
        guestPhone: "+91 98*** *****",
        tripType: "airport",
        pickupLocation: "Terminal 3 VIP Lounge, IGI Airport",
        dropLocation: "The Oberoi / Taj Palace Suite",
        pickupDate: "Today",
        pickupTime: "Immediate",
        carId: "mercedes-s-class",
        status: "Chauffeur En Route",
        chauffeur: {
          name: "Vikramaditya S.",
          experience: "12 Years VIP Certified",
          carPlate: "DL 01 VIP 0007",
          carModel: "Mercedes-Maybach S580 (Midnight Black)",
          contact: "+91 91363 97629"
        }
      };
    }

    const carObj = FLEET_DATA.find(c => c.id === record.carId) || FLEET_DATA[0];

    resultContainer.innerHTML = `
      <div class="tracking-card">
        <div class="tracking-top-bar">
          <div class="track-id-badge">
            <span class="track-label">BOOKING REFERENCE</span>
            <h3>${record.bookingId}</h3>
          </div>
          <div class="track-status-pill status-live">
            <span class="live-dot"></span> ${record.status || "Chauffeur Assigned"}
          </div>
        </div>

        <div class="tracking-timeline">
          <div class="timeline-step completed">
            <div class="timeline-dot"><i class="icon-check"></i></div>
            <div class="timeline-text">
              <h5>Booking Confirmed</h5>
              <p>Trip registered in system</p>
            </div>
          </div>
          <div class="timeline-step completed">
            <div class="timeline-dot"><i class="icon-check"></i></div>
            <div class="timeline-text">
              <h5>Chauffeur Allocated</h5>
              <p>Uniformed luxury chauffeur</p>
            </div>
          </div>
          <div class="timeline-step active">
            <div class="timeline-dot"><i class="icon-car"></i></div>
            <div class="timeline-text">
              <h5>Vehicle En Route</h5>
              <p>Arrival: ~10 minutes</p>
            </div>
          </div>
          <div class="timeline-step">
            <div class="timeline-dot"><i class="icon-flag"></i></div>
            <div class="timeline-text">
              <h5>Trip in Progress</h5>
              <p>Executive transfer</p>
            </div>
          </div>
        </div>

        <div class="tracking-details-grid">
          <div class="track-chauffeur-box">
            <div class="chauffeur-avatar">
              <i class="icon-user"></i>
            </div>
            <div class="chauffeur-meta">
              <h4>${record.chauffeur ? record.chauffeur.name : "Arjun Rathore (VIP Certified)"}</h4>
              <p class="ch-exp"><i class="icon-award"></i> 10+ Yrs Elite Protocol Experience</p>
              <p class="ch-car"><i class="icon-shield"></i> Vehicle: <strong>${carObj.name}</strong></p>
              <p class="ch-plate">Reg No: <strong>DL 1C AA 0001</strong></p>
            </div>
          </div>

          <div class="track-route-box">
            <div class="route-item">
              <span class="route-dot start"></span>
              <div>
                <small>Pickup Point</small>
                <strong>${record.pickupLocation}</strong>
              </div>
            </div>
            <div class="route-line"></div>
            <div class="route-item">
              <span class="route-dot end"></span>
              <div>
                <small>Destination</small>
                <strong>${record.dropLocation || "As Directed (Hourly Chauffeur)"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="tracking-actions">
          <a href="tel:+919136397629" class="btn btn-gold">
            <i class="icon-phone"></i> Call VIP Chauffeur
          </a>
          <a href="https://wa.me/919136397629?text=Inquiry%20regarding%20booking%20${record.bookingId}" target="_blank" class="btn btn-whatsapp">
            <i class="icon-whatsapp"></i> WhatsApp Concierge
          </a>
        </div>
      </div>
    `;

    resultContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

/* ==========================================================================
   7. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    question?.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      faqItems.forEach(f => f.classList.remove("open"));
      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });
}

/* ==========================================================================
   8. TESTIMONIALS SLIDER WITH TOUCH SWIPE
   ========================================================================== */
function initTestimonialsSlider() {
  const slider = document.querySelector(".testimonials-track");
  const prevBtn = document.getElementById("test-prev");
  const nextBtn = document.getElementById("test-next");

  if (!slider) return;

  let currentIndex = 0;
  const cards = document.querySelectorAll(".testimonial-card");
  const total = cards.length;

  const updateSlide = () => {
    if (window.innerWidth <= 768) {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    } else {
      slider.style.transform = `translateX(-${currentIndex * 50}%)`;
    }
  };

  nextBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % (window.innerWidth <= 768 ? total : Math.max(1, total - 1));
    updateSlide();
  });

  prevBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + (window.innerWidth <= 768 ? total : Math.max(1, total - 1))) % (window.innerWidth <= 768 ? total : Math.max(1, total - 1));
    updateSlide();
  });

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      // Swipe left -> Next
      currentIndex = (currentIndex + 1) % (window.innerWidth <= 768 ? total : Math.max(1, total - 1));
      updateSlide();
    } else if (touchEndX - touchStartX > 50) {
      // Swipe right -> Prev
      currentIndex = (currentIndex - 1 + (window.innerWidth <= 768 ? total : Math.max(1, total - 1))) % (window.innerWidth <= 768 ? total : Math.max(1, total - 1));
      updateSlide();
    }
  }, { passive: true });

  // Auto slide every 7 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % (window.innerWidth <= 768 ? total : Math.max(1, total - 1));
    updateSlide();
  }, 7000);
}

/* ==========================================================================
   9. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal-on-scroll, .reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-scale");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   10. HERO GOLDEN STARDUST PARTICLES CANVAS
   ========================================================================== */
function initHeroGoldenParticles() {
  const canvas = document.getElementById("hero-particles-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];

  const resize = () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  };

  window.addEventListener("resize", resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.fade = Math.random() * 0.006 + 0.002;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity -= this.fade;

      if (this.opacity <= 0 || this.y < 0) {
        this.reset();
        this.y = height + 5;
        this.opacity = Math.random() * 0.6 + 0.2;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(212, 175, 55, 0.8)";
      ctx.fill();
    }
  }

  // Create 35 floating luxury golden particles
  const count = window.innerWidth <= 768 ? 20 : 40;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   11. STATS NUMBER COUNT-UP ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const stats = document.querySelectorAll(".stat-number");
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach(stat => {
          const target = parseInt(stat.dataset.target) || 0;
          let current = 0;
          const duration = 1800; // ms
          const steps = 40;
          const stepValue = target / steps;
          const stepTime = duration / steps;

          const timer = setInterval(() => {
            current += stepValue;
            if (current >= target) {
              stat.textContent = target.toLocaleString() + (stat.dataset.suffix || "");
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(current).toLocaleString() + (stat.dataset.suffix || "");
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.4 });

  const section = document.querySelector(".luxury-stats-section");
  if (section) observer.observe(section);
}

/* ==========================================================================
   12. SMOOTH SCROLL
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
