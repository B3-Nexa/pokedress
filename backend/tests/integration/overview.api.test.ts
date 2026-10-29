import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { setupTestDb, teardownTestDb, clearTestDb } from '../setup.js';
import { Household } from '../../src/models/household.model.js';
import { Room } from '../../src/models/room.model.js';
import { Item } from '../../src/models/item.model.js';

describe('Overview API Integration Tests [US2, CA-2.1, CA-2.2, CA-2.3, CA-2.5]', () => {
  let householdId: string;
  let salonId: string;
  let cuisineId: string;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();

    const household = await Household.create({
      name: 'Chez Léa & Marc',
      invite_code: 'TEST02',
    });
    householdId = household._id.toString();

    const salon = await Room.create({
      household_id: household._id,
      name: 'Salon',
      icon: 'sofa',
      order: 1,
    });
    salonId = salon._id.toString();

    const cuisine = await Room.create({
      household_id: household._id,
      name: 'Cuisine',
      icon: 'utensils',
      order: 2,
    });
    cuisineId = cuisine._id.toString();

    // Seed items
    await Item.create([
      {
        household_id: household._id,
        room_id: salon._id,
        name: 'Canapé 3 places',
        normalized_name: 'canape 3 places',
        category: 'meubles_deco',
        quantity: 1,
      },
      {
        household_id: household._id,
        room_id: cuisine._id,
        name: 'Verres en cristal',
        normalized_name: 'verres en cristal',
        category: 'vaisselle_cuisine',
        quantity: 6, // 1 record = 1 item [CA-2.3]
      },
    ]);
  });

  it('should list rooms with item count [CA-2.1]', async () => {
    const res = await request(app)
      .get('/api/rooms')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    const salon = res.body.find((r: any) => r.name === 'Salon');
    expect(salon.item_count).toBe(1);
    const cuisine = res.body.find((r: any) => r.name === 'Cuisine');
    expect(cuisine.item_count).toBe(1); // Verre x6 counts for 1 item [CA-2.3]
  });

  it('should filter items by category [CA-2.2]', async () => {
    const res = await request(app)
      .get('/api/items?category=vaisselle_cuisine')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Verres en cristal');
    expect(res.body[0].quantity).toBe(6);
  });
});
