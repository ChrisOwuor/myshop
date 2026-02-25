# Green Pastures Farm Shop (React + Tailwind + React Router v6)

This implementation now uses:

- React + Vite
- React Router DOM v6 for routing
- Tailwind CSS for styling

## Pages / features

- Navbar
- Home with image cards and scroll reveal
- Single product page
- Related products
- Reviews
- Cart page
- Checkout page with payment options
- Tracking page
- Profile page
- Login/logout pages
- Prices displayed in KSh

## Run locally

```bash
npm install
npm run dev
```

## Backend base URL

Create `.env` (optional):

```bash
VITE_API_BASE_URL=https://your-backend.example.com/api
```

The checkout template and API references use `import.meta.env.VITE_API_BASE_URL`.
