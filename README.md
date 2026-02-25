# Green Pastures Farm Shop (Vite)

This is a Vite-powered farm e-commerce frontend with:

- Sticky navbar
- Home page with image cards and scroll reveal animations
- Product listing with prices in KSh
- Single product page with related products + reviews
- Cart page
- Checkout page with payment options
- Tracking page
- Profile page
- Login and logout pages
- Backend-ready endpoint templates using `import.meta.env`

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Environment variables

Create `.env` (optional):

```bash
VITE_API_BASE_URL=https://your-backend.example.com/api
```

The app uses this in template endpoints like:

- `${import.meta.env.VITE_API_BASE_URL}/products`
- `${import.meta.env.VITE_API_BASE_URL}/checkout`
- `${import.meta.env.VITE_API_BASE_URL}/tracking`
