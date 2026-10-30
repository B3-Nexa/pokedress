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

  static async updateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const householdId = req.user!.householdId;
      const { id } = req.params;
      const { name, icon } = req.body;

      if (!name || name.trim().length === 0) {
        res.status(400).json({ error: 'Le nom de la pièce est obligatoire' });
        return;
      }

      const room = await Room.findOne({ _id: id, household_id: householdId });
      if (!room) {
        res.status(404).json({ error: 'Pièce introuvable dans ce foyer' });
        return;
      }

      room.name = name.trim();
      if (icon !== undefined) {
        room.icon = icon;
      }
      await room.save();

      const itemsCount = await Item.countDocuments({ household_id: householdId, room_id: id });

      res.status(200).json({
        id: room._id.toString(),
        name: room.name,
        icon: room.icon,
        order: room.order,
        item_count: itemsCount,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const householdId = req.user!.householdId;
      const { id } = req.params;

      const room = await Room.findOne({ _id: id, household_id: householdId });
      if (!room) {
        res.status(404).json({ error: 'Pièce introuvable dans ce foyer' });
        return;
      }

      const itemsCount = await Item.countDocuments({ household_id: householdId, room_id: id });
      if (itemsCount > 0) {
        res.status(400).json({
          error: `Impossible de supprimer cette pièce car elle contient encore ${itemsCount} objet${itemsCount > 1 ? 's' : ''}. Veuillez d'abord déplacer ou supprimer ces objets.`,
        });
        return;
      }

      await Room.deleteOne({ _id: id, household_id: householdId });

      res.status(200).json({ message: 'Pièce supprimée avec succès' });
    } catch (err) {
      next(err);
    }
  }
}
