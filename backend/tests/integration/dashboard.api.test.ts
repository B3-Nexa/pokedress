import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { setupTestDb, teardownTestDb, clearTestDb } from '../setup.js';
import { Room } from '../../src/models/room.model.js';
import { Household } from '../../src/models/household.model.js';
import { Item } from '../../src/models/item.model.js';

describe('Dashboard & Freemium Metrics API Tests [US6, CA-0.1, CA-2.3, CA-6.1, CA-6.2, CA-6.4, CA-6.7]', () => {
  let householdId: string;
  let salonId: string;

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
      invite_code: 'TEST06',
      plan: 'free',
    });
    householdId = household._id.toString();

    const salon = await Room.create({
      household_id: household._id,
      name: 'Salon',
      icon: 'sofa',
    });
    salonId = salon._id.toString();

    // 10 items: 4 with price, 1 with quantity 6 [CA-6.4, CA-2.3]
    await Item.create([
      { household_id: household._id, room_id: salon._id, name: 'TV', normalized_name: 'tv', category: 'hightech', purchase_price: 600 },
      { household_id: household._id, room_id: salon._id, name: 'Canapé', normalized_name: 'canape', category: 'meubles_deco', purchase_price: 250 },
      { household_id: household._id, room_id: salon._id, name: 'Lampe', normalized_name: 'lampe', category: 'meubles_deco', purchase_price: 100 },
      { household_id: household._id, room_id: salon._id, name: 'Grille-pain', normalized_name: 'grille-pain', category: 'electromenager', purchase_price: 49.99 },
      { household_id: household._id, room_id: salon._id, name: 'Verres', normalized_name: 'verres', category: 'vaisselle_cuisine', quantity: 6 }, // 1 record = 1 item
      { household_id: household._id, room_id: salon._id, name: 'Coussin 1', normalized_name: 'coussin 1', category: 'meubles_deco' },
      { household_id: household._id, room_id: salon._id, name: 'Coussin 2', normalized_name: 'coussin 2', category: 'meubles_deco' },
      { household_id: household._id, room_id: salon._id, name: 'Tapis', normalized_name: 'tapis', category: 'meubles_deco' },
      { household_id: household._id, room_id: salon._id, name: 'Table basse', normalized_name: 'table basse', category: 'meubles_deco' },
      { household_id: household._id, room_id: salon._id, name: 'Plante', normalized_name: 'plante', category: 'meubles_deco' },
    ]);
  });

  it('should compute North Star Metric, items per room without progress bar, and partial insurance value [CA-2.3, CA-6.1, CA-6.2, CA-6.4]', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123');

    expect(res.status).toBe(200);
    // 10 items total
    expect(res.body.total_items).toBe(10);
    // Insurance sum: 600 + 250 + 100 + 49.99 = 999.99 [CA-6.4]
    expect(res.body.total_value).toBe(999.99);
    expect(res.body.value_items_count).toBe(4);
    // Room count [CA-6.2]
    const salonStats = res.body.items_by_room.find((r: any) => r.name === 'Salon');
    expect(salonStats.count).toBe(10);
    // No 90-item warning at 10 items
    expect(res.body.freemium.show_warning).toBe(false);
  });

  it('should trigger discrete warning banner when reaching 90 items [CA-6.7]', async () => {
    // Seed up to 90 items
    const extraItems = [];
    for (let i = 11; i <= 90; i++) {
      extraItems.push({
        household_id: householdId,
        room_id: salonId,
        name: `Item ${i}`,
        normalized_name: `item ${i}`,
        category: 'autre',
      });
    }
    await Item.insertMany(extraItems);

    const res = await request(app)
      .get('/api/dashboard')
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123');

    expect(res.status).toBe(200);
    expect(res.body.total_items).toBe(90);
    expect(res.body.freemium.show_warning).toBe(true);
    expect(res.body.freemium.remaining_items).toBe(10);
  });

  it('should return 404 when querying an item belonging to another household [CA-0.1]', async () => {
    // Other household
    const otherHousehold = await Household.create({
      name: 'Autre Foyer',
      invite_code: 'OTHER1',
    });
    const otherRoom = await Room.create({
      household_id: otherHousehold._id,
      name: 'Chambre',
    });
    const otherItem = await Item.create({
      household_id: otherHousehold._id,
      room_id: otherRoom._id,
      name: 'Secret item',
      normalized_name: 'secret item',
      category: 'autre',
    });

    // Request from householdId to otherItem._id
    const res = await request(app)
      .get(`/api/items/${otherItem._id}`)
      .set('x-household-id', householdId)
      .set('x-user-id', 'user123');

    expect(res.status).toBe(404);
  });
});
