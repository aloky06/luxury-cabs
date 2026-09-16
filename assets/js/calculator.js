/**
 * Luxury Cabs - Fare & Distance Calculation Engine
 */

const PROMO_CODES = {
  "LUXURYFIRST": { type: "percent", value: 15, label: "15% Welcome VIP Discount" },
  "VIPROYAL": { type: "flat", INR: 2500, USD: 30, AED: 110, label: "Royal Prestige Flat Voucher" },
  "AIRPORT500": { type: "flat", INR: 500, USD: 7, AED: 25, label: "Airport VIP Transfer Perk" },
  "CHAUFFEUR10": { type: "percent", value: 10, label: "10% Executive Chauffeur Discount" }
};

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  AED: "AED "
};

let currentCurrency = localStorage.getItem("luxury_currency") || "INR";

function setGlobalCurrency(curr) {
  if (CURRENCY_SYMBOLS[curr]) {
    currentCurrency = curr;
    localStorage.setItem("luxury_currency", curr);
    document.dispatchEvent(new CustomEvent("currencyChanged", { detail: { currency: curr } }));
  }
}

function getGlobalCurrency() {
  return currentCurrency;
}

function formatPrice(amount, currency = currentCurrency) {
  const sym = CURRENCY_SYMBOLS[currency] || "₹";
  const num = Math.round(amount);
  if (currency === "INR") {
    return `${sym}${num.toLocaleString("en-IN")}`;
  }
  return `${sym}${num.toLocaleString("en-US")}`;
}

/**
 * Calculate detailed fare estimate
 * @param {Object} params - Booking parameters
 * @returns {Object} detailed breakdown
 */
function calculateFareEstimate({
  carId,
  tripType = "one-way", // "one-way", "round-trip", "airport", "hourly"
  distanceKm = 25,
  hours = 4,
  selectedAddons = [],
  promoCode = "",
  currency = currentCurrency
}) {
  const car = FLEET_DATA.find(c => c.id === carId) || FLEET_DATA[0];
  const rates = car.rates[currency] || car.rates.INR;

  let baseRate = 0;
  let distanceCost = 0;
  let timeCost = 0;

  if (tripType === "hourly") {
    const billableHours = Math.max(hours, rates.minHours);
    timeCost = billableHours * rates.hourlyRate;
    baseRate = rates.baseFare * 0.5; // discounted base for hourly
    // Included 10 km per hour free, charge extra if high distance
    const freeKm = billableHours * 10;
    if (distanceKm > freeKm) {
      distanceCost = (distanceKm - freeKm) * rates.perKm;
    }
  } else if (tripType === "round-trip") {
    const totalKm = distanceKm * 2;
    distanceCost = totalKm * rates.perKm * 0.9; // 10% round trip discount on per km
    baseRate = rates.baseFare * 1.5;
  } else if (tripType === "airport") {
    baseRate = rates.baseFare;
    distanceCost = distanceKm * rates.perKm;
    // Airport VIP parking/toll inclusion
    baseRate += (currency === "INR" ? 300 : currency === "AED" ? 15 : 4);
  } else {
    // Standard One-Way
    baseRate = rates.baseFare;
    distanceCost = distanceKm * rates.perKm;
  }

  // Addons total
  let addonsTotal = 0;
  selectedAddons.forEach(addonId => {
    const addon = VIP_ADDONS.find(a => a.id === addonId);
    if (addon) {
      addonsTotal += (addon.price[currency] || addon.price.INR);
    }
  });

  const subtotal = baseRate + distanceCost + timeCost + addonsTotal;

  // Taxes & Surcharges (5% VIP Service & Road Tax)
  const taxes = subtotal * 0.05;

  let discountAmount = 0;
  let appliedPromo = null;
  const cleanCode = (promoCode || "").trim().toUpperCase();

  if (cleanCode && PROMO_CODES[cleanCode]) {
    appliedPromo = PROMO_CODES[cleanCode];
    if (appliedPromo.type === "percent") {
      discountAmount = (subtotal * appliedPromo.value) / 100;
    } else if (appliedPromo.type === "flat") {
      discountAmount = appliedPromo[currency] || appliedPromo.INR;
    }
    // Cap discount
    discountAmount = Math.min(discountAmount, subtotal * 0.5);
  }

  const grandTotal = Math.max(0, subtotal + taxes - discountAmount);

  return {
    car,
    currency,
    tripType,
    distanceKm,
    hours,
    baseRate,
    distanceCost,
    timeCost,
    addonsTotal,
    subtotal,
    taxes,
    discountAmount,
    appliedPromo,
    grandTotal: Math.round(grandTotal)
  };
}

/**
 * Estimate road distance between locations based on text or airport defaults
 */
function estimateDistance(fromText, toText) {
  const f = (fromText || "").toLowerCase();
  const t = (toText || "").toLowerCase();

  // Check known popular routes
  for (const r of POPULAR_ROUTES) {
    if (
      (f.includes("delhi") && t.includes("agra")) ||
      (f.includes("agra") && t.includes("delhi"))
    ) return 230;
    if (
      (f.includes("delhi") && t.includes("jaipur")) ||
      (f.includes("jaipur") && t.includes("delhi"))
    ) return 270;
    if (f.includes("delhi") && t.includes("airport")) return 22;
    if (f.includes("mumbai") && t.includes("airport")) return 28;
    if (f.includes("dubai") && t.includes("airport")) return 18;
  }

  // General heuristics based on word counts / characters if random input
  if (!f || !t) return 25;
  const hash = Math.abs((f + t).split("").reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0));
  return 15 + (hash % 45); // generates 15km to 60km realistic city distance
}
