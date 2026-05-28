export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; delay?: number } = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000 } = options;
  let lastError: unknown;
  // Sequential retry by design — each attempt waits for the previous to fail
  // eslint-disable-next-line react-doctor/async-await-in-loop
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // eslint-disable-next-line react-doctor/async-await-in-loop, no-await-in-loop
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        // eslint-disable-next-line react-doctor/async-await-in-loop, no-await-in-loop
        await sleep(delay * attempt);
      }
    }
  }
  throw lastError;
}
