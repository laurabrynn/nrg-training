import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load .env.local
const env = readFileSync(".env.local", "utf8");
const get = (key) => env.match(new RegExp(`^${key}=(.+)$`, "m"))?.[1]?.trim();

const supabaseUrl = get("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const EMAIL = process.argv[2] ?? "lbneuhoff@neighborhoodrestaurantgroup.com";
const NEW_PASSWORD = "NRGtraining2024!";

const { data: { users }, error: listError } = await admin.auth.admin.listUsers();
if (listError) throw listError;

const user = users.find((u) => u.email === EMAIL);
if (!user) {
  console.error("User not found:", EMAIL);
  process.exit(1);
}

const { error } = await admin.auth.admin.updateUserById(user.id, {
  password: NEW_PASSWORD,
});

if (error) {
  console.error("Failed:", error.message);
} else {
  console.log(`✓ Password set for ${EMAIL}`);
  console.log(`  Email:    ${EMAIL}`);
  console.log(`  Password: ${NEW_PASSWORD}`);
  console.log("\nYou can change it after logging in.");
}
