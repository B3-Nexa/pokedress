import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { setupTestDb, teardownTestDb, clearTestDb } from '../setup.js';
import { Household } from '../../src/models/household.model.js';
import { Room } from '../../src/models/room.model.js';
import { Item } from '../../src/models/item.model.js';

describe('Household Subscription API Integration Tests [004-fake-payment-subscription]', () => {
  let householdId: string;
  let roomId: string;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();

    const household = await Household.create({
      name: 'Foyer Martin',
      invite_code: 'SUB001',
      plan: 'free',
    });
    householdId = household._id.toString();

    const room = await Room.create({
      household_id: household._id,
      name: 'Salon',
      icon: 'door',
      order: 1,
    });
    roomId = room._id.toString();
  });

  it('should upgrade household from free to premium plan', async () => {
    const res = await request(app)
      .post('/api/household/subscription')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user1')
      .send({
        plan: 'premium',
        billing_cycle: 'yearly',
      });

    expect(res.status).toBe(200);
    expect(res.body.plan).toBe('premium');

    const updated = await Household.findById(householdId);
    expect(updated?.plan).toBe('premium');
  });

  it('should reject invalid subscription plan', async () => {
    const res = await request(app)
      .post('/api/household/subscription')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user1')
      .send({
        plan: 'super_vip',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should allow adding item beyond 100 once on premium plan', async () => {
    // Upgrade to premium
    await request(app)
      .post('/api/household/subscription')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user1')
      .send({ plan: 'premium' });

    // Seed 100 dummy items
    const dummyItems = [];
    for (let i = 0; i < 100; i++) {
      dummyItems.push({
        household_id: householdId,
        room_id: roomId,
        name: `Objet ${i}`,
        normalized_name: `objet ${i}`,
        category: 'autre',
        quantity: 1,
      });
    }
    await Item.insertMany(dummyItems);

    // Attempt to add 101st item
    const res = await request(app)
      .post('/api/items')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user1')
      .send({
        name: 'Objet 101',
        room_id: roomId,
        category: 'autre',
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Objet 101');
  });
});
