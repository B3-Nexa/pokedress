import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { setupTestDb, teardownTestDb, clearTestDb } from '../setup.js';
import { Household } from '../../src/models/household.model.js';
import { Room } from '../../src/models/room.model.js';
import { Item } from '../../src/models/item.model.js';

describe('Fast-Add API Integration Tests [US1, CA-1.1, CA-1.2, CA-1.3, CA-6.5, CA-6.9]', () => {
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
      name: 'Chez Léa & Marc',
      invite_code: 'TEST01',
      plan: 'free',
    });
    householdId = household._id.toString();

    const room = await Room.create({
      household_id: household._id,
      name: 'Cuisine',
      icon: 'utensils',
    });
    roomId = room._id.toString();
  });

  it('should successfully create an item with only 3 mandatory fields [CA-1.1]', async () => {
    const start = Date.now();
    const res = await request(app)
      .post('/api/items')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123')
      .send({
        name: 'Grille-pain',
        room_id: roomId,
        category: 'electromenager',
      });
    const duration = Date.now() - start;

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Grille-pain');
    expect(res.body.category).toBe('electromenager');
    expect(res.body.quantity).toBe(1);
    expect(res.body.photo_url).toBeNull();
    expect(res.body.purchase_price).toBeNull();
    // Fast processing time
    expect(duration).toBeLessThan(500);
  });

  it('should reject creation when mandatory fields are missing [CA-1.2]', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123')
      .send({
        name: 'Grille-pain',
        // missing room_id and category
      });

    expect(res.status).toBe(400);
    expect(res.body.details).toHaveProperty('room_id');
    expect(res.body.details.room_id).toBe('La pièce est obligatoire');
  });

  it('should enforce name length between 2 and 100 chars [CA-1.3]', async () => {
    const resTooShort = await request(app)
      .post('/api/items')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123')
      .send({
        name: 'G',
        room_id: roomId,
        category: 'electromenager',
      });

    expect(resTooShort.status).toBe(400);
    expect(resTooShort.body.details.name).toContain('au moins 2 caractères');

    const resTooLong = await request(app)
      .post('/api/items')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123')
      .send({
        name: 'a'.repeat(101),
        room_id: roomId,
        category: 'electromenager',
      });

    expect(resTooLong.status).toBe(400);
    expect(resTooLong.body.details.name).toContain('100 caractères');
  });

  it('should enforce 100-item ceiling on free tier with 403 UPGRADE_REQUIRED [CA-6.5]', async () => {
    // Seed 100 items directly
    const itemsToSeed = [];
    for (let i = 0; i < 100; i++) {
      itemsToSeed.push({
        household_id: householdId,
        room_id: roomId,
        name: `Objet ${i}`,
        normalized_name: `objet ${i}`,
        category: 'autre',
        quantity: 1,
      });
    }
    await Item.insertMany(itemsToSeed);

    const count = await Item.countDocuments({ household_id: householdId });
    expect(count).toBe(100);

    // Attempting 101st item
    const res = await request(app)
      .post('/api/items')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123')
      .send({
        name: 'Objet 101',
        room_id: roomId,
        category: 'autre',
      });

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('UPGRADE_REQUIRED');
  });

  it('should return 401 when unauthenticated [CA-0.2]', async () => {
    const res = await request(app).post('/api/items').send({
      name: 'Grille-pain',
      room_id: roomId,
      category: 'electromenager',
    });

    expect(res.status).toBe(401);
  });
});
