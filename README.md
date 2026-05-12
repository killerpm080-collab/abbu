# StickerFlow

A premium sticker storefront with:

- Product catalog for sticker packs
- Order intake form
- Payoneer-oriented payment workflow messaging
- Admin panel for products, order statuses, and payout settings
- LocalStorage persistence for demo/prototype use

## Run locally

```bash
npm start
```

Then open:

- Storefront: `http://localhost:3000/`
- Admin: `http://localhost:3000/admin.html`

## Demo admin login

- Username: `admin`
- Password: `stickers123`

## Notes

This demo does **not** implement a direct live Payoneer gateway. Instead, it provides a practical workflow where customers choose their payment platform and the admin panel tracks settlement through your Payoneer operations.


## New: Personal AI Product Factory

If you want this project to evolve into a personal AI agent that creates many digital product types daily (ebooks, coloring books, comics, planners, stickers, and more), see `PRODUCT_AGENT_BLUEPRINT.md` for architecture, automation flow, and MVP build order.
