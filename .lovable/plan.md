# Diversify OfferMe demo offer matching

## Demo data
- Replace the current sample offer set with a balanced merchant-specific mix across NBK, Boubyan Bank, KFH, Gulf Bank, and American Express Middle East.
- Give every demo merchant multiple eligible card products with different percentages, while keeping each record explicitly labeled as demo/sample data.
- Remove stale demo offers during seeding so older NBK-heavy records cannot continue affecting results.

## Deployment behavior
- Reuse one demo seeding function for manual seeding and backend startup, ensuring Render applies the updated records after deployment.
- Keep existing card products, matching/ranking code, API behavior, authentication, and frontend unchanged.

## Verification
- Validate that every seeded card reference resolves to an existing card product.
- Test representative saved-card combinations for all six merchants and confirm the highest eligible percentage wins.
- Confirm the app build remains healthy and leave the changes ready for the connected GitHub/Render deployment flow.
