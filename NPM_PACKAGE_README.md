# @zkyc/sdk - NPM Package

## Installation

```bash
npm install @zkyc/sdk
```

## Usage

### ES Modules (Recommended)

```javascript
import { ZKYCProcess } from '@zkyc/sdk';

// Generate token and redirect to SDK
await ZKYCProcess({
  apiKey: 'prod_YOUR_API_KEY_HERE',
  failurePage: 'https://your-app.com/kyc-failed',
  pendingPage: 'https://your-app.com/kyc-pending',
  platformApiUrl: 'https://your-platform-domain.com', // Optional
});
```

### How It Works

1. **Token Generation**: The package calls your platform's `/api/sdk-token` endpoint with your API key
2. **Secure Token**: Platform generates a 10-minute expiring token
3. **SDK Redirect**: User is redirected to the SDK with the token (not the API key)
4. **Verification**: SDK validates the token server-side and retrieves your API key info

### Parameters

- `apiKey` (required): Your zKYC API key (with `test_` or `prod_` prefix)
- `failurePage` (required): URL to redirect if KYC verification fails
- `pendingPage` (required): URL to redirect if KYC is pending
- `platformApiUrl` (optional): Your platform API URL (defaults to production)

### Example: React Component

```typescript
import React from 'react';
import { ZKYCProcess } from '@zkyc/sdk';

function KYCButton() {
  const handleKYC = async () => {
    try {
      await ZKYCProcess({
        apiKey: process.env.NEXT_PUBLIC_ZKYC_API_KEY!,
        failurePage: `${window.location.origin}/kyc-failed`,
        pendingPage: `${window.location.origin}/kyc-pending`,
      });
    } catch (error) {
      console.error('KYC initiation failed:', error);
      alert('Failed to start KYC process. Please try again.');
    }
  };

  return <button onClick={handleKYC}>Start KYC Verification</button>;
}
```

### Example: Server-Side (Next.js API Route)

```typescript
// app/api/start-kyc/route.ts
import { ZKYCProcess } from '@zkyc/sdk';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { apiKey, failurePage, pendingPage } = await req.json();
  
  // Note: ZKYCProcess requires browser environment
  // For server-side, generate token and return redirect URL
  const platformUrl = process.env.PLATFORM_API_URL || 'https://your-platform.com';
  const tokenResponse = await fetch(`${platformUrl}/api/sdk-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apikey: apiKey }),
  });
  
  const { token } = await tokenResponse.json();
  const sdkUrl = `https://sdk.zkyc.tech/?apikey=${token}&failurePage=${encodeURIComponent(failurePage)}&pending=${encodeURIComponent(pendingPage)}`;
  
  return NextResponse.json({ redirectUrl: sdkUrl });
}
```

## Security Notes

**Secure**: API key never leaves your server - only tokens are passed to the SDK
**Time-limited**: Tokens expire after 10 minutes
**One-time use**: Tokens are marked as used after validation
**Server-side validation**: All token validation happens on the SDK server

## Migration from Direct API Key

If you were previously using direct API keys in the URL:

**Old (Insecure):**
```typescript
window.location.assign(`https://sdk.zkyc.tech/?apikey=${apiKey}&...`);
```

**New (Secure):**
```typescript
await ZKYCProcess({ apiKey, failurePage, pendingPage });
```

## Troubleshooting

### "Token generation failed"
- Check that your API key is valid and enabled
- Verify your platform API URL is correct
- Ensure your API key hasn't expired

### "Invalid or expired token"
- Tokens expire after 10 minutes
- Generate a new token for each KYC session

### CORS Errors
- Ensure your platform API allows requests from your domain
- Check that `/api/sdk-token` endpoint is accessible

## Support

For issues or questions, contact support@zkyc.tech

