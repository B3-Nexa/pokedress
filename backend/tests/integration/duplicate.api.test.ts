import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { setupTestDb, teardownTestDb, clearTestDb } from '../setup.js';
import { Household } from '../../src/models/household.model.js';
import { Room } from '../../src/models/room.model.js';
import { Item } from '../../src/models/item.model.js';

describe('Duplicate Check & Search API Tests [US3, CA-3.1, CA-3.3, CA-3.5, CA-3.7]', () => {
  let householdId: string;
  let salonId: string;
  let caveId: string;

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
      invite_code: 'TEST03',
    });
    householdId = household._id.toString();

    const salon = await Room.create({
      household_id: household._id,
      name: 'Salon',
      icon: 'sofa',
    });
    salonId = salon._id.toString();

    const cave = await Room.create({
      household_id: household._id,
      name: 'Cave',
      icon: 'warehouse',
    });
    caveId = cave._id.toString();

    await Item.create([
      {
        household_id: household._id,
        room_id: salon._id,
        name: 'Rallonge 5m',
        normalized_name: 'rallonge 5m',
        category: 'outils_bricolage',
      },
      {
        household_id: household._id,
        room_id: cave._id,
        name: 'Perceuse sans fil',
        normalized_name: 'perceuse sans fil',
        category: 'outils_bricolage',
      },
    ]);
  });

  it('should detect duplicate on accent/case-insensitive query [CA-3.1, CA-3.3]', async () => {
    const res = await request(app)
      .get('/api/items/check-duplicates?name=rallonge')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Rallonge 5m');
    expect(res.body[0].room_name).toBe('Salon');
  });

  it('should return empty list when query is less than 2 chars [CA-3.5]', async () => {
    const res = await request(app)
      .get('/api/items/check-duplicates?name=r')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should match items by room name when searching globally [CA-3.7]', async () => {
    const res = await request(app)
      .get('/api/items?search=cave')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Perceuse sans fil');
    expect(res.body[0].room_name).toBe('Cave');
  });
});
