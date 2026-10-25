export interface IsbnBookData {
  title: string;
  author: string;
  totalPages: number;
  coverUrl: string;
  quote?: string;
  description?: string;
  publishYear?: string;
}

/**
 * Normalizes an ISBN string to pure alphanumeric digits (handles ISBN-10 with 'X').
 * Strips common prefixes like 'ISBN:', 'ISBN-13:', 'ISBN 10:', dashes, and spaces.
 */
export const normalizeIsbn = (isbn: string): string => {
  let cleaned = isbn.trim().replace(/^isbn(?:[\s-]*1[03])?:?\s*/i, '');
  cleaned = cleaned.replace(/[^0-9X]/gi, '').toUpperCase();
  return cleaned;
};

/**
 * Performs a browser JSONP request (immune to browser CORS restrictions).
 */
const fetchJsonp = (url: string, callbackParam: string = 'callback'): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      return reject(new Error('JSONP only supported in browser environment'));
    }

    const callbackName = 'ol_cb_' + Math.round(1000000 * Math.random());
    const script = document.createElement('script');
    const separator = url.includes('?') ? '&' : '?';
    script.src = `${url}${separator}${callbackParam}=${callbackName}`;

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('ISBN lookup timed out'));
    }, 7000);

    const cleanup = () => {
      clearTimeout(timeout);
      delete (window as any)[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    (window as any)[callbackName] = (data: any) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP request failed'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Fetches book metadata and high-resolution cover art by ISBN.
 * Tries local Vite proxy first, then JSONP (CORS-free), then direct Open Library endpoints.
 */
export const lookupBookByIsbn = async (isbnRaw: string): Promise<IsbnBookData> => {
  const cleanIsbn = normalizeIsbn(isbnRaw);

  if (cleanIsbn.length !== 10 && cleanIsbn.length !== 13) {
    throw new Error('Please enter a valid 10 or 13-digit ISBN (e.g. 9780141439518).');
  }

  // 1. Try local server endpoint (/api/isbn proxy in Vite - 100% reliable, no browser CORS)
  try {
    const res = await fetch(`/api/isbn?isbn=${cleanIsbn}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        return {
          title: data.title,
          author: data.author || '',
          totalPages: Number(data.totalPages) || 300,
          coverUrl: data.coverUrl || `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`,
          quote: data.quote || '',
          description: data.description || '',
          publishYear: data.publishYear || '',
        };
      }
    }
  } catch (err) {
    console.warn('Local /api/isbn proxy failed, falling back to browser methods...', err);
  }

  // 2. Try Open Library JSONP (completely exempt from browser CORS policy)
  try {
    const data = await fetchJsonp(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`,
      'callback'
    );
    const bookData = data?.[`ISBN:${cleanIsbn}`];
    if (bookData && bookData.title) {
      const title = bookData.title || '';
      const author =
        bookData.authors?.map((a: { name: string }) => a.name).join(', ') || '';
      const totalPages = bookData.number_of_pages || 0;
      const coverUrl =
        bookData.cover?.large ||
        bookData.cover?.medium ||
        `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;

      const quote = bookData.excerpts?.[0]?.text || '';
      const description =
        typeof bookData.description === 'string'
          ? bookData.description
          : bookData.description?.value || '';

      return {
        title,
        author,
        totalPages: Number(totalPages) || 300,
        coverUrl,
        quote,
        description,
        publishYear: bookData.publish_date || '',
      };
    }
  } catch (err) {
    console.warn('Open Library JSONP failed, trying direct endpoint...', err);
  }

  // 3. Try direct Open Library ISBN endpoint (has CORS: * header)
  try {
    const res = await fetch(`https://openlibrary.org/isbn/${cleanIsbn}.json`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        let authorName = '';
        if (data.authors?.[0]?.key) {
          try {
            const authorRes = await fetch(`https://openlibrary.org${data.authors[0].key}.json`);
            if (authorRes.ok) {
              const authorData = await authorRes.json();
              authorName = authorData.name || '';
            }
          } catch {
            // Ignore author fetch failure
          }
        }

        const description =
          typeof data.description === 'string'
            ? data.description
            : data.description?.value || '';

        return {
          title: data.title || '',
          author: authorName,
          totalPages: Number(data.number_of_pages) || 300,
          coverUrl: `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`,
          description,
        };
      }
    }
  } catch (err) {
    console.warn('Open Library direct ISBN endpoint failed...', err);
  }

  throw new Error(`No book found for ISBN "${isbnRaw}". Check the number or enter details manually.`);
};
