import { Types } from 'mongoose';
import { Item } from '../models/item.model.js';
import { Room } from '../models/room.model.js';
import { Household } from '../models/household.model.js';

export class DashboardService {
  /**
   * Executive summary for household dashboard [CA-6.1, CA-6.2, CA-6.4, CA-6.7]
   */
  static async getDashboard(householdId: Types.ObjectId | string) {
    const household = await Household.findById(householdId);
    if (!household) {
      throw new Error('Foyer introuvable');
    }

    const items = await Item.find({ household_id: householdId }).lean();
    const rooms = await Room.find({ household_id: householdId }).sort({ order: 1 }).lean();

    // North Star Metric: 1 record = 1 item in counts [CA-2.3, CA-6.1]
    const totalItems = items.length;

    // Items by room (no percentage bar, shows raw count [CA-6.2])
    const itemsByRoom: Array<{
      room_id: string;
      name: string;
      icon: string;
      count: number;
    }> = rooms.map((room) => {
      const count = items.filter((i) => i.room_id.toString() === room._id.toString()).length;
      return {
        room_id: room._id.toString(),
        name: room.name,
        icon: room.icon,
        count,
      };
    });

    // Items by category
    const itemsByCategory: Record<string, number> = {};
    items.forEach((item) => {
      itemsByCategory[item.category] = (itemsByCategory[item.category] || 0) + 1;
    });

    // Dressing module lifecycle stats [CA-4.4, CA-4.6]
    const clothes = items.filter((i) => i.category === 'dressing_vetements');
    const dormantCount = clothes.filter((c) => c.dressing_status === 'dormant').length;
    const toSellClothes = clothes.filter((c) => c.dressing_status === 'to_sell_or_donate');
    const toSellCount = toSellClothes.length;
    const totalResaleValue = toSellClothes.reduce(
      (sum, item) => sum + (item.resale_price || 0),
      0
    );

    // Insurance value calculation [CA-6.4]
    const pricedItems = items.filter(
      (i) => typeof i.purchase_price === 'number' && i.purchase_price > 0
    );
    const totalInsuranceValue = pricedItems.reduce(
      (sum, item) => sum + (item.purchase_price || 0),
      0
    );

    // Pre-warning at 90 items [CA-6.7]
    const isFreePlan = household.plan === 'free';
    const show90Warning = isFreePlan && totalItems >= 90 && totalItems < 100;
    const remainingBeforeWall = isFreePlan ? Math.max(0, 100 - totalItems) : null;

    return {
      total_items: totalItems,
      total_value: Math.round(totalInsuranceValue * 100) / 100,
      value_items_count: pricedItems.length,
      items_by_room: itemsByRoom,
      items_by_category: itemsByCategory,
      dressing_stats: {
        total_clothes: clothes.length,
        dormant_count: dormantCount,
        to_sell_count: toSellCount,
        total_resale_value: Math.round(totalResaleValue * 100) / 100,
      },
      freemium: {
        plan: household.plan,
        is_capped: isFreePlan && totalItems >= 100,
        show_warning: show90Warning,
        remaining_items: remainingBeforeWall,
      },
    };
  }
}
