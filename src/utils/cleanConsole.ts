// Utility to completely remove console logs for production performance
export const cleanConsoleOutput = () => {
  // Remove all console methods for better performance
  const noop = () => {};
  console.log = noop;
  console.warn = noop;
  console.error = noop;
  console.info = noop;
  console.debug = noop;
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