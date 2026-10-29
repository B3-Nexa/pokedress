import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserDoc extends Document {
  household_id: Types.ObjectId;
  email: string;
  name: string;
  password_hash: string;
  role: 'owner' | 'member';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    household_id: {
      type: Schema.Types.ObjectId,
      ref: 'Household',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    password_hash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'member'],
      default: 'member',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUserDoc>('User', UserSchema);
