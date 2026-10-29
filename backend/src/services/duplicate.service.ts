import { Types } from 'mongoose';
import { Item, normalizeText } from '../models/item.model.js';
import { Room } from '../models/room.model.js';

export function normalizeQuery(query: string): string {
  return normalizeText(query);
}

export function matchDuplicateSimilarity(query: string, targetNormalized: string): boolean {
  const normQuery = normalizeQuery(query);
  if (normQuery.length < 2) {
    return false;
  }
  return targetNormalized.includes(normQuery) || normQuery.includes(targetNormalized);
}

export interface DuplicateItemMatch {
  id: string;
  name: string;
  room_name: string;
  category: string;
  photo_url: string | null;
}

export class DuplicateService {
  /**
   * Search for potential duplicates within the household [CA-3.1, CA-3.3, CA-3.4, CA-3.5]
   */
  static async checkDuplicates(
    householdId: Types.ObjectId | string,
    rawName: string
  ): Promise<DuplicateItemMatch[]> {
    const normalized = normalizeQuery(rawName);
    if (!normalized || normalized.length < 2) {
      return [];
    }

    // Escape regex special characters
    const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');

    const items = await Item.find({
      household_id: householdId,
      normalized_name: { $regex: regex },
    })
      .limit(10)
      .lean();

    if (!items.length) {
      return [];
    }

    const roomIds = items.map((i) => i.room_id);
    const rooms = await Room.find({ _id: { $in: roomIds } }).lean();
    const roomMap = new Map(rooms.map((r) => [r._id.toString(), r.name]));

    return items.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      room_name: roomMap.get(item.room_id.toString()) || 'Inconnu',
      category: item.category,
      photo_url: item.photo_url || null,
    }));
  }
}
