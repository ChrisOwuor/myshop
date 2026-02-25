# Green Pastures Farm Shop

This version is a **stable static storefront** so preview works without dependency installs.

## What is fixed

- Removed broken Vite/React/Tailwind runtime dependency path that failed in this environment.
- `npm run preview` now serves the site directly via Python HTTP server.
- Restored a working storefront with:
  - Navbar
  - Home/product listing with images
  - Single product page
  - Related products
  - Reviews
  - Cart page
  - Checkout with payment options
  - Tracking page
  - Profile page
  - Login/logout pages
  - Scroll reveal animations
  - Prices in KSh

## Run

```bash
npm run preview
```

Open:

- `http://localhost:4173`

## Backend template endpoints

`app.js` exposes backend-ready endpoint templates on `window.__farmApiTemplates`:

- `${API_BASE_URL}/products`
- `${API_BASE_URL}/checkout`
- `${API_BASE_URL}/tracking`

Default base URL in code is:

- `http://localhost:8000/api`
