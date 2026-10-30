export type CategoryKey =
  | 'dressing_vetements'
  | 'meubles_deco'
  | 'electromenager'
  | 'vaisselle_cuisine'
  | 'hightech'
  | 'outils_bricolage'
  | 'loisirs_livres'
  | 'autre';

export type DressingStatus = 'active' | 'dormant' | 'to_sell_or_donate';

export interface Item {
  id: string;
  _id?: string;
  household_id: string;
  room_id: string;
  room_name?: string;
  container_id?: string | null;
  name: string;
  category: CategoryKey;
  photo_url?: string | null;
  receipt_photo_url?: string | null;
  quantity: number;

  dressing_status?: DressingStatus | null;
  resale_price?: number | null;
  clothing_type?: string | null;
  size?: string | null;
  season?: 'printemps_ete' | 'automne_hiver' | 'toute_saison' | null;

  purchase_price?: number | null;
  purchase_date?: string | null;
  warranty_expiry?: string | null;
  brand?: string | null;
  notes?: string | null;
  createdAt?: string;
}

export interface Room {
  id: string;
  _id?: string;
  name: string;
  icon: string;
  order: number;
  item_count: number;
}

export interface Household {
  id: string;
  name: string;
  invite_code: string;
  plan: 'free' | 'premium';
  item_count?: number;
  members?: Array<{ id: string; name: string; email: string; role: string }>;
}

export interface DashboardData {
  total_items: number;
  total_value: number;
  value_items_count: number;
  items_by_room: Array<{ room_id: string; name: string; icon: string; count: number }>;
  items_by_category: Record<string, number>;
  dressing_stats: {
    total_clothes: number;
    dormant_count: number;
    to_sell_count: number;
    total_resale_value: number;
  };
  freemium: {
    plan: 'free' | 'premium';
    is_capped: boolean;
    show_warning: boolean;
    remaining_items: number | null;
  };
}

export const CATEGORY_LABELS: Record<CategoryKey, { label: string; icon: string }> = {
  dressing_vetements: { label: 'Dressing & Vêtements', icon: 'shirt' },
  meubles_deco: { label: 'Meubles & Déco', icon: 'armchair' },
  electromenager: { label: 'Électroménager', icon: 'refrigerator' },
  vaisselle_cuisine: { label: 'Vaisselle & Cuisine', icon: 'utensils' },
  hightech: { label: 'High-Tech', icon: 'tv' },
  outils_bricolage: { label: 'Bricolage & Outils', icon: 'wrench' },
  loisirs_livres: { label: 'Loisirs & Livres', icon: 'book' },
  autre: { label: 'Autre', icon: 'package' },
};

export const CLOTHING_TYPES = [
  'Haut / T-shirt / Chemise',
  'Pantalon / Jeans',
  'Pull / Sweat / Gilet',
  'Robe / Combinaison',
  'Veste / Manteau',
  'Chaussures / Baskets',
  'Sous-vêtements / Nuit',
  'Accessoires / Sacs',
  'Autre pièce',
] as const;

export const CLOTHING_SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '34',
  '36',
  '38',
  '40',
  '42',
  '44',
  'Unique',
] as const;

export const SEASON_OPTIONS: Array<{ value: 'toute_saison' | 'printemps_ete' | 'automne_hiver'; label: string }> = [
  { value: 'toute_saison', label: 'Toute l’année' },
  { value: 'printemps_ete', label: 'Printemps / Été' },
  { value: 'automne_hiver', label: 'Automne / Hiver' },
];

export const DRESSING_STATUS_OPTIONS: Array<{ value: DressingStatus; label: string; description: string }> = [
  { value: 'active', label: 'Porté régulièrement (Actif)', description: 'Fait partie de votre rotation actuelle' },
  { value: 'dormant', label: 'Dormant (au placard)', description: 'Non porté depuis plus de 6 mois' },
  { value: 'to_sell_or_donate', label: 'À donner ou revendre', description: 'Prêt pour Vinted, dons ou vide-dressing' },
];
