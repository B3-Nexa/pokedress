import { z } from 'zod';

export const categoryKeys = [
  'dressing_vetements',
  'meubles_deco',
  'electromenager',
  'vaisselle_cuisine',
  'hightech',
  'outils_bricolage',
  'loisirs_livres',
  'autre',
] as const;

export const dressingStatuses = ['active', 'dormant', 'to_sell_or_donate'] as const;

// multipart/form-data (Fast-Add with photo) sends every field as a string: "1" -> 1
const fromFormNumber = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v), schema);

export const fastAddItemSchema = z.object({
  name: z
    .string({ required_error: 'Le nom est obligatoire' })
    .trim()
    .min(2, 'Le nom doit comporter au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  room_id: z
    .string({ required_error: 'La pièce est obligatoire' })
    .min(1, 'La pièce est obligatoire'),
  category: z.enum(categoryKeys, {
    errorMap: () => ({ message: 'La catégorie est obligatoire et doit être valide' }),
  }),
  container_id: z.string().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  quantity: fromFormNumber(z.number().int().min(1, 'La quantité minimale est 1').default(1)),

  // Dressing optional fields [CA-4.1, CA-4.2, CA-4.6]
  dressing_status: z.enum(dressingStatuses).optional().nullable(),
  resale_price: fromFormNumber(
    z.number().min(0, 'Le prix de revente doit être positif ou nul').optional().nullable()
  ),
  clothing_type: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  season: z.enum(['printemps_ete', 'automne_hiver', 'toute_saison']).optional().nullable(),

  // Finance / Warranty optional fields [CA-6.3]
  purchase_price: fromFormNumber(
    z.number().min(0, 'Le prix d’achat doit être positif ou nul').optional().nullable()
  ),
  purchase_date: z.string().datetime().optional().nullable(),
  warranty_expiry: z.string().datetime().optional().nullable(),
  receipt_photo_url: z.string().optional().nullable(),
  brand: z.string().max(80).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export const updateItemSchema = fastAddItemSchema.partial();
