import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface LinkItem {
  id: string;
  code: string;
  originalUrl: string;
  shortUrl?: string;
  clicks: number;
  createdAt: string;
  lastClickedAt?: string;
  title?: string;
  ownerEmail?: string;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "urls.json");

// Initial sample links if database is empty
const INITIAL_LINKS: LinkItem[] = [
  {
    id: "sample-1",
    code: "docs",
    originalUrl: "https://nextjs.org/docs",
    clicks: 142,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    lastClickedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    title: "Next.js Documentation",
  },
  {
    id: "sample-2",
    code: "github",
    originalUrl: "https://github.com",
    clicks: 89,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    lastClickedAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    title: "GitHub Platform",
  },
  {
    id: "sample-3",
    code: "forge",
    originalUrl: "https://tailwindcss.com",
    clicks: 326,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    lastClickedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    title: "Tailwind CSS Official",
  },
];

async function ensureDbExists(): Promise<void> {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(INITIAL_LINKS, null, 2), "utf-8");
  }
}

export async function getAllLinks(): Promise<LinkItem[]> {
  await ensureDbExists();
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error reading urls.json:", error);
    return [];
  }
}

export async function getLinkByCode(code: string): Promise<LinkItem | null> {
  const links = await getAllLinks();
  const normalized = code.trim().toLowerCase();
  return links.find((l) => l.code.toLowerCase() === normalized) || null;
}

function generateRandomCode(length: number = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}

export function normalizeUrl(inputUrl: string): string {
  let url = inputUrl.trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
}

export async function createLink(params: {
  url: string;
  customCode?: string;
  title?: string;
  ownerEmail?: string;
}): Promise<{ link: LinkItem; error?: string }> {
  const rawUrl = normalizeUrl(params.url);
  try {
    // Validate URL
    new URL(rawUrl);
  } catch {
    return {
      link: null as unknown as LinkItem,
      error: "Please enter a valid URL (e.g. https://example.com)",
    };
  }

  const links = await getAllLinks();

  // Check if the user has already shortened this URL
  const existingLink = links.find(
    (l) => l.originalUrl === rawUrl && l.ownerEmail === params.ownerEmail
  );

  if (existingLink) {
    const requestedCode = params.customCode?.trim().toLowerCase();
    // If no custom code was requested, or the requested code matches the existing one, return it directly.
    if (!requestedCode || requestedCode === existingLink.code) {
      return { link: existingLink };
    }
  }

  let code = "";
  if (params.customCode && params.customCode.trim()) {
    code = params.customCode
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "");

    if (code.length < 2) {
      return {
        link: null as unknown as LinkItem,
        error: "Custom slug must be at least 2 alphanumeric characters",
      };
    }

    // Reserved routes check
    const reserved = ["api", "favicon.ico", "data", "admin", "static", "_next", "dashboard"];
    if (reserved.includes(code)) {
      return {
        link: null as unknown as LinkItem,
        error: `The slug "${code}" is reserved by the system. Please choose another.`,
      };
    }

    const exists = links.some((l) => l.code.toLowerCase() === code);
    if (exists) {
      return {
        link: null as unknown as LinkItem,
        error: `The custom slug "${code}" is already in use. Please pick another.`,
      };
    }
  } else {
    // Generate unique random code
    let attempts = 0;
    do {
      code = generateRandomCode(6);
      attempts++;
    } while (
      links.some((l) => l.code.toLowerCase() === code) &&
      attempts < 15
    );
  }

  const newLink: LinkItem = {
    id: crypto.randomUUID(),
    code,
    originalUrl: rawUrl,
    clicks: 0,
    createdAt: new Date().toISOString(),
    title: params.title?.trim() || new URL(rawUrl).hostname,
    ownerEmail: params.ownerEmail,
  };

  links.unshift(newLink);
  await fs.mkdir(DB_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(links, null, 2), "utf-8");

  return { link: newLink };
}

export async function recordClick(code: string): Promise<LinkItem | null> {
  const links = await getAllLinks();
  const normalized = code.trim().toLowerCase();
  const index = links.findIndex((l) => l.code.toLowerCase() === normalized);

  if (index === -1) return null;

  links[index].clicks += 1;
  links[index].lastClickedAt = new Date().toISOString();

  await fs.writeFile(DB_FILE, JSON.stringify(links, null, 2), "utf-8");
  return links[index];
}

export async function deleteLink(code: string): Promise<boolean> {
  const links = await getAllLinks();
  const normalized = code.trim().toLowerCase();
  const filtered = links.filter((l) => l.code.toLowerCase() !== normalized);

  if (filtered.length === links.length) return false;

  await fs.writeFile(DB_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}
