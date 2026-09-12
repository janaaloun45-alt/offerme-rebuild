# Rebuild the OfferMe frontend from the Stitch screenshots

## Screenshot map

- **Brand mark:** `2.15.01 PM` is the OfferMe logo reference.
- **Find Offers:** `2.15.40 PM` is the top of the page; `2.16.06 PM` continues its offer grid and left-side tools; `2.16.21 PM` continues into the assurance strip and footer. These form one page.
- **Offer Details & Savings:** `2.16.46 PM` is the top of the Caribou Coffee detail page; `2.17.02 PM` continues with eligible cards, terms, and footer. These form one page.
- **Home:** `2.17.20 PM` is the top; `2.17.40 PM` continues categories and trending perks; `2.17.53 PM` continues the offer grid and begins hotspots; `2.18.15 PM` completes hotspots, privacy messaging, and footer. These form one page.
- **My Cards/Profile:** no standalone full-page screenshot is included. Its visual language comes from the shared navigation, the Home “My Cards” panel, and the Find Offers active-card sidebar. The standalone page will preserve those exact patterns rather than inventing banking details.

## What will be built

- A shared OfferMe header and footer matching the screenshots, with working navigation for Home, Find Offers, My Cards, and Savings & Perks.
- A complete **Home** page with the search-led headline, My Cards panel, lifestyle categories, six trending offer cards, hotspot section, privacy banner, and footer in the shown order.
- A complete **Find Offers** page with “Where are you spending?”, search and filter rows, the left My Cards/redemption/savings column, the two-column matching-offer grid, assurance strip, and footer.
- A complete **Offer Details** page for the demonstrated Caribou Coffee offer, including the large merchant visual area, eligible card, offer terms, other eligible card products, and the Savings Calculator.
- A complete **My Cards** page showing bank and card-product names only, using the screenshot’s compact card-product presentation and no numbers, balances, credentials, or bank-sync language.
- A **Savings & Perks** navigation destination using the same offer-browsing presentation rather than introducing a new product concept.

## Add Card interaction

- Add “+ Add Card” naturally beside the My Cards heading.
- Open a matching modal with a bank selector followed by a dependent card-product selector.
- Support the specified banks and representative products, add the selection immediately, show “Card added successfully,” close the modal, prevent duplicates, and allow removal.
- Keep this frontend-only for now; card selections persist only while the page is open. No database, login, bank connection, payment, AI, or backend work.

## Visual implementation

- Recreate the warm cream canvas, black/brown/burgundy/blush palette, compact rounded navigation, restrained shadows, dense desktop grids, and screenshot typography hierarchy through shared design tokens.
- Use neutral, clearly illustrative category imagery where exact merchant photography is unavailable, preserving image proportions and card geometry without implying a real verified location.
- Mark all offers as demo data and avoid claims that they are current or verified.
- Adapt the same composition for tablet and mobile: stacked search and card areas, horizontally scrollable filter controls where needed, single-column offer cards, and an accessible mobile navigation.

## Validation

- Check every route for correct titles and social metadata.
- Verify desktop and mobile layouts, navigation, search/filter controls, calculator behavior, Add Card success/duplicate/removal flows, and absence of overflow or overlap.
- Confirm the project builds cleanly and stop after the frontend is complete.
