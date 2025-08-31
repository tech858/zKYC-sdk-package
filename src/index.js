/**
 * @param {string} id - Unique user/session id
 * @param {string} Key
 * @param {string|null} Services - Service name (e.g., "OCR") or null
 * @param {string} failurePage - URL to redirect on failure
 * @param {string} pendingPage
 */
function ZKYCProcess(id, Key, Services , failurePage, pendingPage) {
  if (!id || !Key  || !failurePage|| !pendingPage) {
    throw new Error("You must pass id,Key,failurePage and pendingPage");
  }

  const url =
    `https://z-kyc-sdk.vercel.app/?id=${encodeURIComponent(id)}` +
    (Services ? `&Services=${encodeURIComponent(Services)}` : "") +
    `&Key=${encodeURIComponent(Key)}`+
    `&failurePage=${encodeURIComponent(failurePage)}`+
    `&pending=${encodeURIComponent(pendingPage)}`
    ;

  window.location.assign(url);
}

export { ZKYCProcess };           // ✅ named export
export default { ZKYCProcess }; 