/**
 * Luxury Cabs - Fleet Data & Specifications
 */

const FLEET_DATA = [
  {
    id: "mercedes-s-class",
    name: "Mercedes-Benz S-Class 580 Maybach",
    category: "sedan",
    tagline: "The Pinnacle of Chauffeur-Driven Luxury",
    image: "assets/images/mercedes_s_class.jpg",
    badge: "Most Popular VIP",
    passengers: 3,
    luggage: 3,
    transmission: "Automatic",
    fuel: "Hybrid / Petrol",
    rating: 4.98,
    reviewsCount: 342,
    rates: {
      INR: { perKm: 95, baseFare: 3500, hourlyRate: 2200, minHours: 4 },
      USD: { perKm: 1.25, baseFare: 45, hourlyRate: 30, minHours: 4 },
      AED: { perKm: 4.5, baseFare: 160, hourlyRate: 110, minHours: 4 }
    },
    features: [
      "Executive Nappa Leather Reclining Seats",
      "Burmester® 4D Surround Sound System",
      "Active Road Noise Cancellation & Acoustic Glass",
      "Chilled Champagne Cooler & Refreshment Console",
      "High-speed Onboard 5G Wi-Fi & Tablet Controls",
      "Uniformed English/Bilingual Professional Chauffeur"
    ],
    idealFor: "Corporate C-Suite, Airport VIP Transfers, High-End Dinners"
  },
  {
    id: "rolls-royce-ghost",
    name: "Rolls-Royce Ghost Series II Extended",
    category: "royal",
    tagline: "Unrivaled Prestige and Pure Regal Grandeur",
    image: "assets/images/rolls_royce_ghost.jpg",
    badge: "Ultra Luxury",
    passengers: 3,
    luggage: 4,
    transmission: "Automatic",
    fuel: "6.75L Twin-Turbo V12",
    rating: 5.0,
    reviewsCount: 189,
    rates: {
      INR: { perKm: 320, baseFare: 15000, hourlyRate: 8500, minHours: 4 },
      USD: { perKm: 4.2, baseFare: 190, hourlyRate: 110, minHours: 4 },
      AED: { perKm: 15.5, baseFare: 700, hourlyRate: 400, minHours: 4 }
    },
    features: [
      "Starlight Headliner with Fiber-Optic Constellations",
      "Handcrafted Bespoke Wood & Lambswool Carpets",
      "Effortless Power-Assisted Coach Doors",
      "Chilled Crystal Decanter & Flute Glassware",
      "Presidential Privacy Curtains & Acoustic Shield",
      "Top-Tier Protocol Trained Master Chauffeur"
    ],
    idealFor: "Royal Weddings, Celebrity Arrivals, Diplomatic Travel, Red Carpet"
  },
  {
    id: "bmw-7-series",
    name: "BMW 7-Series 740Li Executive",
    category: "sedan",
    tagline: "Futuristic Luxury meets Executive Dynamics",
    image: "assets/images/bmw_7_series.jpg",
    badge: "Executive Choice",
    passengers: 3,
    luggage: 3,
    transmission: "Automatic",
    fuel: "TwinPower Turbo Petrol",
    rating: 4.95,
    reviewsCount: 278,
    rates: {
      INR: { perKm: 85, baseFare: 3000, hourlyRate: 1900, minHours: 4 },
      USD: { perKm: 1.1, baseFare: 40, hourlyRate: 25, minHours: 4 },
      AED: { perKm: 4.0, baseFare: 145, hourlyRate: 95, minHours: 4 }
    },
    features: [
      "31.3-inch 8K BMW Theatre Display in Rear Cabin",
      "Panoramic Sky Lounge LED Glass Roof",
      "Executive Lounge Seating with Massage Function",
      "Ambient Lighting with Dynamic Interaction Bar",
      "High-speed 5G Wi-Fi Hotspot & USB-C Superchargers",
      "Discreet, Vetted Executive Chauffeur"
    ],
    idealFor: "Business Summits, Airport Pickups, Roadshows"
  },
  {
    id: "range-rover-vogue",
    name: "Range Rover Autobiography LWB",
    category: "suv",
    tagline: "Commanding Presence & First-Class Comfort",
    image: "assets/images/range_rover_vogue.jpg",
    badge: "Luxury SUV",
    passengers: 4,
    luggage: 5,
    transmission: "All-Wheel Drive",
    fuel: "Mild Hybrid Petrol",
    rating: 4.97,
    reviewsCount: 220,
    rates: {
      INR: { perKm: 110, baseFare: 4200, hourlyRate: 2600, minHours: 4 },
      USD: { perKm: 1.45, baseFare: 55, hourlyRate: 35, minHours: 4 },
      AED: { perKm: 5.2, baseFare: 200, hourlyRate: 130, minHours: 4 }
    },
    features: [
      "Executive Class Rear Airline Style Seating",
      "Meridian™ Signature Sound with Headrest Speakers",
      "Active Air Suspension for Velvet-Smooth Rides",
      "Massive Luggage Space for Long Distance Trips",
      "All-Terrain Superior Comfort in All Weather",
      "Experienced Senior Route Specialist Chauffeur"
    ],
    idealFor: "Outstation Luxury Trips, VIP Family Travel, Airport with Luggage"
  },
  {
    id: "mercedes-v-class",
    name: "Mercedes-Benz V-Class VIP Lounge",
    category: "van",
    tagline: "Private Jet Cabin on Four Wheels",
    image: "assets/images/mercedes_v_class.jpg",
    badge: "Group VIP Lounge",
    passengers: 6,
    luggage: 8,
    transmission: "Automatic",
    fuel: "Diesel Clean Eco",
    rating: 4.96,
    reviewsCount: 165,
    rates: {
      INR: { perKm: 120, baseFare: 4800, hourlyRate: 2800, minHours: 4 },
      USD: { perKm: 1.6, baseFare: 65, hourlyRate: 40, minHours: 4 },
      AED: { perKm: 5.8, baseFare: 230, hourlyRate: 145, minHours: 4 }
    },
    features: [
      "Face-to-Face Conference Lounge Leather Captain Seats",
      "Foldable Executive Workstations with Ambient Lights",
      "Private Partition with 40-inch Smart LED TV",
      "Mini Refrigerator & Espresso Machine onboard",
      "Extra Large Luggage Boot for Golf Bags & Suitcases",
      "Dedicated Group Chauffeur and Protocol Assistance"
    ],
    idealFor: "Executive Delegations, Luxury Family Tours, Airport Group Transfer"
  },
  {
    id: "bentley-flying-spur",
    name: "Bentley Flying Spur Royal Edition",
    category: "royal",
    tagline: "Handcrafted British Opulence & Effortless Power",
    image: "assets/images/bentley_flying_spur.jpg",
    badge: "Royal Special",
    passengers: 3,
    luggage: 4,
    transmission: "All-Wheel Drive",
    fuel: "4.0L Twin-Turbo V8",
    rating: 4.99,
    reviewsCount: 142,
    rates: {
      INR: { perKm: 260, baseFare: 12000, hourlyRate: 6500, minHours: 4 },
      USD: { perKm: 3.4, baseFare: 155, hourlyRate: 85, minHours: 4 },
      AED: { perKm: 12.5, baseFare: 570, hourlyRate: 310, minHours: 4 }
    },
    features: [
      "Three-Dimensional Diamond Quilted Leather Trim",
      "Bentley Rotating Dashboard Display & Touchscreen Remote",
      "Naim for Bentley 2,200W Audiophile Sound System",
      "Champagne Service with Crystal Stemware",
      "Double-Glazed Acoustic Glass & Mood Lighting",
      "Special Occasion White-Glove Chauffeur Service"
    ],
    idealFor: "Grand Weddings, Anniversaries, Luxury Celebrations"
  }
];

const POPULAR_ROUTES = [
  { from: "Delhi IGI Airport (DEL)", to: "Connaught Place / South Delhi", distanceKm: 22, duration: "35 mins" },
  { from: "Delhi / NCR", to: "Taj Mahal, Agra Express Journey", distanceKm: 230, duration: "3 hrs 30 mins" },
  { from: "Delhi / Gurgaon", to: "Jaipur Heritage Palaces", distanceKm: 270, duration: "4 hrs 15 mins" },
  { from: "Mumbai Int'l Airport (BOM)", to: "South Mumbai / Marine Drive", distanceKm: 28, duration: "45 mins" },
  { from: "Bengaluru Airport (BLR)", to: "Whitefield / Indiranagar", distanceKm: 42, duration: "50 mins" },
  { from: "Dubai International (DXB)", to: "Downtown Dubai / Burj Khalifa", distanceKm: 15, duration: "20 mins" }
];

const VIP_ADDONS = [
  { id: "airport_meet", name: "VIP Airport Meet & Greet with Nameboard", price: { INR: 800, USD: 10, AED: 35 }, icon: "user-check", desc: "Chauffeur meets you inside arrival hall with personalized digital tablet placard" },
  { id: "champagne", name: "Chilled Champagne & Premium Truffles", price: { INR: 3500, USD: 45, AED: 165 }, icon: "wine", desc: "Bottle of Moët & Chandon or premium non-alcoholic sparkling beverage on ice" },
  { id: "child_seat", name: "Certified Infant / Child Safety Seat", price: { INR: 500, USD: 8, AED: 25 }, icon: "shield", desc: "ISOFIX certified safety seat pre-installed and sanitized" },
  { id: "extra_luggage_van", name: "Luggage Escort Vehicle (Support Van)", price: { INR: 2500, USD: 35, AED: 120 }, icon: "briefcase", desc: "Accompanying support vehicle for extensive baggage or equipment" },
  { id: "wedding_decor", name: "Royal Floral & Ribbon Car Decor", price: { INR: 4000, USD: 50, AED: 180 }, icon: "heart", desc: "Elegant fresh orchid & rose arrangement designed for grand wedding entrances" }
];
