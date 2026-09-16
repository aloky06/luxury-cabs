# Luxury Cabs - Premium Cab Booking Website

A 100% pure **HTML5, Vanilla CSS, and JavaScript** luxury cab booking web application built for instant, zero-configuration deployment on **Vercel**, **Netlify**, or **GitHub Pages**.

## 🚀 How to Deploy on Vercel

### Option 1: Vercel Dashboard (Drag & Drop or GitHub)
1. Push this folder to a GitHub repository (or zip it).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository or drag and drop this project folder.
4. **Framework Preset**: Select **"Other"** (or leave as Default).
5. **Root Directory**: `./` (Default).
6. Click **"Deploy"**! Your site will be live instantly with a free `.vercel.app` URL and SSL certificate.

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 📁 Project Structure

```
Luxury Cabs/
├── index.html          # Main HTML5 entrypoint
├── vercel.json         # Vercel static routing & caching configuration
├── .gitignore          # Git ignore rules
├── assets/
│   ├── css/
│   │   ├── style.css       # Core design tokens, theme & layout
│   │   ├── components.css  # Interactive components, cards, modals & sliders
│   │   └── responsive.css  # Mobile and tablet responsiveness
│   ├── js/
│   │   ├── fleet-data.js   # Vehicle data & amenities
│   │   ├── calculator.js   # Fare calculation & promo coupon engine
│   │   ├── booking.js      # 5-step interactive booking flow & voucher
│   │   └── app.js          # Navigation, filters, 3D tilt, and tracker
│   └── images/
│       ├── logo.png        # Luxury Cabs official logo
│       ├── hero_banner.jpg # 8K luxury palace entrance banner
│       └── ... (Fleet vehicles)
```
