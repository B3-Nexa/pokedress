import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { setupTestDb, teardownTestDb, clearTestDb } from '../setup.js';
import { Household } from '../../src/models/household.model.js';
import { Room } from '../../src/models/room.model.js';
import { Item } from '../../src/models/item.model.js';

describe('Dressing Category & Wardrobe Lifecycle API Tests [US4, CA-4.2, CA-4.3, CA-4.4, CA-4.5, CA-4.6]', () => {
  let householdId: string;
  let chambreId: string;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();

    const household = await Household.create({
      name: 'Chez Sarah',
      invite_code: 'SARAH1',
    });
    householdId = household._id.toString();

    const chambre = await Room.create({
      household_id: household._id,
      name: 'Chambre',
      icon: 'bed',
    });
    chambreId = chambre._id.toString();
  });

  it('should default dressing_status to active for clothes [CA-4.2]', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123')
      .send({
        name: 'Pull cachemire noir',
        room_id: chambreId,
        category: 'dressing_vetements',
      });

    expect(res.status).toBe(201);
    expect(res.body.dressing_status).toBe('active');
  });

  it('should not assign dressing fields to non-clothes [CA-4.3]', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123')
      .send({
        name: 'Perceuse Bosch',
        room_id: chambreId,
        category: 'outils_bricolage',
        dressing_status: 'dormant',
      });

    expect(res.status).toBe(201);
    expect(res.body.dressing_status).toBeNull();
  });

  it('should filter dormant clothes and toggle status to to_sell_or_donate with resale_price [CA-4.4, CA-4.5, CA-4.6]', async () => {
    const item = await Item.create({
      household_id: householdId,
      room_id: chambreId,
      name: 'Robe d’été fleurie',
      normalized_name: 'robe d’ete fleurie',
      category: 'dressing_vetements',
      dressing_status: 'dormant',
    });

    // Filter dormant
    const filterRes = await request(app)
      .get('/api/items?category=dressing_vetements&dressing_status=dormant')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123');

    expect(filterRes.status).toBe(200);
    expect(filterRes.body.length).toBe(1);
    expect(filterRes.body[0].name).toBe('Robe d’été fleurie');

    // 1-click update to 'to_sell_or_donate' with resale_price 25€ [CA-4.5, CA-4.6]
    const updateRes = await request(app)
      .patch(`/api/items/${item._id}`)
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123')
      .send({
        dressing_status: 'to_sell_or_donate',
        resale_price: 25,
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.dressing_status).toBe('to_sell_or_donate');
    expect(updateRes.body.resale_price).toBe(25);
  });
});
