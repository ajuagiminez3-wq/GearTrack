import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database';
import type { GearCategory, GearFilter, GearItem, GearItemInput } from '../models/gear';

interface GearRow extends RowDataPacket, GearItem {}
interface CategoryRow extends RowDataPacket, GearCategory {}

const selection = `SELECT g.id, g.name, g.brand, g.category_id AS categoryId,
   c.name AS categoryName, g.purchase_price AS purchasePrice,
   DATE_FORMAT(g.purchase_date, '%Y-%m-%d') AS purchaseDate, g.is_available AS isAvailable,
   g.notes
 FROM gear_items g
 JOIN gear_categories c ON c.id = g.category_id`;

function normalize(row: GearRow): GearItem {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    purchasePrice: Number(row.purchasePrice),
    purchaseDate: row.purchaseDate,
    isAvailable: Boolean(row.isAvailable),
    notes: row.notes
  };
}

export async function findAll(filter: GearFilter): Promise<GearItem[]> {
  const where: string[] = [];
  const values: Array<string | number> = [];
  if (filter.search) {
    where.push('(g.name LIKE ? OR g.brand LIKE ?)');
    values.push(`%${filter.search}%`, `%${filter.search}%`);
  }
  if (filter.categoryId !== undefined) {
    where.push('g.category_id = ?');
    values.push(filter.categoryId);
  }
  if (filter.isAvailable !== undefined) {
    where.push('g.is_available = ?');
    values.push(filter.isAvailable ? 1 : 0);
  }
  const sql = selection + (where.length ? ` WHERE ${where.join(' AND ')}` : '') + ' ORDER BY g.id';
  const [rows] = await pool.query<GearRow[]>(sql, values);
  return rows.map(normalize);
}

export async function findById(id: number): Promise<GearItem | null> {
  const [rows] = await pool.query<GearRow[]>(selection + ' WHERE g.id = ?', [id]);
  return rows.length ? normalize(rows[0]) : null;
}

export async function create(item: GearItemInput): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO gear_items (name, brand, category_id, purchase_price, purchase_date, is_available, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [item.name, item.brand, item.categoryId, item.purchasePrice,
     item.purchaseDate, item.isAvailable ? 1 : 0, item.notes]
  );
  return result.insertId;
}

export async function update(id: number, item: GearItemInput): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE gear_items SET name = ?, brand = ?, category_id = ?, purchase_price = ?,
      purchase_date = ?, is_available = ?, notes = ? WHERE id = ?`,
    [item.name, item.brand, item.categoryId, item.purchasePrice,
     item.purchaseDate, item.isAvailable ? 1 : 0, item.notes, id]
  );
  return result.affectedRows > 0;
}

export async function remove(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM gear_items WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function findCategories(): Promise<GearCategory[]> {
  const [rows] = await pool.query<CategoryRow[]>('SELECT id, name FROM gear_categories ORDER BY name');
  return rows.map(row => ({id: row.id, name: row.name}));
}

export async function categoryExists(id: number): Promise<boolean> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM gear_categories WHERE id = ?', [id]);
  return rows.length > 0;
}
