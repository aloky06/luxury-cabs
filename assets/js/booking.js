/**
 * Luxury Cabs - Booking Flow & State Controller
 */

class BookingEngine {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.bookingData = {
      tripType: "one-way",
      pickupLocation: "",
      dropLocation: "",
      pickupDate: "",
      pickupTime: "",
      returnDate: "",
      passengers: 2,
      luggage: 2,
      hours: 4,
      carId: "mercedes-s-class",
      selectedAddons: [],
      promoCode: "",
      flightNumber: "",
      guestName: "",
      guestPhone: "",
      guestEmail: "",
      specialRequests: "",
      paymentMethod: "pay_at_ride", // or "card", "crypto"
      bookingId: null,
      createdAt: null,
      status: "Confirmed"
    };

    this.init();
  }

  init() {
    this.setDefaultDates();
    this.bindEvents();
    this.renderAddonsStep();
  }

  setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pad = (n) => String(n).padStart(2, '0');
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const tmrwStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

    this.bookingData.pickupDate = todayStr;
    this.bookingData.returnDate = tmrwStr;
    this.bookingData.pickupTime = "14:00";
  }

  bindEvents() {
    // Trip Type toggle buttons in modal
    const tripBtns = document.querySelectorAll(".modal-trip-btn");
    tripBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        tripBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.bookingData.tripType = btn.dataset.type;
        this.handleTripTypeChange(btn.dataset.type);
        this.updateFareSummary();
      });
    });

    // Step navigation buttons
    const nextBtn = document.getElementById("booking-next-btn");
    const prevBtn = document.getElementById("booking-prev-btn");
    if (nextBtn) nextBtn.addEventListener("click", () => this.nextStep());
    if (prevBtn) prevBtn.addEventListener("click", () => this.prevStep());

    // Promo code apply in modal
    const applyPromoBtn = document.getElementById("modal-apply-promo");
    if (applyPromoBtn) {
      applyPromoBtn.addEventListener("click", () => {
        const codeInput = document.getElementById("modal-promo-input");
        const code = codeInput ? codeInput.value.trim().toUpperCase() : "";
        if (code && PROMO_CODES[code]) {
          this.bookingData.promoCode = code;
          this.showToast(`Promo ${code} applied successfully!`, "success");
        } else if (code) {
          this.showToast("Invalid or expired coupon code", "error");
        } else {
          this.bookingData.promoCode = "";
        }
        this.updateFareSummary();
      });
    }

    // Modal Close buttons
    const closeBtns = document.querySelectorAll(".close-booking-modal");
    closeBtns.forEach(b => b.addEventListener("click", () => this.closeModal()));

    // Outside click close
    const modalOverlay = document.getElementById("booking-modal-overlay");
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) this.closeModal();
      });
    }
  }

  handleTripTypeChange(type) {
    const returnDateField = document.getElementById("modal-return-date-wrap");
    const hourlyHoursField = document.getElementById("modal-hours-wrap");
    const dropFieldWrap = document.getElementById("modal-drop-wrap");
    const flightFieldWrap = document.getElementById("modal-flight-wrap");

    if (returnDateField) returnDateField.style.display = type === "round-trip" ? "block" : "none";
    if (hourlyHoursField) hourlyHoursField.style.display = type === "hourly" ? "block" : "none";
    if (dropFieldWrap) dropFieldWrap.style.display = type === "hourly" ? "none" : "block";
    if (flightFieldWrap) flightFieldWrap.style.display = type === "airport" ? "block" : "none";
  }

  openModal(prefill = {}) {
    // Merge prefill data
    Object.assign(this.bookingData, prefill);

    const modal = document.getElementById("booking-modal-overlay");
    if (!modal) return;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Set form fields
    const pickupEl = document.getElementById("modal-pickup");
    const dropEl = document.getElementById("modal-drop");
    const dateEl = document.getElementById("modal-date");
    const timeEl = document.getElementById("modal-time");
    const passengersEl = document.getElementById("modal-passengers");
    const luggageEl = document.getElementById("modal-luggage");
    const hoursEl = document.getElementById("modal-hours");

    if (pickupEl && this.bookingData.pickupLocation) pickupEl.value = this.bookingData.pickupLocation;
    if (dropEl && this.bookingData.dropLocation) dropEl.value = this.bookingData.dropLocation;
    if (dateEl && this.bookingData.pickupDate) dateEl.value = this.bookingData.pickupDate;
    if (timeEl && this.bookingData.pickupTime) timeEl.value = this.bookingData.pickupTime;
    if (passengersEl) passengersEl.value = this.bookingData.passengers || 2;
    if (luggageEl) luggageEl.value = this.bookingData.luggage || 2;
    if (hoursEl) hoursEl.value = this.bookingData.hours || 4;

    // Set trip type buttons
    const tripBtns = document.querySelectorAll(".modal-trip-btn");
    tripBtns.forEach(b => {
      b.classList.toggle("active", b.dataset.type === (this.bookingData.tripType || "one-way"));
    });
    this.handleTripTypeChange(this.bookingData.tripType || "one-way");

    // Start at Step 1 or Step 2 if car was directly selected
    this.goToStep(prefill.carId ? 2 : 1);
    this.renderFleetSelectionStep();
    this.updateFareSummary();
  }

  closeModal() {
    const modal = document.getElementById("booking-modal-overlay");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  goToStep(step) {
    this.currentStep = step;

    // Update Step Indicators
    const indicators = document.querySelectorAll(".wizard-step-item");
    indicators.forEach(ind => {
      const s = parseInt(ind.dataset.step);
      ind.classList.toggle("active", s === step);
      ind.classList.toggle("completed", s < step);
    });

    // Update Step Content Visibility
    for (let i = 1; i <= this.totalSteps; i++) {
      const stepContent = document.getElementById(`wizard-step-${i}`);
      if (stepContent) {
        stepContent.classList.toggle("active", i === step);
      }
    }

    // Update Footer Buttons
    const prevBtn = document.getElementById("booking-prev-btn");
    const nextBtn = document.getElementById("booking-next-btn");

    if (prevBtn) {
      prevBtn.style.display = (step === 1 || step === 5) ? "none" : "inline-flex";
    }

    if (nextBtn) {
      if (step === 5) {
        nextBtn.style.display = "none";
      } else if (step === 4) {
        nextBtn.style.display = "inline-flex";
        nextBtn.innerHTML = `<span>Confirm & Reserve Ride</span> <i class="icon-sparkle"></i>`;
      } else {
        nextBtn.style.display = "inline-flex";
        nextBtn.innerHTML = `<span>Continue</span> <i class="icon-arrow-right"></i>`;
      }
    }

    if (step === 2) this.renderFleetSelectionStep();
    if (step === 3) this.renderAddonsStep();
    if (step === 5) this.renderConfirmationStep();

    this.updateFareSummary();
  }

  nextStep() {
    if (this.currentStep === 1) {
      // Validate Step 1
      const pickupEl = document.getElementById("modal-pickup");
      const dropEl = document.getElementById("modal-drop");
      const dateEl = document.getElementById("modal-date");
      const timeEl = document.getElementById("modal-time");

      if (!pickupEl || !pickupEl.value.trim()) {
        this.showToast("Please enter a pickup location", "warning");
        pickupEl?.focus();
        return;
      }

      if (this.bookingData.tripType !== "hourly" && (!dropEl || !dropEl.value.trim())) {
        this.showToast("Please enter a destination / drop location", "warning");
        dropEl?.focus();
        return;
      }

      this.bookingData.pickupLocation = pickupEl.value.trim();
      this.bookingData.dropLocation = dropEl ? dropEl.value.trim() : "";
      this.bookingData.pickupDate = dateEl?.value || this.bookingData.pickupDate;
      this.bookingData.pickupTime = timeEl?.value || this.bookingData.pickupTime;
      this.bookingData.passengers = parseInt(document.getElementById("modal-passengers")?.value) || 2;
      this.bookingData.luggage = parseInt(document.getElementById("modal-luggage")?.value) || 2;
      this.bookingData.hours = parseInt(document.getElementById("modal-hours")?.value) || 4;
      this.bookingData.flightNumber = document.getElementById("modal-flight")?.value || "";

      this.goToStep(2);
    } else if (this.currentStep === 2) {
      if (!this.bookingData.carId) {
        this.showToast("Please select a luxury vehicle from our fleet", "warning");
        return;
      }
      this.goToStep(3);
    } else if (this.currentStep === 3) {
      this.goToStep(4);
    } else if (this.currentStep === 4) {
      // Validate Guest Info
      const nameEl = document.getElementById("modal-guest-name");
      const phoneEl = document.getElementById("modal-guest-phone");
      const emailEl = document.getElementById("modal-guest-email");
      const reqEl = document.getElementById("modal-special-requests");

      if (!nameEl || !nameEl.value.trim()) {
        this.showToast("Please provide the primary passenger's full name", "warning");
        nameEl?.focus();
        return;
      }

      if (!phoneEl || phoneEl.value.trim().length < 8) {
        this.showToast("Please provide a valid contact phone number with country code", "warning");
        phoneEl?.focus();
        return;
      }

      this.bookingData.guestName = nameEl.value.trim();
      this.bookingData.guestPhone = phoneEl.value.trim();
      this.bookingData.guestEmail = emailEl ? emailEl.value.trim() : "";
      this.bookingData.specialRequests = reqEl ? reqEl.value.trim() : "";

      // Finalize booking
      this.finalizeBooking();
      this.goToStep(5);
    }
  }

  prevStep() {
    if (this.currentStep > 1 && this.currentStep < 5) {
      this.goToStep(this.currentStep - 1);
    }
  }

  renderFleetSelectionStep() {
    const container = document.getElementById("modal-fleet-list");
    if (!container) return;

    const curr = getGlobalCurrency();
    container.innerHTML = FLEET_DATA.map(car => {
      const isSelected = car.id === this.bookingData.carId;
      const rate = car.rates[curr] || car.rates.INR;
      return `
        <div class="modal-car-card ${isSelected ? 'selected' : ''}" data-car-id="${car.id}">
          <div class="modal-car-img-wrap">
            <img src="${car.image}" alt="${car.name}" loading="lazy">
            <span class="modal-car-badge">${car.badge}</span>
          </div>
          <div class="modal-car-info">
            <div class="modal-car-header">
              <h4 class="modal-car-title">${car.name}</h4>
              <div class="modal-car-price">
                <span class="price-val">${formatPrice(rate.baseFare, curr)}</span>
                <span class="price-unit">Base Fare</span>
              </div>
            </div>
            <p class="modal-car-tagline">${car.tagline}</p>
            <div class="modal-car-specs">
              <span><i class="icon-users"></i> ${car.passengers} Guests</span>
              <span><i class="icon-briefcase"></i> ${car.luggage} Bags</span>
              <span><i class="icon-zap"></i> ${formatPrice(rate.perKm, curr)}/km</span>
              <span><i class="icon-clock"></i> ${formatPrice(rate.hourlyRate, curr)}/hr</span>
            </div>
          </div>
          <div class="modal-car-select-radio">
            <div class="custom-radio ${isSelected ? 'checked' : ''}"></div>
          </div>
        </div>
      `;
    }).join("");

    // Bind click events
    container.querySelectorAll(".modal-car-card").forEach(card => {
      card.addEventListener("click", () => {
        const carId = card.dataset.carId;
        this.bookingData.carId = carId;
        container.querySelectorAll(".modal-car-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        this.updateFareSummary();
      });
    });
  }

  renderAddonsStep() {
    const container = document.getElementById("modal-addons-list");
    if (!container) return;

    const curr = getGlobalCurrency();
    container.innerHTML = VIP_ADDONS.map(addon => {
      const isChecked = this.bookingData.selectedAddons.includes(addon.id);
      const price = addon.price[curr] || addon.price.INR;
      return `
        <label class="modal-addon-item ${isChecked ? 'active' : ''}">
          <input type="checkbox" class="addon-checkbox" value="${addon.id}" ${isChecked ? 'checked' : ''}>
          <div class="addon-check-box"><i class="icon-check"></i></div>
          <div class="addon-details">
            <div class="addon-name-row">
              <span class="addon-title">${addon.name}</span>
              <span class="addon-price">+${formatPrice(price, curr)}</span>
            </div>
            <p class="addon-desc">${addon.desc}</p>
          </div>
        </label>
      `;
    }).join("");

    container.querySelectorAll(".addon-checkbox").forEach(chk => {
      chk.addEventListener("change", (e) => {
        const val = e.target.value;
        const parent = e.target.closest(".modal-addon-item");
        if (e.target.checked) {
          if (!this.bookingData.selectedAddons.includes(val)) this.bookingData.selectedAddons.push(val);
          parent?.classList.add("active");
        } else {
          this.bookingData.selectedAddons = this.bookingData.selectedAddons.filter(id => id !== val);
          parent?.classList.remove("active");
        }
        this.updateFareSummary();
      });
    });
  }

  updateFareSummary() {
    const distance = estimateDistance(this.bookingData.pickupLocation, this.bookingData.dropLocation);
    const curr = getGlobalCurrency();

    const fare = calculateFareEstimate({
      carId: this.bookingData.carId,
      tripType: this.bookingData.tripType,
      distanceKm: distance,
      hours: this.bookingData.hours,
      selectedAddons: this.bookingData.selectedAddons,
      promoCode: this.bookingData.promoCode,
      currency: curr
    });

    // Update Summary elements in modal sidebar / bar
    const selectedCarNameEl = document.getElementById("summary-car-name");
    const tripTypeEl = document.getElementById("summary-trip-type");
    const distanceEl = document.getElementById("summary-distance");
    const subtotalEl = document.getElementById("summary-subtotal");
    const taxesEl = document.getElementById("summary-taxes");
    const discountRow = document.getElementById("summary-discount-row");
    const discountEl = document.getElementById("summary-discount");
    const grandTotalEl = document.getElementById("summary-grand-total");

    if (selectedCarNameEl) selectedCarNameEl.textContent = fare.car.name;
    if (tripTypeEl) tripTypeEl.textContent = fare.tripType.toUpperCase().replace("-", " ");
    if (distanceEl) distanceEl.textContent = `${distance} KM (Est.)`;
    if (subtotalEl) subtotalEl.textContent = formatPrice(fare.subtotal, curr);
    if (taxesEl) taxesEl.textContent = formatPrice(fare.taxes, curr);

    if (discountRow && discountEl) {
      if (fare.discountAmount > 0) {
        discountRow.style.display = "flex";
        discountEl.textContent = `-${formatPrice(fare.discountAmount, curr)}`;
      } else {
        discountRow.style.display = "none";
      }
    }

    if (grandTotalEl) grandTotalEl.textContent = formatPrice(fare.grandTotal, curr);
    this.latestFareEstimate = fare;
  }

  finalizeBooking() {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    this.bookingData.bookingId = `LC-VIP-${randomNum}`;
    this.bookingData.createdAt = new Date().toISOString();
    this.bookingData.finalFare = this.latestFareEstimate;

    // Save to localStorage list
    const existing = JSON.parse(localStorage.getItem("luxury_cabs_bookings") || "[]");
    existing.unshift(this.bookingData);
    localStorage.setItem("luxury_cabs_bookings", JSON.stringify(existing));
  }

  renderConfirmationStep() {
    const container = document.getElementById("wizard-step-5");
    if (!container) return;

    const data = this.bookingData;
    const fare = this.latestFareEstimate;
    const curr = getGlobalCurrency();

    // Prepare WhatsApp Link
    const waText = encodeURIComponent(
      `*🌟 NEW LUXURY CABS RESERVATION: ${data.bookingId}*\n\n` +
      `*Guest:* ${data.guestName} (${data.guestPhone})\n` +
      `*Vehicle:* ${fare.car.name}\n` +
      `*Service:* ${data.tripType.toUpperCase()}\n` +
      `*Pickup:* ${data.pickupLocation}\n` +
      `*Destination:* ${data.dropLocation || 'As directed / Hourly'}\n` +
      `*Date & Time:* ${data.pickupDate} at ${data.pickupTime}\n` +
      `*Est. Total:* ${formatPrice(fare.grandTotal, curr)}\n\n` +
      `_Please confirm chauffeur dispatch._`
    );
    const whatsappUrl = `https://wa.me/919136397629?text=${waText}`;

    container.innerHTML = `
      <div class="confirmation-card">
        <div class="conf-success-icon">
          <i class="icon-shield-check"></i>
        </div>
        <h3 class="conf-title">Reservation Confirmed!</h3>
        <p class="conf-subtitle">Thank you, <strong>${data.guestName}</strong>. Your luxury chauffeur has been assigned and scheduled.</p>

        <div class="booking-voucher" id="printable-voucher">
          <div class="voucher-header">
            <div class="voucher-brand">
              <img src="assets/images/logo.png" alt="Luxury Cabs Logo" class="voucher-logo">
              <div>
                <h4>LUXURY CABS</h4>
                <p>VIP Chauffeur & Limousine Services</p>
              </div>
            </div>
            <div class="voucher-badge">
              <span class="voucher-id-label">BOOKING ID</span>
              <span class="voucher-id-value">${data.bookingId}</span>
            </div>
          </div>

          <div class="voucher-grid">
            <div class="voucher-col">
              <span class="v-label">Vehicle Reserved</span>
              <span class="v-value gold">${fare.car.name}</span>
            </div>
            <div class="voucher-col">
              <span class="v-label">Service Type</span>
              <span class="v-value">${data.tripType.toUpperCase().replace("-", " ")}</span>
            </div>
            <div class="voucher-col">
              <span class="v-label">Pickup Schedule</span>
              <span class="v-value">${data.pickupDate} | ${data.pickupTime}</span>
            </div>
            <div class="voucher-col">
              <span class="v-label">Chauffeur Status</span>
              <span class="v-value status-active"><i class="icon-circle"></i> Assigned (VIP Certified)</span>
            </div>
            <div class="voucher-col full">
              <span class="v-label">Pickup Address</span>
              <span class="v-value">${data.pickupLocation}</span>
            </div>
            ${data.dropLocation ? `
              <div class="voucher-col full">
                <span class="v-label">Drop Address</span>
                <span class="v-value">${data.dropLocation}</span>
              </div>
            ` : ''}
            <div class="voucher-col">
              <span class="v-label">Primary Passenger</span>
              <span class="v-value">${data.guestName} (${data.guestPhone})</span>
            </div>
            <div class="voucher-col">
              <span class="v-label">Total Estimated Fare</span>
              <span class="v-value fare-large">${formatPrice(fare.grandTotal, curr)} <small>(Taxes & Perks Included)</small></span>
            </div>
          </div>

          <div class="voucher-perks">
            <span>✓ Complimentary 5G Wi-Fi</span>
            <span>✓ Premium Bottled Water</span>
            <span>✓ Sanitized & Perfumed Cabin</span>
            <span>✓ 24/7 VIP Concierge</span>
          </div>
        </div>

        <div class="conf-actions-row">
          <a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp">
            <i class="icon-whatsapp"></i> Instant WhatsApp Dispatch
          </a>
          <button class="btn btn-gold-outline" onclick="window.print()">
            <i class="icon-printer"></i> Print / Save Itinerary
          </button>
          <button class="btn btn-dark" onclick="bookingEngine.closeModal()">
            Done & Return
          </button>
        </div>
      </div>
    `;
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `luxury-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="toast-icon ${type === 'success' ? 'icon-check' : type === 'warning' ? 'icon-alert' : 'icon-info'}"></i>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
}

let bookingEngine;
document.addEventListener("DOMContentLoaded", () => {
  bookingEngine = new BookingEngine();
});
