import { Request, Response, NextFunction } from 'express';
import { fastAddItemSchema, updateItemSchema } from '../schemas/item.schema.js';
import { ItemService, UpgradeRequiredError, NotFoundError } from '../services/item.service.js';
import { DuplicateService } from '../services/duplicate.service.js';

export class ItemController {
  static async createItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const householdId = req.user!.householdId;
      const validated = fastAddItemSchema.parse(req.body);

      // If photo was uploaded via multipart, attach its URL
      if (req.file) {
        validated.photo_url = `/uploads/${req.file.filename}`;
      }

      const item = await ItemService.createItem(householdId, validated);
      res.status(201).json(item);
    } catch (err: any) {
      if (err instanceof UpgradeRequiredError) {
        res.status(403).json({
          code: 'UPGRADE_REQUIRED',
          error: err.message,
        });
        return;
      }
      if (err instanceof NotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      next(err);
    }
  }

  static async uploadPhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Aucun fichier fourni' });
        return;
      }
      const photo_url = `/uploads/${req.file.filename}`;
      res.status(200).json({ photo_url });
    } catch (err) {
      next(err);
    }
  }

  static async checkDuplicates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const householdId = req.user!.householdId;
      const name = (req.query.name as string) || '';
      const duplicates = await DuplicateService.checkDuplicates(householdId, name);
      res.status(200).json(duplicates);
    } catch (err) {
      next(err);
    }
  }

  static async getItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const householdId = req.user!.householdId;
      const { room_id, category, dressing_status, search } = req.query;

      const items = await ItemService.getItems(householdId, {
        room_id: room_id as string,
        category: category as string,
        dressing_status: dressing_status as string,
        search: search as string,
      });

      res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  }

  static async getItemById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const householdId = req.user!.householdId;
      const item = await ItemService.getItemById(householdId, req.params.id);

      if (!item) {
        // Return 404 for missing items or cross-household access [CA-0.1]
        res.status(404).json({ error: 'Objet introuvable' });
        return;
      }

      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  }

  static async updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const householdId = req.user!.householdId;
      const validated = updateItemSchema.parse(req.body);

      const item = await ItemService.updateItem(householdId, req.params.id, validated);
      res.status(200).json(item);
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      next(err);
    }
  }

  static async deleteItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const householdId = req.user!.householdId;
      await ItemService.deleteItem(householdId, req.params.id);
      res.status(204).send();
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      next(err);
    }
  }
}
