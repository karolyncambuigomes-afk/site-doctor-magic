// Utility to completely remove console logs for production performance
export const cleanConsoleOutput = () => {
  // Only reduce noisy logs in production; keep errors and warnings for debugging
  if (!import.meta.env.PROD) return;
  const noop = () => {};
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  // Preserve console.warn and console.error
  console.trace = noop;
  console.group = noop;
  console.groupEnd = noop;
  console.table = noop;
  console.time = noop;
  console.timeEnd = noop;
};

// Initialize immediately in production builds
if (import.meta.env.PROD) {
  cleanConsoleOutput();
}