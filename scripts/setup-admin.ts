import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Get Convex URL from environment or use default
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ CONVEX_URL environment variable is not set.");
  console.error("Please set it to your Convex deployment URL:");
  console.error("export CONVEX_URL=https://your-deployment.convex.cloud");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function setupAdmin(): Promise<void> {
  const password = process.argv[2];

  if (!password) {
    console.error("Please provide an admin password:");
    console.error("npx tsx scripts/setup-admin.ts <password>");
    process.exit(1);
  }

  try {
    console.log("Setting up admin access...");
    console.log(`Using Convex URL: ${CONVEX_URL}`);

    // Call the initializeAdminSettings mutation
    await client.mutation(api.admin.initializeAdminSettings, { password });

    console.log("✅ Admin access configured successfully!");
    console.log(`🔑 Admin password set to: ${password}`);
    console.log("\n📝 Next steps:");
    console.log("1. Start your development server: yarn dev");
    console.log("2. Navigate to: http://localhost:3000/admin");
    console.log("3. Use the password to access the admin dashboard");
    console.log("\n⚠️  Keep your admin password secure!");
  } catch (error) {
    console.error("\n❌ Error setting up admin access:");

    if (error instanceof Error) {
      if (error.message.includes("already initialized")) {
        console.log("⚠️  Admin settings are already initialized.");
        console.log(
          "If you need to reset the password, you'll need to do it manually in the Convex dashboard."
        );
        return;
      } else if (
        error.message.includes("NetworkError") ||
        error.message.includes("fetch")
      ) {
        console.error("🌐 Network error - please check:");
        console.error("   - Your internet connection");
        console.error("   - The CONVEX_URL is correct");
        console.error("   - Your Convex deployment is running");
      } else {
        console.error(`   ${error.message}`);
      }
    } else {
      console.error("   Unknown error occurred");
    }

    console.error("\n💡 Troubleshooting tips:");
    console.error("   - Make sure your Convex deployment is running");
    console.error("   - Check that CONVEX_URL is set correctly");
    console.error("   - Verify you have the correct Convex deployment URL");

    process.exit(1);
  }
}

setupAdmin();
