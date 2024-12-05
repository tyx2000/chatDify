const token = 'app-lGGZxOMnJsgI2Vb3IMUtf8UE';

interface FetchConfig extends RequestInit {
  timeout?: number;
  abortSignal?: boolean;
}

type FetchResult<T> = {
  result: T | null;
  error: Error | null;
};

const fetcher = async <T>(url: string, config: FetchConfig): Promise<FetchResult<T>> => {
  const { timeout = 30000, abortSignal = false, ...fetchConfig } = config;
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), timeout);

  let result: T | null = null,
    error: Error | null = null;
  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: abortSignal ? ac.signal : undefined,
    });

    if (!response.ok) {
      throw new Error('Http Error! Status: ' + response.status);
    }

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = (await response.blob()) as unknown as T;
    }

    return { result, error };
  } catch (err) {
    if (err instanceof Error) {
      error = err;
    } else {
      error = new Error('unexpected error occurred');
    }

    return { result, error };
  } finally {
    clearTimeout(id);
  }
};

export default fetcher;
