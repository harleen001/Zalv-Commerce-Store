# Create the first Zalv owner account

The Zalv storefront does **not** provide public owner signup. That is intentional:
if owner signup were public, any visitor could give themselves admin access.

An owner uses an email address as the username. Create the account once in the
Supabase dashboard, mark it as an owner, and then sign in through the
storefront's **Owner / Admin** option.

## 1. Create the login account

In Supabase:

1. Open the Zalv project.
2. Go to **Authentication → Users**.
3. Choose **Add user → Create new user**.
4. Enter the owner's email address and a strong temporary password.
5. Keep **Auto Confirm User** enabled if it is available.
6. Create the user.
7. Copy the user's **UUID** from the users table.

The email address is the owner's username. There is no separate username field.

## 2. Grant owner access

Open **SQL Editor → New query**, replace the two placeholder values, and run:

```sql
insert into public.profiles (id, full_name, is_admin)
values (
  'PASTE_AUTH_USER_UUID_HERE',
  'Owner Name',
  true
)
on conflict (id) do update
set
  full_name = excluded.full_name,
  is_admin = true;
```

If the `profiles` table or `is_admin` column does not exist yet, run
`supabase/schema.sql` first.

## 3. Sign in from Zalv

1. Open the storefront and select the account icon.
2. Select **Owner / Admin**.
3. Enter the Supabase user's email and password.
4. Select **Enter owner desk**.

The app checks `profiles.is_admin` after authentication. Choosing the
**Owner / Admin** tab alone never grants access.

## Security notes

- Do not put an owner password in the source code, ZIP, or chat.
- Change the temporary password after the first login.
- Use a separate owner account rather than sharing a customer's account.
- To remove owner access without deleting the user, run:

```sql
update public.profiles
set is_admin = false
where id = 'PASTE_AUTH_USER_UUID_HERE';
```