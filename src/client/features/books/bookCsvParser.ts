import type { Book, BookFormat, BookStatus } from "#shared/books.ts";

export function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let insideQuotes = false;
  let i = 0;
  const len = text.length;

  while (i < len) {
    const char = text[i];
    if (insideQuotes) {
      if (char === '"') {
        if (i + 1 < len && text[i + 1] === '"') {
          currentField += '"';
          i += 2;
          continue;
        }
        insideQuotes = false;
        i++;
        continue;
      }
      currentField += char;
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = true;
      i++;
    } else if (char === ",") {
      currentRow.push(currentField.trim());
      currentField = "";
      i++;
    } else if (char === "\r") {
      if (i + 1 < len && text[i + 1] === "\n") i++;
      currentRow.push(currentField.trim());
      rows.push(currentRow);
      currentRow = [];
      currentField = "";
      i++;
    } else if (char === "\n") {
      currentRow.push(currentField.trim());
      rows.push(currentRow);
      currentRow = [];
      currentField = "";
      i++;
    } else {
      currentField += char;
      i++;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }
  return rows;
}

export function cleanIsbn(isbnRaw: string | undefined): string | undefined {
  if (!isbnRaw) return undefined;
  const digits = isbnRaw.replace(/[^0-9X]/gi, "");
  return digits.length === 10 || digits.length === 13 ? digits : undefined;
}

export function parseBookshelfCsv(csvContent: string): Omit<Book, "updatedAt">[] {
  const rows = parseCsvRows(csvContent);
  if (rows.length < 2 || !rows[0]) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const getCol = (names: string[]): number => {
    for (const name of names) {
      const idx = header.indexOf(name.toLowerCase());
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const titleCol = getCol(["title", "book title"]);
  const authorCol = getCol(["authors", "author"]);
  const isbnCol = getCol(["isbn", "isbn13", "isbn10"]);
  const pageCountCol = getCol(["page count", "pages", "number of pages"]);
  const pagesReadCol = getCol(["pages read", "current page"]);
  const readCol = getCol(["read", "status"]);
  const wishlistCol = getCol(["wishlist", "want to read"]);
  const ratingCol = getCol(["my rating", "rating"]);
  const reviewCol = getCol(["review", "notes"]);
  const quotesCol = getCol(["quotes", "favorite quotes"]);
  const descCol = getCol(["description"]);
  const formatCol = getCol(["format", "book format"]);
  const dateAddedCol = getCol(["date added", "date created", "date"]);

  if (titleCol === -1) return [];

  const books: Omit<Book, "updatedAt">[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0 || (row.length === 1 && !row[0])) continue;

    const title = titleCol !== -1 && row[titleCol] ? (row[titleCol] ?? "") : "";
    if (!title) continue;

    const author = authorCol !== -1 && row[authorCol] ? (row[authorCol] ?? "Unknown Author") : "Unknown Author";
    const isbnRaw = isbnCol !== -1 ? row[isbnCol] : undefined;
    const cleanedIsbn = cleanIsbn(isbnRaw);
    const totalPages = pageCountCol !== -1 && row[pageCountCol] ? parseInt(row[pageCountCol]!, 10) || 0 : 0;
    const pagesRead = pagesReadCol !== -1 && row[pagesReadCol] ? parseInt(row[pagesReadCol]!, 10) || 0 : 0;
    const isRead = readCol !== -1 && row[readCol] ? row[readCol]!.toLowerCase() : "";
    const isWishlist = wishlistCol !== -1 && row[wishlistCol] ? row[wishlistCol]!.toLowerCase() : "";
    const ratingRaw = ratingCol !== -1 && row[ratingCol] ? parseFloat(row[ratingCol]!) : NaN;
    const review = reviewCol !== -1 && row[reviewCol] ? row[reviewCol]! : "";
    const quotesRaw = quotesCol !== -1 && row[quotesCol] ? row[quotesCol]! : "";
    const description = descCol !== -1 && row[descCol] ? row[descCol]! : "";
    const formatRaw = formatCol !== -1 && row[formatCol] ? row[formatCol]!.toLowerCase() : "";
    const dateAdded = dateAddedCol !== -1 && row[dateAddedCol] ? row[dateAddedCol]!.trim() : undefined;

    let status: BookStatus = "want_to_read";
    if (isRead === "1" || isRead === "true" || isRead === "read" || (totalPages > 0 && pagesRead >= totalPages)) {
      status = "completed";
    } else if (pagesRead > 0) {
      status = "reading";
    } else if (isWishlist === "1" || isWishlist === "true") {
      status = "want_to_read";
    }

    let format: BookFormat = "physical";
    if (formatRaw.includes("audio")) {
      format = "audiobook";
    } else if (formatRaw.includes("ebook") || formatRaw.includes("kindle") || formatRaw.includes("epub")) {
      format = "ebook";
    }

    let rating: number | undefined;
    if (!isNaN(ratingRaw) && ratingRaw > 0) {
      rating = Math.min(5, Math.max(1, Math.round(ratingRaw)));
    }

    const favoriteQuotes: string[] = [];
    if (quotesRaw) {
      const splitQuotes = quotesRaw.split(/\n\s*\n/).map((q) => q.trim()).filter(Boolean);
      favoriteQuotes.push(...(splitQuotes.length > 0 ? splitQuotes : [quotesRaw.trim()]));
    }

    let notes = "";
    if (review && description) notes = `${review}\n\n---\n${description}`;
    else if (review) notes = review;
    else if (description) notes = description;

    const coverUrl = cleanedIsbn ? `https://covers.openlibrary.org/b/isbn/${cleanedIsbn}-L.jpg` : undefined;

    books.push({
      id: crypto.randomUUID(),
      title,
      author,
      status,
      format,
      totalPages,
      currentPage: Math.min(pagesRead, totalPages || pagesRead),
      rating,
      coverUrl,
      startDate: status === "reading" ? dateAdded : undefined,
      finishDate: status === "completed" ? dateAdded : undefined,
      favoriteQuotes: favoriteQuotes.length > 0 ? favoriteQuotes : undefined,
      notes: notes || undefined,
    });
  }

  return books;
}
