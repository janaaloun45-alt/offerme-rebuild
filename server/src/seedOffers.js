import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import { seedDemoData } from "./seedDemoData.js";

await connectDB();
const result = await seedDemoData();
console.log(`Seeded ${result.cards} card products and ${result.offers} demo offers.`);
await mongoose.disconnect();
