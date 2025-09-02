# API Playground - Next-Dicky

This document explains how to use the API Playground functionality in the Next-Dicky application.

## Overview

The API Playground allows users to validate their API keys and access protected resources. It consists of:

1. **Playground Page** (`/playground`) - Form to submit API keys
2. **Protected Page** (`/protected`) - Content accessible only with valid API keys
3. **API Endpoints** - Backend validation and authentication

## How It Works

### 1. Accessing the Playground

- Navigate to the dashboard sidebar
- Click on "API Playground" 
- You'll be redirected to `/playground`

### 2. Submitting an API Key

- Enter your API key in the form
- Click "Submit API Key"
- The system will validate the key against the backend

### 3. Validation Results

**Valid API Key:**
- Green notification: "Valid API Key, /protected can be accessed"
- API key is stored in session storage
- Automatic redirect to `/protected` after 2 seconds

**Invalid API Key:**
- Red notification: "Invalid API Key"
- No redirect, user stays on playground page

### 4. Protected Area

- Accessible only with valid API keys
- Shows user information and protected content
- Includes logout functionality
- Redirects to playground if not authenticated

## Valid API Keys

API keys are now validated against the Supabase database. Any API key that exists in the `api_keys` table is considered valid.

To create a new API key:
1. Go to your dashboard at `/dashboards`
2. Use the API key management interface
3. Create a new key with a name and description
4. The system will generate a unique key (e.g., `pk_ABC123DEF456`)
5. Use this generated key in the playground

## API Endpoints

### POST `/api/validate-api-key`
Validates submitted API keys.

**Request Body:**
```json
{
  "apiKey": "your-api-key-here"
}
```

**Response (Valid):**
```json
{
  "valid": true,
  "message": "API key is valid",
  "user": {
    "id": "user-123",
    "name": "Demo User",
    "accessLevel": "full",
    "validatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Invalid):**
```json
{
  "valid": false,
  "message": "Invalid API key"
}
```

### GET `/api/check-auth`
Checks if the user is authenticated.

**Query Parameters:**
- `apiKey`: The API key to validate

**Response (Authenticated):**
```json
{
  "authenticated": true,
  "user": {
    "id": "user-123",
    "name": "Demo User",
    "accessLevel": "full",
    "lastSeen": "2024-01-01T00:00:00.000Z"
  }
}
```

## Security Features

- API keys are validated server-side
- Session storage for temporary authentication
- Automatic redirects for unauthenticated users
- Logout functionality clears stored credentials

## File Structure

```
src/
├── app/
│   ├── playground/
│   │   └── page.js          # Playground form page
│   ├── protected/
│   │   └── page.js          # Protected content page
│   └── api/
│       ├── validate-api-key/
│       │   └── route.js     # API key validation endpoint
│       ├── check-auth/
│       │   └── route.js     # Authentication check endpoint
│       └── api-keys/
│           └── route.js     # API key management endpoint
├── components/
│   ├── dashboard/
│   │   └── Sidebar.js       # Updated with navigation
│   └── Notification.js      # Notification component
├── lib/
│   ├── supabase.js          # Supabase client configuration
│   └── api.js               # API service functions
└── middleware.js            # Route protection middleware
```

## Database Schema

The API keys are stored in the `api_keys` table with the following structure:

```sql
CREATE TABLE api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  key VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE
);
```

## Customization

### Adding New Valid API Keys

API keys are now managed through the Supabase database. To add new keys:

1. **Through the Dashboard**: Use the API key management interface at `/dashboards`
2. **Direct Database Insert**: Insert directly into the `api_keys` table in Supabase
3. **API Endpoint**: Use the `POST /api/api-keys` endpoint

The system automatically generates unique keys with the format `pk_` + random string.

### Modifying Validation Logic

The validation logic can be enhanced to:
- Connect to a database
- Check API key expiration
- Validate against external services
- Implement rate limiting

### Styling

All components use Tailwind CSS classes and can be customized by modifying the className attributes.

## Testing

1. Start the development server: `npm run dev`
2. Navigate to `/dashboards`
3. Click "API Playground" in the sidebar
4. Try submitting valid and invalid API keys
5. Test the protected area access

## Production Considerations

- Implement proper session management
- Use secure HTTP-only cookies
- Add rate limiting
- Implement proper error logging
- Use environment variables for sensitive data
- Add CSRF protection
- Implement proper database integration
