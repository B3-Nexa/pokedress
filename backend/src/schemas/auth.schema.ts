import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string({ required_error: "L'adresse email est obligatoire" })
    .email('Adresse email invalide'),
  name: z
    .string({ required_error: 'Le nom est obligatoire' })
    .trim()
    .min(2, 'Le nom doit comporter au moins 2 caractères'),
  password: z
    .string({ required_error: 'Le mot de passe est obligatoire' })
    .min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
  invite_code: z.string().trim().optional().nullable(),
  household_name: z.string().trim().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est obligatoire'),
});

export const joinHouseholdSchema = z.object({
  invite_code: z
    .string({ required_error: "Le code d'invitation est obligatoire" })
    .trim()
    .min(1, "Le code d'invitation est obligatoire"),
});
