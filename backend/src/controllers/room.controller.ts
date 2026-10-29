import { Request, Response, NextFunction } from 'express';
import { Room } from '../models/room.model.js';
import { Item } from '../models/item.model.js';

export class RoomController {
  static async getRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const householdId = req.user!.householdId;
      const rooms = await Room.find({ household_id: householdId }).sort({ order: 1 }).lean();
      const items = await Item.find({ household_id: householdId }).lean();

      const roomsWithCounts = rooms.map((room) => ({
        id: room._id.toString(),
        name: room.name,
        icon: room.icon,
        order: room.order,
        item_count: items.filter((i) => i.room_id.toString() === room._id.toString()).length,
      }));

      res.status(200).json(roomsWithCounts);
    } catch (err) {
      next(err);
    }
  }

  static async createRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const householdId = req.user!.householdId;
      const { name, icon } = req.body;

      if (!name || name.trim().length === 0) {
        res.status(400).json({ error: 'Le nom de la pièce est obligatoire' });
        return;
      }

      const count = await Room.countDocuments({ household_id: householdId });
      const room = await Room.create({
        household_id: householdId,
        name: name.trim(),
        icon: icon || 'door',
        order: count + 1,
      });

      res.status(201).json({
        id: room._id.toString(),
        name: room.name,
        icon: room.icon,
        order: room.order,
        item_count: 0,
      });
    } catch (err) {
      next(err);
    }
  }
}
