import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRoomDoc extends Document {
  household_id: Types.ObjectId;
  name: string;
  icon: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_ROOMS = [
  { name: 'Salon', icon: 'sofa', order: 1 },
  { name: 'Cuisine', icon: 'utensils', order: 2 },
  { name: 'Chambre', icon: 'bed', order: 3 },
  { name: 'Salle de bain', icon: 'bath', order: 4 },
  { name: 'Cave/Garage', icon: 'warehouse', order: 5 },
];

const RoomSchema = new Schema<IRoomDoc>(
  {
    household_id: {
      type: Schema.Types.ObjectId,
      ref: 'Household',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    icon: {
      type: String,
      default: 'door',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

RoomSchema.index({ household_id: 1, order: 1 });

export const Room = mongoose.model<IRoomDoc>('Room', RoomSchema);

export async function seedDefaultRooms(householdId: Types.ObjectId | string): Promise<IRoomDoc[]> {
  const roomsToInsert = DEFAULT_ROOMS.map((r) => ({
    household_id: householdId,
    name: r.name,
    icon: r.icon,
    order: r.order,
  }));
  return Room.insertMany(roomsToInsert) as unknown as Promise<IRoomDoc[]>;
}
