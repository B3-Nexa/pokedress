import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Household, generateInviteCode, IHouseholdDoc } from '../models/household.model.js';
import { User, IUserDoc } from '../models/user.model.js';
import { seedDefaultRooms } from '../models/room.model.js';
import { Item } from '../models/item.model.js';
import { config } from '../config/env.js';

export class HouseholdService {
  /**
   * Register a new user, optionally joining an existing household [CA-5.1, CA-5.3, CA-5.4, CA-5.5, CA-5.6]
   */
  static async register(data: {
    email: string;
    name: string;
    password: string;
    invite_code?: string | null;
    household_name?: string | null;
  }): Promise<{ user: any; token: string; household: any }> {
    const existingUser = await User.findOne({ email: data.email.toLowerCase().trim() });
    if (existingUser) {
      throw new Error('Un compte existe déjà avec cette adresse email');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    let household: IHouseholdDoc;
    let role: 'owner' | 'member' = 'owner';

    if (data.invite_code && data.invite_code.trim().length > 0) {
      // Case-insensitive, space-tolerant code parsing [CA-5.4]
      const cleanCode = data.invite_code.trim().toUpperCase();
      const targetHousehold = await Household.findOne({ invite_code: cleanCode });

      if (!targetHousehold) {
        throw new Error('Ce code ne correspond à aucun foyer');
      }

      // Check max 2 members on free plan [CA-5.6]
      if (targetHousehold.plan === 'free') {
        const memberCount = await User.countDocuments({ household_id: targetHousehold._id });
        if (memberCount >= 2) {
          throw new Error(
            'Ce foyer est complet en version gratuite. Un passage en premium permet d’ajouter des membres.'
          );
        }
      }

      household = targetHousehold;
      role = 'member';
    } else {
      // Create new household with 6-char unique code [CA-5.1]
      let code = generateInviteCode();
      while (await Household.findOne({ invite_code: code })) {
        code = generateInviteCode();
      }

      household = await Household.create({
        name: data.household_name || `Chez ${data.name}`,
        invite_code: code,
        plan: 'free',
      });

      // Seed 5 default rooms for fresh onboarding [CA-2.5]
      await seedDefaultRooms(household._id);
    }

    const user = await User.create({
      household_id: household._id,
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      password_hash,
      role,
    });

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        householdId: household._id.toString(),
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      household: {
        id: household._id.toString(),
        name: household.name,
        invite_code: household.invite_code,
        plan: household.plan,
      },
      token,
    };
  }

  /**
   * Login user
   */
  static async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: any; token: string; household: any }> {
    const user = await User.findOne({ email: data.email.toLowerCase().trim() });
    if (!user) {
      throw new Error('Identifiants incorrects');
    }

    const isValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isValid) {
      throw new Error('Identifiants incorrects');
    }

    const household = await Household.findById(user.household_id);
    if (!household) {
      throw new Error('Foyer associé introuvable');
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        householdId: household._id.toString(),
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      household: {
        id: household._id.toString(),
        name: household.name,
        invite_code: household.invite_code,
        plan: household.plan,
      },
      token,
    };
  }

  /**
   * Get household info [CA-5.2]
   */
  static async getHousehold(householdId: Types.ObjectId | string): Promise<any> {
    const household = await Household.findById(householdId);
    if (!household) {
      throw new Error('Foyer non trouvé');
    }

    const members = await User.find({ household_id: householdId })
      .select('name email role createdAt')
      .lean();

    const itemCount = await Item.countDocuments({ household_id: householdId });

    return {
      id: household._id.toString(),
      name: household.name,
      invite_code: household.invite_code,
      plan: household.plan,
      item_count: itemCount,
      members: members.map((m) => ({
        id: m._id.toString(),
        name: m.name,
        email: m.email,
        role: m.role,
      })),
    };
  }
}
