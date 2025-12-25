/**
 * @zkyc/sdk - NPM Package Script
 * 
 * This is the script to include in your npm package.
 * Users will call ZKYCProcess() with their API key to generate a token
 * and redirect to the SDK.
 */

/**
 * Generates a secure token from the API key and redirects to the SDK
 * 
 * @param {Object} config - Configuration object containing API key and redirect URLs
 * @param {string} config.apiKey - Your zKYC API key (with test_ or prod_ prefix)
 * @param {string} config.failurePage - URL to redirect if KYC verification fails
 * @param {string} config.successPage - URL to redirect if KYC is pending
 * @param {string} [config.platformApiUrl] - Optional: Your platform API URL (defaults to production)
 * @returns {Promise<void>}
 * @throws {Error} if API key, failurePage, or pendingPage is missing
 * @throws {Error} if token generation fails
 */
async function ZKYCProcess(config) {
  const { apiKey, failurePage, successPage } = config;

  // Validate required parameters
  if (!apiKey || !failurePage || !successPage) {
    throw new Error("apiKey, failurePage, and successPage are required");
  }

  // Default to production platform API URL if not provided
  // Users should set this to their platform URL (e.g., https://api.zkyc.tech)
  const platformUrl = "https://app.zkyc.tech";
  const tokenEndpoint = `${platformUrl}/api/sdk-token`;

  try {
    // Generate token from API key (server-side call)
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apikey: apiKey }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(`Token generation failed: ${errorData.error || response.statusText}`);
    }

    const { token, expiresIn, expiresAt } = await response.json();

    if (!token) {
      throw new Error("Token generation failed: No token received");
    }

    // Build SDK URL with token
    const sdkUrl = new URL("https://sdk.zkyc.tech/");
    sdkUrl.searchParams.set("apikey", token); // SDK will detect it's a token
    sdkUrl.searchParams.set("failurePage", failurePage);
    sdkUrl.searchParams.set("pending", successPage);

    // Redirect to SDK
    if (typeof window !== "undefined") {
      window.location.assign(sdkUrl.toString());
    } else {
      throw new Error("ZKYCProcess can only be used in browser environment");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`ZKYC Process failed: ${error.message}`);
    }
    throw new Error("ZKYC Process failed: Unknown error");
  }
}

// ES Module exports (for modern bundlers and browsers)
export default ZKYCProcess;
export { ZKYCProcess };

