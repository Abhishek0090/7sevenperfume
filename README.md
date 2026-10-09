# 7 Seven Perfume

Static Next.js storefront for a perfume collection. Customers add perfumes to a cart and check out on WhatsApp: the order details are pre-filled in a message to the perfume's dealer.

Stack: Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Radix, neutral theme), Embla carousel.

## Getting started

```bash
npm install
cp .env.example .env.local   # set your WhatsApp number and site URL
npm run dev                  # http://localhost:3000
npm run build                # static site in ./out
```

Deploy the `out/` folder to any static host (Vercel, Netlify, S3, Nginx).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used in metadata and order links |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Fallback dealer number (digits only, with country code) |

Each perfume has its own `dealer.whatsappNumber` in the data. The fallback is used only when that is empty.

## Project structure

Feature-based: each feature owns its components, data, services and types.

```text
src/
  app/                         Routes only (thin, compose features)
    page.tsx                   Home: hero, carousel, perfume grid
    perfumes/[slug]/page.tsx   Perfume details + reviews
  components/
    ui/                        shadcn/ui primitives
    layout/                    Site header, footer
    icons/                     Custom icons
  config/site.ts               Brand, nav, contact, currency
  features/
    home/                      Parallax hero
    perfumes/                  Types, mock data, service, card, grid, carousel, details, notes
    reviews/                   Types, mock data, service, rating stars, review list
    cart/                      Cart context (localStorage), add-to-cart stepper, cart sheet
    checkout/                  WhatsApp message builder, checkout panel
  lib/                         Shared helpers (cn, formatting)
```

## Adding a database later

Pages never import mock data directly. They call async functions in `features/*/services/*.service.ts`:

- `perfume.service.ts`: `getAllPerfumes`, `getFeaturedPerfumes`, `getPerfumeBySlug`, `getAllPerfumeSlugs`
- `review.service.ts`: `getReviewsByPerfumeId`, `getRatingSummary`

To switch to a database (Prisma, Drizzle, Supabase, a REST API):

1. Replace the function bodies with queries. Keep the signatures.
2. In `next.config.ts`, remove `output: "export"` and `images.unoptimized` if you need runtime rendering.
3. In `app/perfumes/[slug]/page.tsx`, replace `dynamicParams = false` with `export const revalidate = 60` (ISR) so new perfumes appear without a rebuild.
4. Cart: `features/cart/store/cart-context.tsx` persists to localStorage. For logged-in users, sync the same `CartItem[]` to a `cart_items` table and re-check price and stock before checkout.

### Perfume images

Each perfume has an `images` array (`{ src, alt }`). The first image is the cover used on cards, the carousel and the cart; the details page shows all of them in a gallery with thumbnails. The gallery SVGs in `public/images/perfumes/<slug>/` (`1.svg` front, `notes.svg`, `2.svg` editorial, `3.svg` studio, `4.svg` scent profile) are generated from the product photos in `public/seven_perfumes/`, which are embedded inside each SVG. After changing images, bump `PERFUME_IMAGE_VERSION` in `src/lib/perfume-image.ts` so browsers fetch the new files.

### Review photos

`Review.photos: ReviewPhoto[]` is already in the type and rendered by `ReviewCard` when present. To enable uploads, add a review form, upload files to object storage, and save the returned URLs in `photos`. Add the storage domain to `images.remotePatterns` in `next.config.ts`.

## Checkout flow

1. **Add to cart** turns into a quantity stepper (limited to stock; reducing below 1 removes the item).
2. **Proceed to checkout** on a details page opens WhatsApp for that perfume with the chosen quantity.
3. The cart drawer (header bag icon) checks out the whole cart. If items come from different dealers, each dealer gets a separate checkout button.

The message includes product name, ID, size, quantity, unit price, line total, grand total and the product link.
