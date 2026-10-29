import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IContainerDoc extends Document {
  household_id: Types.ObjectId;
  room_id: Types.ObjectId;
  name: string;
  type: 'furniture' | 'box' | 'wardrobe' | 'drawer';
  createdAt: Date;
  updatedAt: Date;
}

const ContainerSchema = new Schema<IContainerDoc>(
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
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    type: {
      type: String,
      enum: ['furniture', 'box', 'wardrobe', 'drawer'],
      default: 'furniture',
    },
  },
  {
    timestamps: true,
  }
);

ContainerSchema.index({ household_id: 1, room_id: 1 });

export const Container = mongoose.model<IContainerDoc>('Container', ContainerSchema);
