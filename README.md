# OfferMe Rebuild

I am attaching multiple screenshots from my original Stitch design for OfferMe.

IMPORTANT:

These screenshots are NOT all separate pages.

Some screenshots are different sections of the SAME page because I split/cropped long pages into multiple screenshots so the design and details are easier to see.

You must first analyze all attached screenshots together and understand which screenshots belong to the same page.

The screenshots collectively represent the original OfferMe website design.

==================================================

SOURCE OF TRUTH

==================================================

The attached Stitch screenshots are the ONLY source of truth for the visual design.

Ignore the visual design of the website currently implemented in this project wherever it conflicts with the screenshots.

I do NOT want:

- a redesign

- a simplified interpretation

- a new design inspired by the screenshots

I want the existing OfferMe frontend rebuilt to match the Stitch screenshots as closely as possible.

Combine screenshots that show different portions of the same page into ONE continuous page.

For example:

If one screenshot shows the top half of a page and another shows the bottom half, they should NOT become two pages.

They are references for different sections of the same page.

==================================================

VISUAL ACCURACY

==================================================

Carefully reproduce:

- Overall page widths

- Section order

- Navigation

- Header

- Footer

- Background colors

- Cream/off-white background

- Brown, burgundy and blush color palette

- Typography hierarchy

- Font sizes

- Heading sizes

- Search bars

- Buttons

- Button placement

- Rounded corners

- Borders

- Shadows

- Card dimensions

- Grid layouts

- Spacing

- Padding

- Offer cards

- Category sections

- My Cards sections

- Savings Calculator

- Sidebars

- Filters

- Icons

- Visual hierarchy

Do not randomly add new sections or remove sections that appear in the screenshots.

Desktop should match the screenshots very closely.

Afterwards, make the same design responsive for smaller screens.

==================================================

UNDERSTAND THE PAGES

==================================================

Use the screenshots to reconstruct the complete pages.

The main OfferMe website includes pages/features such as:

HOME

The Home page includes the sections shown across the relevant screenshots, including:

- OfferMe navigation

- Main hero section

- “Find the best offer before you pay.”

- Merchant search

- Find My Offers CTA

- My Cards / active cards area

- Categories

- Offer cards / featured or trending offers

- Any additional sections visible further down the Home screenshots

If multiple screenshots show different parts of Home, combine them into ONE Home page.

----------------------------

FIND OFFERS

Reconstruct the complete Find Offers page using ALL screenshots related to it.

It should include the elements visible in Stitch such as:

- “Where are you spending?”

- Merchant search

- Filters

- Categories where shown

- My Cards

- Matching offers

- Best offer presentation

- Savings information

- Other sections shown further down the page

Again, if this page is shown across multiple screenshots, combine them into ONE page.

----------------------------

OFFER DETAILS & SAVINGS

Reconstruct the complete Offer Details page from its screenshots.

Include the elements shown in Stitch such as:

- Merchant

- Offer

- Card required

- Offer details

- Terms

- Savings Calculator

- Other eligible offers/cards where shown

The Savings Calculator should visually match Stitch.

----------------------------

MY CARDS / PROFILE

Reconstruct the complete My Cards/Profile page from all relevant screenshots.

Keep the layout shown in Stitch.

This page should display the card PRODUCTS the user has added to OfferMe.

Do NOT display fake card numbers, fake balances or fake banking information.

==================================================

ADD CARD FEATURE

==================================================

In addition to accurately recreating the Stitch design, add ONE new feature:

“+ Add Card”

Place this naturally inside the existing My Cards section without redesigning the page.

When clicked, open a modal/panel matching the OfferMe visual style.

Heading:

“Add a Card”

Text:

“Choose the card you own so OfferMe can find perks available to you.”

STEP 1:

Choose Bank

Examples:

- National Bank of Kuwait (NBK)

- Boubyan Bank

- Kuwait Finance House (KFH)

- Gulf Bank

- American Express Middle East

STEP 2:

Choose Card Product

The available card products should depend on the selected bank.

Example:

National Bank of Kuwait (NBK)

→ Visa Platinum

→ Visa Signature

→ Mastercard

STEP 3:

Button:

“Add to My Cards”

After clicking it:

- Add the selected card to My Cards

- Show “Card added successfully”

- Close the modal

- Display the card immediately

- Prevent duplicate cards

Allow users to remove an added card.

IMPORTANT:

OfferMe does NOT need actual banking information.

NEVER request:

- Full card number

- CVV

- PIN

- Expiration date

- Bank username

- Bank password

- Account number

We only need:

Bank + Card Product

Example:

NBK

Visa Platinum

This information will later be stored in MongoDB and used for offer matching.

==================================================

CONTENT ACCURACY

==================================================

Some merchant photographs in Stitch may be generated placeholders.

Do not present an unrelated photograph as a real merchant location.

If an accurate merchant asset is unavailable, use a clean neutral category visual while preserving the same dimensions/layout from Stitch.

Also:

Any bank/merchant offers shown during development are DEMO DATA.

Do not claim they are verified current offers.

==================================================

DO NOT ADD OR CHANGE

==================================================

Do NOT add:

- Budgeting

- Expense tracking

- Investments

- Crypto

- Money transfers

- Bank balances

- Bank synchronization

- Payment processing

- Subscription plans

- Social features

- New dashboards

- Unrequested features

Do NOT use wording such as:

“Synced Wallet”

Use:

“My Cards”

OfferMe does NOT currently connect directly to users' banks.

==================================================

DO NOT WORK ON BACKEND YET

==================================================

For this step:

DO NOT connect MongoDB.

DO NOT add OpenRouter.

DO NOT add AI.

DO NOT build bank integrations.

DO NOT deploy anything.

DO NOT change backend architecture.

This step is about getting the FRONTEND correct first.

==================================================

MAIN OFFERME CONCEPT

==================================================

The entire website should communicate one simple use case:

A user is about to pay somewhere, for example Caribou Coffee.

They open OfferMe and search:

“Caribou Coffee”

OfferMe will eventually check the card products saved under My Cards and tell the user which of their cards has the best eligible offer.

The core question OfferMe answers is:

“Which of my cards gives me the best offer here?”

==================================================

FINAL INSTRUCTION

==================================================

Before making changes, inspect ALL attached screenshots together.

Determine which screenshots are:

- separate pages

- different sections of the same page

- cropped continuations of another screenshot

Then rebuild the frontend accordingly.

Do not treat every screenshot as a separate page.

Do not redesign the screenshots.

Reproduce the complete Stitch website as closely as possible and add the “+ Add Card” feature.

When the frontend is complete, STOP.

Do not proceed to MongoDB, authentication, OpenRouter, backend integration, or deployment until I approve the frontend.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d16003ef-a3e1-4319-adb0-0f9b05d44c3d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
