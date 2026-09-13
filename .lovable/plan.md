# Fix the deployed OfferMe logo

## Implementation
- Download the existing OfferMe logo unchanged from its working Lovable asset URL into the project source.
- Replace the header/footer JSON pointer import with a normal Vite image import so Vercel bundles and serves it from its own production assets.
- Keep the current image dimensions, placement, and all surrounding UI unchanged.

## Verification
- Confirm the project builds without errors.
- Check the logo request and rendered header at desktop, tablet, and mobile widths in the local production-equivalent preview.
- Confirm the generated asset URL is a Vite production asset rather than `/src/...` or the Lovable-only asset endpoint.

## Deployment
- Leave the change in the connected project repository so the existing GitHub/Vercel integration can deploy it automatically.
