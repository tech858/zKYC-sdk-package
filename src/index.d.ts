// src/index.d.ts

/**
 * @param id — the Shuftites session ID
 * @param Services — service name (e.g., "OCR"), or null/undefined if not needed
 * @param Key
 * @param failurePage — URL to redirect on failure
 * @param pendingPage
 */
export function ZKYCProcess(
  id: string,
  Key?: string | null,
  Services?: string | null,
  failurePage: string,
  pendingPage: string
): void;

/** Default-export convenience object */
declare const _default: { ZKYCProcess: typeof ZKYCProcess };
export default _default;
