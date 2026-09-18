# Zalv Supabase setup

1. Open the Supabase SQL editor for the Zalv project.
2. Run [`schema.sql`](./schema.sql). It creates the profiles, products, orders, and order items tables, enables row-level security, creates the new-user profile trigger, and seeds 12 products.
3. Create an account in the storefront.
4. In the Supabase table editor, set that account's `profiles.is_admin` value to `true` to unlock `/admin`.

The storefront reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Only the public anon key belongs in the browser. Never put a service-role key in frontend code or Vite environment variables.