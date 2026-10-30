import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { setupTestDb, teardownTestDb, clearTestDb } from '../setup.js';
import { Household } from '../../src/models/household.model.js';
import { Room } from '../../src/models/room.model.js';
import { Item } from '../../src/models/item.model.js';

describe('Room Management API Integration Tests [US1, US2, US3]', () => {
  let householdId: string;
  let otherHouseholdId: string;
  let roomId: string;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();

    const household1 = await Household.create({
      name: 'Foyer Test 1',
      invite_code: 'FOYE01',
      plan: 'free',
    });
    householdId = household1._id.toString();

    const household2 = await Household.create({
      name: 'Foyer Test 2',
      invite_code: 'FOYE02',
      plan: 'free',
    });
    otherHouseholdId = household2._id.toString();

    const room = await Room.create({
      household_id: household1._id,
      name: 'Chambre 1',
      icon: 'door',
      order: 1,
    });
    roomId = room._id.toString();
  });

  it('should successfully rename a room via PATCH /api/rooms/:id', async () => {
    const res = await request(app)
      .patch(`/api/rooms/${roomId}`)
      .set('x-household-id', householdId)
      .set('x-user-id', 'user1')
      .send({ name: 'Chambre Parentale' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Chambre Parentale');
    expect(res.body.id).toBe(roomId);

    // Verify in DB
    const updated = await Room.findById(roomId);
    expect(updated?.name).toBe('Chambre Parentale');
  });

  it('should reject renaming with empty name', async () => {
    const res = await request(app)
      .patch(`/api/rooms/${roomId}`)
      .set('x-household-id', householdId)
      .set('x-user-id', 'user1')
      .send({ name: '   ' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('obligatoire');
  });

  it('should prevent updating a room belonging to another household', async () => {
    const res = await request(app)
      .patch(`/api/rooms/${roomId}`)
      .set('x-household-id', otherHouseholdId)
      .set('x-user-id', 'user2')
      .send({ name: 'Hacked Room' });

    expect(res.status).toBe(404);
  });

  it('should successfully delete an empty room via DELETE /api/rooms/:id', async () => {
    const res = await request(app)
      .delete(`/api/rooms/${roomId}`)
      .set('x-household-id', householdId)
      .set('x-user-id', 'user1');

    expect(res.status).toBe(200);

    const deleted = await Room.findById(roomId);
    expect(deleted).toBeNull();
  });

  it('should prevent deleting a room containing items', async () => {
    // Add an item to this room
    await Item.create({
      household_id: householdId,
      room_id: roomId,
      name: 'Lampe de chevet',
      normalized_name: 'lampe de chevet',
      category: 'meubles_deco',
      quantity: 1,
    });

    const res = await request(app)
      .delete(`/api/rooms/${roomId}`)
      .set('x-household-id', householdId)
      .set('x-user-id', 'user1');

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('contient encore 1 objet');

    // Verify room was NOT deleted
    const notDeleted = await Room.findById(roomId);
    expect(notDeleted).not.toBeNull();
  });
});
