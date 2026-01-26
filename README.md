# Flowertown PH - Premium Flower Shop Website

A sophisticated, full-stack e-commerce website for Flowertown PH, featuring Instagram-style stories, premium design, and a complete admin panel. Built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

### Customer-Facing
- **Premium Design**: Minimalist, elegant typography with refined color palette
- **Instagram Stories**: Swipeable product highlights with auto-progression
- **Fully Responsive**: Optimized for all devices with mobile-first approach
- **SEO Optimized**: Built-in meta tags, semantic HTML, and performance optimization
- **Product Categories**: 
  - Fresh Flower Bouquets
  - Dried Flower Bouquets
  - Vases & Gifts
  - Money Bouquets
  - Customized Bouquets
  - Sympathy Flowers

### Admin Features (Wix-like CMS)
- � **Supabase Authentication**: Secure admin access
- 📸 **Stories Manager**: Create, edit, and organize Instagram-style highlights
- 🎨 **Content Editor**: Full control over homepage sections
- ⚙️ **Settings Panel**: Customize SEO, contact info, and site-wide settings
- 🖼️ **Image Upload**: Integrated with Supabase Storage

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- Supabase account (free tier works great!)

### Installation

1. **Clone and Install**
```bash
npm install
```

2. **Setup Supabase**

a. Create a new project at [supabase.com](https://supabase.com)

b. Run the SQL setup script in your Supabase SQL Editor:
   - Copy contents from `supabase-setup.sql`
   - Execute in Supabase SQL Editor

c. Create `.env.local`:
```bash
cp .env.local.example .env.local
```

d. Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. **Run Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Admin Access

1. Create an admin user in Supabase Authentication
2. Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
3. Login with your credentials
4. Access the dashboard to manage stories and content

## 🎨 Design Philosophy

- **Typography**: Cormorant Garamond (display) + Geist Sans (body)
- **Colors**: Muted, earth-tone palette for premium feel
- **Spacing**: Generous whitespace for elegant presentation
- **Interactions**: Subtle animations and transitions
- **No Roundedness**: Sharp, clean edges for modern sophistication

## 📦 Tech Stack

- **Framework**: Next.js 15 with App Router & Turbopack
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (custom premium theme)
- **Animation**: Framer Motion
- **Backend**: Supabase (Auth, Database, Storage)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Lucide Icons, Sonner (toasts)
- **Carousel**: Swiper.js

## 📝 Project Structure

```
src/
├── app/
│   ├── admin/              # Admin panel routes
│   │   ├── login/          # Admin authentication
│   │   └── dashboard/      # CMS dashboard
│   ├── layout.tsx          # Root layout with fonts
│   └── page.tsx            # Homepage
├── components/
│   ├── Hero.tsx            # Premium hero section
│   ├── StoriesHighlights.tsx  # Instagram-style stories
│   ├── ProductCategories.tsx  # Product grid
│   ├── About.tsx           # About section
│   ├── ContactForm.tsx     # Contact form
│   ├── Newsletter.tsx      # Subscription
│   ├── Header.tsx          # Navigation
│   └── Footer.tsx          # Footer
└── lib/
    └── supabase.ts         # Supabase client setup
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (with Turbopack)
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run ESLint
```

## 📱 Contact Information

- **Address**: Magsaysay Avenue, Naga City 4400
- **Phone**: 09171271659 (TEXT ONLY)
- **Email**: flowertown1496@gmail.com
- **Hours**: Mon - Sun, 9:00 AM - 9:00 PM

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
Works with any platform supporting Next.js 15:
- Netlify
- Railway
- AWS Amplify
- Digital Ocean App Platform

## � License

© 2026 Flowertown PH. All rights reserved.

---

**Built with care** | Established since 2022 | Serving Naga City with beauty
