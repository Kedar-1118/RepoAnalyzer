# Database Migrations

## How to Run Migrations

### Using Supabase CLI (Recommended)

1. Install Supabase CLI if you haven't already:
```bash
npm install -g supabase
```

2. Link your project to Supabase:
```bash
supabase link --project-ref your-project-ref
```

3. Run migrations:
```bash
supabase db push
```

### Using SQL Editor in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the content from `003_create_recommended_issues.sql`
4. Paste and execute the SQL

### Verification

After running the migration, verify that the table was created:

```sql
SELECT * FROM recommended_issues LIMIT 1;
```

You should also see the following indexes:
- `idx_recommended_issues_user_id`
- `idx_recommended_issues_expires_at`
- `idx_recommended_issues_match_score`
- `idx_recommended_issues_repo`
- `idx_recommended_issues_user_expires`

## Migration Files

- `003_create_recommended_issues.sql` - Creates the `recommended_issues` table for caching issue recommendations
