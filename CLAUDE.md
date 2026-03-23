# 🏁 Karting Driver Portfolio — Claude Code Prompt

> **Stack:** React 18 + Vite · Vue 3 (Island components via `@vue/runtime-dom`) · GSAP 3 + ScrollTrigger · Firebase v10 (Firestore + Storage + Auth) · CSS Modules + CSS custom properties

---

## 📁 Project Bootstrap

```bash
npm create vite@latest karting-portfolio -- --template react
cd karting-portfolio
npm install gsap @gsap/react firebase
npm install vue @vitejs/plugin-vue
npm install react-router-dom framer-motion
npm install swiper react-intersection-observer
npm install @fontsource/bebas-neue @fontsource/barlow-condensed
```

Configure `vite.config.js` to support both React JSX and Vue SFCs simultaneously (use `@vitejs/plugin-react` + `@vitejs/plugin-vue` together).

---

## 🎨 Design System

### Color Palette
```css
:root {
  --red:        #E8000D;
  --red-dark:   #9B0009;
  --red-glow:   rgba(232, 0, 13, 0.35);
  --black:      #080808;
  --black-soft: #111111;
  --white:      #F5F5F5;
  --white-dim:  rgba(245, 245, 245, 0.6);
  --stripe-gap: 28px;
}
```

### Typography
- **Display / Logo:** `Bebas Neue` (Google Fonts) — uppercase, wide tracking
- **Headers:** `Barlow Condensed` 700–900 weight, italic variants
- **Body / Captions:** `Barlow Condensed` 400 weight
- **Accent / Quotes:** Georgia or a serif font in italic for editorial quotes
- All text should feel editorial — big, bold, condensed racing aesthetic

### Background — Animated Red Diagonal Stripe Grid
Create a **full-viewport fixed background layer** (`z-index: 0`) that renders:
- Very thin diagonal red stripes (1px wide, ~3% opacity) spaced `var(--stripe-gap)` apart — like racing livery
- On top of that, scatter 6–10 **geometric shapes** (thin outline rectangles, circles, chevrons in red at ~8% opacity)
- Animate shapes with GSAP `gsap.to()` on a long looping timeline: each shape drifts slowly in a unique direction, rotates slightly, and pulses opacity between 5%–12%
- The stripes themselves stay static; only the shapes move
- Implement this as `<AnimatedBackground />` React component, rendered once in `App.jsx` behind everything

```jsx
// AnimatedBackground.jsx — skeleton
useEffect(() => {
  const shapes = gsap.utils.toArray('.bg-shape');
  shapes.forEach((shape, i) => {
    gsap.to(shape, {
      x: `random(-120, 120)`,
      y: `random(-80, 80)`,
      rotation: `random(-25, 25)`,
      opacity: `random(0.04, 0.12)`,
      duration: `random(12, 22)`,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 1.3,
    });
  });
}, []);
```

SVG pattern for stripes (use as `background-image: url(...)` in CSS):
```css
background-image: repeating-linear-gradient(
  -45deg,
  transparent,
  transparent calc(var(--stripe-gap) - 1px),
  rgba(232,0,13,0.04) calc(var(--stripe-gap) - 1px),
  rgba(232,0,13,0.04) var(--stripe-gap)
);
```

---

## 🧭 Section 1 — Navigation + Hero

### Navigation
- Fixed top bar, `backdrop-filter: blur(12px)` on a `rgba(8,8,8,0.7)` background
- Left: Logo image (`logo.png`) — use the provided red+black YE logo, ~48px tall
- Right: Nav links — `CHAMPIONSHIPS · GALLERY · CONTACT` in Bebas Neue, spaced, white
- A **red 1px underline** slides in from left on hover (CSS clip-path animation)
- On scroll down >80px: nav shrinks slightly (GSAP), logo gets smaller
- Mobile: hamburger that slides a full-screen black overlay menu with GSAP timeline

### Hero Section
Layout: full-viewport (`100svh`), dark background

**Left column (55%):**
- Driver name in massive Bebas Neue: two lines, first line normal weight, second line **outlined** (CSS `-webkit-text-stroke: 2px var(--white)`) — creates a striking typographic contrast
- Tagline below in Barlow Condensed 300: *"Every millisecond. Every corner. Every race."*
- Two CTA buttons:
  - `[ VIEW CHAMPIONSHIPS ]` — solid red fill, white text
  - `[ SEE GALLERY ]` — outlined red border, red text

**Right column (45%):**
- `racer.jpg` displayed with a dramatic clip-path shape (not a rectangle — use a chevron/diagonal cut on the left edge)
- Behind the photo: a blurred red radial glow (`box-shadow` or pseudo-element)
- Race number `#8` in enormous semi-transparent Bebas Neue (~400px, 3% opacity) as a background element

**Hero Entrance Animation (GSAP timeline on mount):**
```
t=0.0  name line 1 slides in from left (x: -100 → 0, opacity 0 → 1)
t=0.3  name line 2 slides in from left with stagger
t=0.6  tagline fades up
t=0.8  buttons appear with scale bounce
t=0.5  photo slides in from right (x: 80 → 0) + clip-path reveals
t=1.2  background number fades in slowly
```

**Scroll indicator:** Animated downward chevron (CSS keyframe bounce) at bottom center

---

## 🏆 Section 2 — Championships

### Layout
- Section title: `CHAMPIONSHIPS` in Bebas Neue, large, with a thin red horizontal line extending from it
- Subtitle: `"A history written in lap times"` — italic serif, muted white
- Cards displayed in a **CSS Grid** (auto-fill, minmax(320px, 1fr))

### Championship Card
Each card is a `<ChampionshipCard />` React component fed from Firestore.

**Card Design:**
- Dark card `#111` with a subtle red left-border (4px)
- Top half: championship photo (cover fit), with a red gradient overlay at bottom
- Bottom half: 
  - Championship name in Bebas Neue
  - Year/Date in Barlow small caps
  - Best lap time badge: `⏱ 1:23.456` in red monospace pill
  - Position badge: `🥇 P1` or `🥈 P3` etc.
  - `VIEW DETAILS →` link in small red text

**Card Hover Animation:**
- GSAP `onMouseEnter`: card lifts (`y: -12`), red border glows (`box-shadow`), photo zooms slightly (`scale: 1.05` on img)
- Photo gets a red color overlay at 20% opacity
- Duration: 0.3s, ease: `power2.out`

**Scroll-in Animation:**
- Use `ScrollTrigger` + `gsap.from()`: cards stagger in from below (`y: 60, opacity: 0`) as user scrolls into view
- Stagger delay: 0.15s per card

### Championship Detail Modal / Page
When a card is clicked → **full-screen overlay** slides in (not a new route, an overlay):

```
GSAP timeline:
  overlay background scales from card position to full screen (FLIP technique)
  content fades in after overlay expands
```

Overlay content:
- Large hero image at top (full width)
- Championship name huge (Bebas Neue)
- Grid of details: Date · Track · Position · Best Lap Time · Total Laps
- Description paragraph
- **Photo carousel** (Swiper.js): swipe through race photos
- Close button (×) top-right: reverses the GSAP animation

---

## 📸 Section 3 — Photo Gallery (Horizontal Scroll)

### Mechanics
- Section is a **pinned horizontal scroll** using GSAP ScrollTrigger `pin: true`
- As user scrolls vertically, the gallery translates horizontally
- Total horizontal distance = sum of all photo widths + gaps

```js
gsap.to('.gallery-track', {
  x: () => -(galleryTrack.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.gallery-section',
    pin: true,
    scrub: 1,
    end: () => `+=${galleryTrack.scrollWidth}`,
  }
});
```

### Gallery Item Design
Each item alternates between two layouts (like `landonorris.com`):

**Layout A — Photo dominant:**
- Large photo (portrait or landscape), slight rotation (`rotate: -1deg` or `1deg`) alternating
- Caption below: event name + year in small caps

**Layout B — Quote card:**
- Black card with large quotation mark `"` in red (Bebas Neue, ~200px)
- Quote text in italic serif, white
- Attribution below in small Barlow Condensed
- Example quote: *"The kart doesn't lie — only the stopwatch tells the truth."*

Alternate: Photo → Quote → Photo → Photo → Quote → Photo...

### Photo Cards Interaction
- On hover: photo scales up slightly, rotation straightens to 0
- A red caption bar slides up from bottom of photo with event name

---

## 📬 Section 4 — Contact

Layout: Two columns on desktop, stacked on mobile

**Left column:**
- `LET'S TALK` in massive Bebas Neue
- Short text about booking/media/sponsorship
- Social links: Instagram, TikTok, YouTube — icon + handle, red on hover

**Right column — Contact Form:**
- Fields: Name · Email · Message
- All fields: dark background, red bottom-border only (no box), white text
- Submit button: full red, white text, `SEND MESSAGE` in Bebas Neue
- On submit: GSAP animation — button morphs into a checkmark, text changes to `SENT ✓`
- Form sends data to Firebase Firestore `contacts` collection

**Background detail:** A large `#8` race number in the background (very faint, 4% opacity)

---

## 🦶 Section 5 — Footer

- Full-width black bar
- Logo centered
- Three columns: Quick Links · Social · Legal
- Bottom line: `© 2025 [DRIVER NAME] · Built for speed`
- Thin red top border
- On page load, footer animates in with ScrollTrigger fade

---

## 🔥 Firebase Architecture

### `firebase/config.js`
Initialize Firebase app with Auth, Firestore, and Storage.

### Firestore Collections

```
/championships/{id}
  name: string
  year: number
  date: timestamp
  track: string
  position: number        // 1, 2, 3...
  bestLapTime: string     // "1:23.456"
  totalLaps: number
  description: string
  coverPhoto: string      // Storage URL
  photos: string[]        // Array of Storage URLs
  createdAt: timestamp

/contacts/{id}
  name: string
  email: string
  message: string
  createdAt: timestamp
```

### Firebase Storage
```
/championships/{id}/cover.jpg
/championships/{id}/photos/{filename}
```

---

## 🔐 Admin Panel — `/admin` Route

Protected by Firebase Auth (Email/Password). Only one admin user exists.

### Admin Login Page (`/admin/login`)
- Minimal dark login form
- Email + Password fields
- `ENTER PIT LANE` button (red)
- On auth error: shake animation on form

### Admin Dashboard (`/admin`)
After login, show:

**Header:** Logo + `ADMIN PANEL` + Logout button

**Championships List:**
- Table/cards of all championships from Firestore
- Each row: Name · Year · Position · Edit · Delete buttons
- `+ ADD CHAMPIONSHIP` button (red, top right)

**Add/Edit Championship Form:**
```
Fields:
  Championship Name       [text input]
  Year                    [number]
  Race Date               [date picker]
  Track Name              [text input]
  Final Position          [number 1-20]
  Best Lap Time           [text, format: "1:23.456"]
  Total Laps              [number]
  Description             [textarea]
  Cover Photo             [file input → Firebase Storage upload]
  Race Photos             [multiple file input → Firebase Storage upload]
```

**Photo Upload UX:**
- Drag-and-drop zone for photos
- Show upload progress bar (red fill)
- Preview thumbnails after upload
- Click thumbnail to remove

**On Save:**
1. Upload cover photo to Storage → get URL
2. Upload all race photos → get URL array
3. Save document to Firestore `championships` collection
4. Show success toast: `"Championship saved! 🏁"`

**Delete Championship:**
- Confirmation modal before delete
- Deletes Firestore doc + all Storage files

---

## 🎬 GSAP Animation Checklist

| Animation | Trigger | Implementation |
|---|---|---|
| Hero entrance | Page load | `gsap.timeline()` sequence |
| Nav shrink | Scroll >80px | `ScrollTrigger` + `gsap.to` |
| Background shapes | Continuous | `gsap.to` loop + yoyo |
| Championship cards | Scroll into view | `ScrollTrigger` stagger |
| Card hover lift | Mouse enter/leave | `gsap.to` in event handlers |
| Modal open/close | Click | GSAP FLIP or scale from card |
| Horizontal gallery | Scroll | `ScrollTrigger` pin + scrub |
| Photo hover | Mouse enter | `gsap.to` scale + rotation |
| Contact form submit | Click | Morphing button animation |
| Section titles | Scroll into view | Clip-path reveal left→right |
| Page transitions | Route change | Fade out/in overlay |

---

## 📂 File Structure

```
src/
├── assets/
│   ├── logo.png
│   └── racer.jpg
├── components/
│   ├── AnimatedBackground.jsx
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── Championships.jsx
│   ├── ChampionshipCard.jsx
│   ├── ChampionshipModal.jsx
│   ├── Gallery.jsx
│   ├── GalleryItem.jsx
│   ├── Contact.jsx
│   └── Footer.jsx
├── admin/
│   ├── AdminLogin.jsx
│   ├── AdminDashboard.jsx
│   ├── ChampionshipForm.jsx
│   └── PhotoUploader.jsx
├── firebase/
│   ├── config.js
│   ├── championships.js    # CRUD helpers
│   ├── storage.js          # Upload helpers
│   └── auth.js
├── hooks/
│   ├── useChampionships.js
│   └── useScrollAnimation.js
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── animations.css
├── App.jsx
└── main.jsx
```

---

## 🚀 Implementation Order

1. **Setup** — Vite + React config, install all deps, Firebase project setup
2. **Design tokens** — CSS variables, fonts, global styles, AnimatedBackground
3. **Navbar + Hero** — with full GSAP entrance animation
4. **Championships section** — Firestore integration + cards + modal
5. **Gallery** — horizontal scroll with GSAP ScrollTrigger pin
6. **Contact** — form + Firebase write
7. **Footer**
8. **Admin Panel** — Auth + full CRUD with file uploads
9. **Polish** — Page transitions, mobile responsiveness, performance audit

---

## 📱 Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 768px)  { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
@media (min-width: 1440px) { /* wide */ }
```

On mobile:
- Hero becomes single column, photo below text
- Championships: 1 card per row
- Gallery: touch-scroll (Swiper native), no GSAP pin
- Admin: simplified table → stacked cards

---

## ⚙️ Performance Notes

- Lazy-load all championship photos (use `loading="lazy"` + Intersection Observer)
- Use WebP format for uploaded images where possible
- GSAP ScrollTrigger: `invalidateOnRefresh: true` for all pinned sections
- Firebase: use `onSnapshot` for real-time updates in admin, `getDocs` once on public site
- Split admin bundle via React `lazy()` + `Suspense`

---

## 🎯 Unique Wow Moments

1. **Hero clip-path photo reveal** — the racer photo cuts in with an angular racing-inspired shape
2. **Card modal FLIP animation** — the card expands organically into a full-screen overlay (no jarring jump)
3. **Horizontal gallery with pinning** — feels like a race car scrolling through memories
4. **Background shapes that breathe** — subtle but makes the page feel alive
5. **Lap time badge animation** — numbers count up with GSAP `CountTo` when cards scroll into view
6. **Red cursor trail** — optional: a red dot follows the cursor with a slight lag (GSAP quickTo)
7. **Admin pit lane theme** — admin panel styled like a racing dashboard with red accents

---

*Assets provided: `logo.png` (red YE logo on black), `racer.jpg` (go-kart driver #8 in red suit)*
*Reference aesthetic: `landonorris.com` — editorial, scattered photo layout, bold typography*