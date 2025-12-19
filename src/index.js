import CryptoJS from "crypto-js";

/**
 * Redirects user to ZKYC verification
 * @param {string} Key
 * @param {string} failurePage
 * @param {string} pendingPage
 */
export function ZKYCProcess(Key, failurePage, pendingPage) {
  if (!Key || !failurePage || !pendingPage) {
    throw new Error("Key, failurePage and pendingPage are required");
  }

  const SECRET = "test_2f89ab38659ab64a8715632d849d0b043b89793d7b6a7979";

  const encryptedKey = CryptoJS.AES.encrypt(Key, SECRET).toString();

  const url =
    "https://sdk.zkyc.tech/?" +
    "Key=" + encodeURIComponent(encryptedKey) +
    "&failurePage=" + encodeURIComponent(failurePage) +
    "&pending=" + encodeURIComponent(pendingPage);

  window.location.assign(url);
}

export default ZKYCProcess;
