import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema, joinHouseholdSchema } from '../schemas/auth.schema.js';
import { HouseholdService } from '../services/household.service.js';
import { DashboardService } from '../services/dashboard.service.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await HouseholdService.register(validated);
      res.status(201).json(result);
    } catch (err: any) {
      if (err.message && err.message.includes('Ce code ne correspond')) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (err.message && err.message.includes('complet en version gratuite')) {
        res.status(403).json({ error: err.message });
        return;
      }
      if (err.message && err.message.includes('déjà avec cette adresse')) {
        res.status(409).json({ error: err.message });
        return;
      }
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await HouseholdService.login(validated);
      res.status(200).json(result);
    } catch (err: any) {
      if (err.message && err.message.includes('Identifiants incorrects')) {
        res.status(401).json({ error: err.message });
        return;
      }
      next(err);
    }
  }
}

export class DashboardController {
  static async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const householdId = req.user!.householdId;
      const data = await DashboardService.getDashboard(householdId);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getHousehold(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const householdId = req.user!.householdId;
      const data = await HouseholdService.getHousehold(householdId);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}
