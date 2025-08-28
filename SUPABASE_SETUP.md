# Supabase Database Setup

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project in Supabase
3. Get your project URL and API keys

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these values in your Supabase project settings under "API".

## Database Table Schema

Create the following table in your Supabase database using the SQL editor:

```sql
-- Create the api_keys table
CREATE TABLE api_keys (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  key VARCHAR(255) UNIQUE NOT NULL,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the key column for faster lookups
CREATE INDEX idx_api_keys_key ON api_keys(key);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create a policy for authenticated users (adjust as needed)
CREATE POLICY "Allow all operations for authenticated users" ON api_keys
  FOR ALL USING (auth.role() = 'authenticated');

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_api_keys_updated_at 
  BEFORE UPDATE ON api_keys 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();
```

## Insert Sample Data (Optional)

```sql
-- Insert some sample API keys for testing
INSERT INTO api_keys (name, description, key, permissions, last_used) VALUES
('Production API', 'API key for production environment', 'pk_live_4KYB3JQ2C8H9M6N5L7X1Z9', 'full', '2024-01-20'),
('Development API', 'API key for development and testing', 'pk_test_A2B4C6D8E1F3G5H7I9J0K2', 'read', '2024-01-19');
```

## Installation & Setup Steps

1. Add Supabase to your project:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Create the environment file with your Supabase credentials

3. Run the SQL commands above in your Supabase SQL editor

4. Start your development server:
   ```bash
   npm run dev
   ```

## API Endpoints

The application provides the following API endpoints:

- `GET /api/api-keys` - Get all API keys
- `POST /api/api-keys` - Create a new API key
- `PUT /api/api-keys/[id]` - Update an API key
- `DELETE /api/api-keys/[id]` - Delete an API key

## Features

- ✅ CRUD operations for API keys
- ✅ Real-time database synchronization
- ✅ Error handling and loading states
- ✅ Responsive UI with dark mode support
- ✅ API key generation and clipboard functionality
- ✅ Form validation and user feedback
