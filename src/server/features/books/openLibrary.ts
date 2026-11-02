import type { ExternalBookInfo } from "#shared/books.ts";

export async function searchOpenLibrary(query: string): Promise<ExternalBookInfo[]> {
  const q = query.trim();
  if (!q) return [];
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=8&fields=title,author_name,cover_i,number_of_pages_median,first_publish_year,isbn`;
  const res = await fetch(url, { headers: { "User-Agent": "BecomingMe/1.0" } });
  if (!res.ok) return [];

  const data = (await res.json()) as { docs?: Array<Record<string, unknown>> };
  return (data.docs || []).map((d) => {
    const isbnArr = Array.isArray(d.isbn) ? (d.isbn as string[]) : [];
    const authorArr = Array.isArray(d.author_name) ? (d.author_name as string[]) : [];
    const coverI = d.cover_i as number | undefined;
    return {
      title: String(d.title || ""),
      author: authorArr.join(", "),
      totalPages: Number(d.number_of_pages_median) || 300,
      coverUrl: coverI
        ? `https://covers.openlibrary.org/b/id/${coverI}-L.jpg`
        : isbnArr[0]
          ? `https://covers.openlibrary.org/b/isbn/${isbnArr[0]}-L.jpg`
          : "",
      publishYear: d.first_publish_year ? String(d.first_publish_year) : undefined,
      isbn: isbnArr[0],
    };
  });
}

export async function lookupOpenLibraryIsbn(isbnRaw: string): Promise<ExternalBookInfo | null> {
  const cleaned = isbnRaw.trim().replace(/[^0-9X]/gi, "");
  if (!cleaned) return null;

  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${cleaned}&format=json&jscmd=data`;
  const res = await fetch(url, { headers: { "User-Agent": "BecomingMe/1.0" } });
  if (!res.ok) return null;

  const data = (await res.json()) as Record<string, any>;
  const item = data[`ISBN:${cleaned}`];
  if (!item) return null;

  const authors = Array.isArray(item.authors) ? item.authors.map((a: { name: string }) => a.name).join(", ") : "";
  const coverUrl =
    item.cover?.large || item.cover?.medium || `https://covers.openlibrary.org/b/isbn/${cleaned}-L.jpg`;

  return {
    title: String(item.title || ""),
    author: authors,
    totalPages: Number(item.number_of_pages) || 300,
    coverUrl,
    publishYear: item.publish_date ? String(item.publish_date) : undefined,
    isbn: cleaned,
    description: typeof item.description === "string" ? item.description : item.description?.value,
    quote: item.excerpts?.[0]?.text,
  };
}
