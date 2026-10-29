import mongoose, { Schema, Document, Types } from 'mongoose';

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

export interface IItemDoc extends Document {
  household_id: Types.ObjectId;
  room_id: Types.ObjectId;
  container_id?: Types.ObjectId | null;
  name: string;
  normalized_name: string; // Stripped of accents and lowercased for fast duplicate checks
  category: CategoryKey;
  photo_url?: string | null;
  receipt_photo_url?: string | null;
  quantity: number;

  // Dressing lifecycle [CA-4.2, CA-4.6]
  dressing_status?: DressingStatus | null;
  resale_price?: number | null;
  clothing_type?: string | null;
  size?: string | null;
  season?: 'printemps_ete' | 'automne_hiver' | 'toute_saison' | null;

  // Optional finance, warranty & receipt fields [CA-6.3]
  purchase_price?: number | null;
  purchase_date?: Date | null;
  warranty_expiry?: Date | null;
  brand?: string | null;
  notes?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

const ItemSchema = new Schema<IItemDoc>(
  {
    household_id: {
      type: Schema.Types.ObjectId,
      ref: 'Household',
      required: true,
      index: true,
    },
    room_id: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
    container_id: {
      type: Schema.Types.ObjectId,
      ref: 'Container',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    normalized_name: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        'dressing_vetements',
        'meubles_deco',
        'electromenager',
        'vaisselle_cuisine',
        'hightech',
        'outils_bricolage',
        'loisirs_livres',
        'autre',
      ],
      required: true,
      index: true,
    },
    photo_url: {
      type: String,
      default: null,
    },
    receipt_photo_url: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    dressing_status: {
      type: String,
      enum: ['active', 'dormant', 'to_sell_or_donate'],
      default: null,
    },
    resale_price: {
      type: Number,
      default: null,
      min: 0,
    },
    clothing_type: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: null,
    },
    season: {
      type: String,
      enum: ['printemps_ete', 'automne_hiver', 'toute_saison'],
      default: null,
    },
    purchase_price: {
      type: Number,
      default: null,
      min: 0,
    },
    purchase_date: {
      type: Date,
      default: null,
    },
    warranty_expiry: {
      type: Date,
      default: null,
    },
    brand: {
      type: String,
      default: null,
      maxlength: 80,
    },
    notes: {
      type: String,
      default: null,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
ItemSchema.index({ household_id: 1, room_id: 1 });
ItemSchema.index({ household_id: 1, category: 1 });
ItemSchema.index({ household_id: 1, dressing_status: 1 });
ItemSchema.index({ household_id: 1, normalized_name: 1 });
ItemSchema.index({ name: 'text', brand: 'text', notes: 'text' });

export const Item = mongoose.model<IItemDoc>('Item', ItemSchema);
