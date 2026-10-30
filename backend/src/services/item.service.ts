import { Types } from 'mongoose';
import { Item, IItemDoc, normalizeText } from '../models/item.model.js';
import { Room } from '../models/room.model.js';
import { Household } from '../models/household.model.js';

export class UpgradeRequiredError extends Error {
  code = 'UPGRADE_REQUIRED';
  constructor(message = 'Le plafond de 100 objets de la version gratuite est atteint') {
    super(message);
    this.name = 'UpgradeRequiredError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Ressource non trouvée') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ItemService {
  /**
   * Fast-Add item [CA-1.1, CA-1.2, CA-1.3, CA-6.5, CA-6.9]
   */
  static async createItem(
    householdId: Types.ObjectId | string,
    data: any
  ): Promise<IItemDoc> {
    const household = await Household.findById(householdId);
    if (!household) {
      throw new NotFoundError('Foyer non trouvé');
    }

    // Enforce 100-item ceiling on free tier with concurrency safety [CA-6.5, CA-6.9]
    if (household.plan === 'free') {
      const currentCount = await Item.countDocuments({ household_id: householdId });
      if (currentCount >= 100) {
        throw new UpgradeRequiredError(
          'Cap des 100 objets atteint en version gratuite. Passez en premium pour ajouter des objets illimités.'
        );
      }
    }

    // Validate that room belongs to household [CA-0.1]
    const room = await Room.findOne({ _id: data.room_id, household_id: householdId });
    if (!room) {
      throw new NotFoundError('La pièce indiquée n’existe pas dans ce foyer');
    }

    // Default dressing_status to 'active' for clothes if not specified [CA-4.2]
    let dressingStatus = data.dressing_status;
    if (data.category === 'dressing_vetements' && !dressingStatus) {
      dressingStatus = 'active';
    } else if (data.category !== 'dressing_vetements') {
      dressingStatus = null;
    }

    const item = new Item({
      household_id: householdId,
      room_id: data.room_id,
      container_id: data.container_id || null,
      name: data.name,
      normalized_name: normalizeText(data.name),
      category: data.category,
      photo_url: data.photo_url || null,
      receipt_photo_url: data.receipt_photo_url || null,
      quantity: data.quantity || 1, // 1 record = 1 item in counts [CA-2.3]
      dressing_status: dressingStatus,
      resale_price: data.category === 'dressing_vetements' ? data.resale_price || null : null,
      clothing_type: data.category === 'dressing_vetements' ? data.clothing_type || null : null,
      size: data.category === 'dressing_vetements' ? data.size || null : null,
      season: data.category === 'dressing_vetements' ? data.season || null : null,
      purchase_price: data.purchase_price || null,
      purchase_date: data.purchase_date ? new Date(data.purchase_date) : null,
      warranty_expiry: data.warranty_expiry ? new Date(data.warranty_expiry) : null,
      brand: data.brand || null,
      notes: data.notes || null,
    });

    return item.save();
  }

  /**
   * Query items with filters and search [CA-2.1, CA-2.2, CA-3.6, CA-3.7, CA-6.6]
   */
  static async getItems(
    householdId: Types.ObjectId | string,
    filters: {
      room_id?: string;
      category?: string;
      dressing_status?: string;
      search?: string;
    }
  ): Promise<any[]> {
    const query: any = { household_id: householdId };

    if (filters.room_id) {
      query.room_id = filters.room_id;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.dressing_status) {
      query.dressing_status = filters.dressing_status;
    }

    if (filters.search && filters.search.trim().length > 0) {
      // Escape regex special characters: "câble (HDMI" must not crash the query
      const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchTerm = escape(filters.search.trim());
      const normSearch = escape(normalizeText(filters.search));

      // Search also matches room names [CA-3.7]
      const matchingRooms = await Room.find({
        household_id: householdId,
        name: { $regex: new RegExp(normSearch, 'i') },
      }).select('_id');
      const matchingRoomIds = matchingRooms.map((r) => r._id);

      query.$or = [
        { normalized_name: { $regex: new RegExp(normSearch, 'i') } },
        { brand: { $regex: new RegExp(searchTerm, 'i') } },
        { room_id: { $in: matchingRoomIds } },
      ];
    }

    const items = await Item.find(query).sort({ createdAt: -1 }).lean();
    const rooms = await Room.find({ household_id: householdId }).lean();
    const roomMap = new Map(rooms.map((r) => [r._id.toString(), r.name]));

    return items.map((i) => ({
      ...i,
      id: i._id.toString(),
      room_name: roomMap.get(i.room_id.toString()) || 'Inconnu',
    }));
  }

  /**
   * Get item details [CA-0.1]
   */
  static async getItemById(
    householdId: Types.ObjectId | string,
    itemId: string
  ): Promise<any | null> {
    if (!Types.ObjectId.isValid(itemId)) {
      return null;
    }

    const item = await Item.findOne({
      _id: itemId,
      household_id: householdId,
    }).lean();

    if (!item) {
      return null;
    }

    const room = await Room.findById(item.room_id).lean();
    return {
      ...item,
      id: item._id.toString(),
      room_name: room ? room.name : 'Inconnu',
    };
  }

  /**
   * Update item [CA-4.5, CA-4.6, CA-6.3]
   */
  static async updateItem(
    householdId: Types.ObjectId | string,
    itemId: string,
    updates: any
  ): Promise<any> {
    if (!Types.ObjectId.isValid(itemId)) {
      throw new NotFoundError('Objet non trouvé');
    }

    const item = await Item.findOne({ _id: itemId, household_id: householdId });
    if (!item) {
      throw new NotFoundError('Objet non trouvé');
    }

    if (updates.name) {
      item.name = updates.name;
      item.normalized_name = normalizeText(updates.name);
    }
    if (updates.room_id) {
      const room = await Room.findOne({ _id: updates.room_id, household_id: householdId });
      if (!room) throw new NotFoundError('La pièce indiquée n’existe pas');
      item.room_id = updates.room_id;
    }
    if (updates.container_id !== undefined) item.container_id = updates.container_id;
    if (updates.category) item.category = updates.category;
    if (updates.photo_url !== undefined) item.photo_url = updates.photo_url;
    if (updates.receipt_photo_url !== undefined) item.receipt_photo_url = updates.receipt_photo_url;
    if (updates.quantity !== undefined) item.quantity = updates.quantity;
    if (updates.dressing_status !== undefined) item.dressing_status = updates.dressing_status;
    if (updates.resale_price !== undefined) item.resale_price = updates.resale_price;
    if (updates.clothing_type !== undefined) item.clothing_type = updates.clothing_type;
    if (updates.size !== undefined) item.size = updates.size;
    if (updates.season !== undefined) item.season = updates.season;
    if (updates.purchase_price !== undefined) item.purchase_price = updates.purchase_price;
    if (updates.purchase_date !== undefined) item.purchase_date = updates.purchase_date ? new Date(updates.purchase_date) : null;
    if (updates.warranty_expiry !== undefined) item.warranty_expiry = updates.warranty_expiry ? new Date(updates.warranty_expiry) : null;
    if (updates.brand !== undefined) item.brand = updates.brand;
    if (updates.notes !== undefined) item.notes = updates.notes;

    await item.save();
    return this.getItemById(householdId, itemId);
  }

  /**
   * Delete item [CA-6.8]
   */
  static async deleteItem(
    householdId: Types.ObjectId | string,
    itemId: string
  ): Promise<void> {
    if (!Types.ObjectId.isValid(itemId)) {
      throw new NotFoundError('Objet non trouvé');
    }

    const result = await Item.deleteOne({ _id: itemId, household_id: householdId });
    if (result.deletedCount === 0) {
      throw new NotFoundError('Objet non trouvé');
    }
  }
}
