import type { GearFilter, GearItemInput } from '../models/gear';

export class BadRequest extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequest';
  }
}

export function parseId(value: string): number {
  const id = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id < 1) {
    throw new BadRequest('ID must be a positive whole number.');
  }
  return id;
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function parseGearInput(body: unknown): GearItemInput {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequest('Send a JSON object containing the equipment fields.');
  }
  const data = body as Record<string, unknown>;
  const name = data.name;
  const brand = data.brand;
  const categoryId = data.categoryId;
  const purchasePrice = data.purchasePrice;
  const purchaseDate = data.purchaseDate ?? null;
  const isAvailable = data.isAvailable;
  const notes = data.notes ?? null;

  if (typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 120) {
    throw new BadRequest('name is required and must be at most 120 characters.');
  }
  if (typeof brand !== 'string' || brand.trim().length === 0 || brand.trim().length > 80) {
    throw new BadRequest('brand is required and must be at most 80 characters.');
  }
  if (typeof categoryId !== 'number' || !Number.isSafeInteger(categoryId) || categoryId < 1) {
    throw new BadRequest('categoryId must be a positive whole number.');
  }
  if (typeof purchasePrice !== 'number' || !Number.isFinite(purchasePrice) || purchasePrice < 0 || purchasePrice > 99999999.99) {
    throw new BadRequest('purchasePrice must be a nonnegative number.');
  }
  if (purchaseDate !== null && (typeof purchaseDate !== 'string' || !validDate(purchaseDate))) {
    throw new BadRequest('purchaseDate must be null or YYYY-MM-DD.');
  }
  if (typeof isAvailable !== 'boolean') {
    throw new BadRequest('isAvailable must be true or false.');
  }
  if (notes !== null && (typeof notes !== 'string' || notes.length > 5000)) {
    throw new BadRequest('notes must be null or a string up to 5000 characters.');
  }
  return {
    name: name.trim(), brand: brand.trim(), categoryId, purchasePrice,
    purchaseDate: purchaseDate as string | null, isAvailable,
    notes: notes as string | null
  };
}

export function parseFilters(query: Record<string, unknown>): GearFilter {
  const result: GearFilter = {};
  if (query.search !== undefined) {
    if (typeof query.search !== 'string' || query.search.length > 120) throw new BadRequest('Invalid search.');
    result.search = query.search;
  }
  if (query.categoryId !== undefined) {
    if (typeof query.categoryId !== 'string') throw new BadRequest('Invalid categoryId.');
    result.categoryId = parseId(query.categoryId);
  }
  if (query.available !== undefined) {
    if (query.available !== 'true' && query.available !== 'false') {
      throw new BadRequest('available must be true or false.');
    }
    result.isAvailable = query.available === 'true';
  }
  return result;
}
