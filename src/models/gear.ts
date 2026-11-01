/** Gear records match the design from CST-391 Milestone 2. */
export interface GearItemInput {
  name: string;
  brand: string;
  categoryId: number;
  purchasePrice: number;
  purchaseDate: string | null;
  isAvailable: boolean;
  notes: string | null;
}

export interface GearItem extends GearItemInput {
  id: number;
  categoryName: string;
}

export interface GearCategory {
  id: number;
  name: string;
}

export interface GearFilter {
  search?: string;
  categoryId?: number;
  isAvailable?: boolean;
}
