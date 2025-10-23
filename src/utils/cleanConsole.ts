// Utility to selectively remove console logs for production performance
// SECURITY: Keep console.error and console.warn enabled for security monitoring
export const cleanConsoleOutput = () => {
  const noop = () => {};
  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.trace = noop;
  console.dir = noop;
  console.table = noop;
  console.group = noop;
  console.groupEnd = noop;
  console.groupCollapsed = noop;
  console.clear = noop;
  console.time = noop;
  console.timeEnd = noop;
  // Keep console.error and console.warn - critical for detecting security incidents
};

// Initialize immediately in production builds
if (import.meta.env.PROD) {
  cleanConsoleOutput();
}