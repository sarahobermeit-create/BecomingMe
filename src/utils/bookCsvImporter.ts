import { Book, BookStatus } from '../types';

/**
 * Standard RFC-4180 CSV parser that properly handles multiline values,
 * escaped quotes (""), and commas inside quoted strings.
 */
export function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  let i = 0;
  const len = text.length;

  while (i < len) {
    const char = text[i];

    if (insideQuotes) {
      if (char === '"') {
        // Look ahead for escaped quote ("")
        if (i + 1 < len && text[i + 1] === '"') {
          currentField += '"';
          i += 2;
          continue;
        } else {
          // Closing quote
          insideQuotes = false;
          i++;
          continue;
        }
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
        i++;
        continue;
      } else if (char === '\r') {
        // Handle CRLF or standalone CR
        if (i + 1 < len && text[i + 1] === '\n') {
          i++;
        }
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        i++;
        continue;
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    }
  }

  // Push final field/row if anything remains
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Cleans an ISBN string to pure 10 or 13 digits.
 */
export function cleanIsbn(isbnRaw: string | undefined): string | undefined {
  if (!isbnRaw) return undefined;
  const digits = isbnRaw.replace(/[^0-9X]/gi, '');
  if (digits.length === 10 || digits.length === 13) {
    return digits;
  }
  return undefined;
}

/**
 * Parses a Bookshelf app CSV export into an array of Book objects.
 */
export function parseBookshelfCsv(csvContent: string): Book[] {
  const rows = parseCsvRows(csvContent);
  if (rows.length < 2) return [];

  // Map header row names (lowercased and trimmed) to indices
  const header = rows[0].map(h => h.trim().toLowerCase());

  const getCol = (possibleNames: string[]): number => {
    for (const name of possibleNames) {
      const idx = header.indexOf(name.toLowerCase());
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const idCol = getCol(['book id', 'id']);
  const titleCol = getCol(['title', 'book title']);
  const authorCol = getCol(['authors', 'author']);
  const isbnCol = getCol(['isbn', 'isbn13', 'isbn10']);
  const pageCountCol = getCol(['page count', 'pages', 'number of pages']);
  const pagesReadCol = getCol(['pages read', 'current page']);
  const readCol = getCol(['read', 'status']);
  const wishlistCol = getCol(['wishlist', 'want to read']);
  const ratingCol = getCol(['my rating', 'rating']);
  const reviewCol = getCol(['review', 'notes']);
  const quotesCol = getCol(['quotes', 'favorite quotes']);
  const descCol = getCol(['description']);
  const formatCol = getCol(['format', 'book format']);
  const dateAddedCol = getCol(['date added', 'date created', 'date']);

  if (titleCol === -1) {
    // If we can't find title, the CSV might be empty or invalid format
    return [];
  }

  const books: Book[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    // Skip empty or malformed rows
    if (row.length === 0 || (row.length === 1 && !row[0])) continue;

    const title = (titleCol !== -1 && row[titleCol]) ? row[titleCol] : '';
    if (!title) continue; // Must have at least a title

    const author = (authorCol !== -1 && row[authorCol]) ? row[authorCol] : 'Unknown Author';
    const isbnRaw = isbnCol !== -1 ? row[isbnCol] : undefined;
    const cleanedIsbn = cleanIsbn(isbnRaw);

    const totalPages = pageCountCol !== -1 ? parseInt(row[pageCountCol], 10) || 0 : 0;
    const pagesRead = pagesReadCol !== -1 ? parseInt(row[pagesReadCol], 10) || 0 : 0;
    const isRead = readCol !== -1 ? row[readCol] : '';
    const isWishlist = wishlistCol !== -1 ? row[wishlistCol] : '';
    const ratingRaw = ratingCol !== -1 ? parseFloat(row[ratingCol]) : NaN;
    const review = reviewCol !== -1 ? row[reviewCol] : '';
    const quotesRaw = quotesCol !== -1 ? row[quotesCol] : '';
    const description = descCol !== -1 ? row[descCol] : '';
    const formatRaw = formatCol !== -1 ? row[formatCol].toLowerCase() : '';
    const dateAdded = (dateAddedCol !== -1 && row[dateAddedCol]) ? row[dateAddedCol].trim() : undefined;

    // Determine status
    let status: BookStatus = 'want_to_read';
    if (isRead === '1' || isRead.toLowerCase() === 'true' || isRead.toLowerCase() === 'read' || (totalPages > 0 && pagesRead >= totalPages)) {
      status = 'completed';
    } else if (pagesRead > 0) {
      status = 'reading';
    } else if (isWishlist === '1' || isWishlist.toLowerCase() === 'true') {
      status = 'want_to_read';
    }

    // Determine format - default to physical for Bookshelf physical imports, or respect format field
    let format: 'physical' | 'ebook' | 'audiobook' = 'physical';
    if (formatRaw.includes('audio')) {
      format = 'audiobook';
    } else if (formatRaw.includes('ebook') || formatRaw.includes('kindle') || formatRaw.includes('epub')) {
      format = 'ebook';
    }

    // Rating (1-5)
    let rating: number | undefined = undefined;
    if (!isNaN(ratingRaw) && ratingRaw > 0) {
      rating = Math.min(5, Math.max(1, Math.round(ratingRaw)));
    }

    // Favorite quotes
    const favoriteQuotes: string[] = [];
    if (quotesRaw) {
      // Split by double newline or custom delimiter if present
      const splitQuotes = quotesRaw.split(/\n\s*\n/).map(q => q.trim()).filter(Boolean);
      if (splitQuotes.length > 0) {
        favoriteQuotes.push(...splitQuotes);
      } else {
        favoriteQuotes.push(quotesRaw.trim());
      }
    }

    // Combine review & description into notes if available
    let notes = '';
    if (review && description) {
      notes = `${review}\n\n---\n${description}`;
    } else if (review) {
      notes = review;
    } else if (description) {
      notes = description;
    }

    // Cover URL from Open Library if ISBN exists
    const coverUrl = cleanedIsbn 
      ? `https://covers.openlibrary.org/b/isbn/${cleanedIsbn}-L.jpg`
      : undefined;

    const bookId = (idCol !== -1 && row[idCol]) 
      ? `csv-${row[idCol]}` 
      : `csv-${Date.now()}-${r}-${Math.random().toString(36).substring(2, 7)}`;

    books.push({
      id: bookId,
      title,
      author,
      status,
      format,
      totalPages: totalPages || 0,
      currentPage: Math.min(pagesRead, totalPages || pagesRead),
      rating,
      coverUrl,
      startDate: status === 'reading' ? dateAdded : undefined,
      finishDate: status === 'completed' ? dateAdded : undefined,
      favoriteQuotes: favoriteQuotes.length > 0 ? favoriteQuotes : undefined,
      notes: notes || undefined,
    });
  }

  return books;
}
