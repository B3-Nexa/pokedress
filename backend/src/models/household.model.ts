import mongoose, { Schema, Document } from 'mongoose';

export interface IHouseholdDoc extends Document {
  name: string;
  invite_code: string;
  plan: 'free' | 'premium';
  createdAt: Date;
  updatedAt: Date;
}

export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars like 0, O, 1, I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const HouseholdSchema = new Schema<IHouseholdDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    invite_code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 6,
      maxlength: 6,
    },
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },
  },
  {
    timestamps: true,
  }
);

export const Household = mongoose.model<IHouseholdDoc>('Household', HouseholdSchema);
