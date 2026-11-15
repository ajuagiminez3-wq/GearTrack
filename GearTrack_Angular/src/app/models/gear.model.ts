export interface GearCategory { id: number; name: string; }
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
export interface GearFilters { search?: string; categoryId?: number; available?: boolean; }
export interface ApiMessage { message: string; id?: number; }
