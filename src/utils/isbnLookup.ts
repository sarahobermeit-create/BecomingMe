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
 */
export const normalizeIsbn = (isbn: string): string => {
  return isbn.replace(/[^0-9X]/gi, '').trim().toUpperCase();
};

/**
 * Fetches book metadata and high-resolution cover art by ISBN.
 * Queries Open Library as primary (free, reliable, CORS-enabled, no key needed)
 * with direct Open Library endpoints and Google Books as fallback.
 */
export const lookupBookByIsbn = async (isbnRaw: string): Promise<IsbnBookData> => {
  const cleanIsbn = normalizeIsbn(isbnRaw);

  if (cleanIsbn.length !== 10 && cleanIsbn.length !== 13) {
    throw new Error('Please enter a valid 10 or 13-digit ISBN.');
  }

  // 1. Try Open Library Data API (jscmd=data provides rich excerpts, author, and cover)
  try {
    const res = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`
    );
    if (res.ok) {
      const data = await res.json();
      const bookData = data[`ISBN:${cleanIsbn}`];
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
    }
  } catch (err) {
    console.warn('Open Library jscmd=data failed, trying fallback endpoints...', err);
  }

  // 2. Try Open Library direct ISBN endpoint
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

  // 3. Fallback to Google Books API (works in browser clients)
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`);
    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const vol = data.items[0].volumeInfo;
        const cover =
          vol.imageLinks?.thumbnail ||
          vol.imageLinks?.small ||
          vol.imageLinks?.medium ||
          vol.imageLinks?.large ||
          `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;

        return {
          title: vol.title || '',
          author: vol.authors?.join(', ') || '',
          totalPages: Number(vol.pageCount) || 300,
          coverUrl: cover.replace('http://', 'https://'),
          description: vol.description || '',
        };
      }
    }
  } catch (err) {
    console.warn('Google Books fallback failed...', err);
  }

  throw new Error(`No book found for ISBN "${isbnRaw}". Check the number or enter details manually.`);
};
