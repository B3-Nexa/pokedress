import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { setupTestDb, teardownTestDb, clearTestDb } from '../setup.js';
import { Room } from '../../src/models/room.model.js';
import { Household } from '../../src/models/household.model.js';
import { User } from '../../src/models/user.model.js';

describe('Household Collaboration & Sharing API Tests [US5, CA-5.1, CA-5.3, CA-5.4, CA-5.5, CA-5.6]', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  it('should register first user, create household, 6-char code, and seed 5 default rooms [CA-2.5, CA-5.1]', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'lea@example.com',
      name: 'Léa',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.household.invite_code).toHaveLength(6);

    // Verify 5 default rooms created [CA-2.5]
    const rooms = await Room.find({ household_id: res.body.household.id });
    expect(rooms.length).toBe(5);
    const roomNames = rooms.map((r) => r.name);
    expect(roomNames).toContain('Salon');
    expect(roomNames).toContain('Cuisine');
    expect(roomNames).toContain('Chambre');
    expect(roomNames).toContain('Salle de bain');
    expect(roomNames).toContain('Cave/Garage');
  });

  it('should allow second user to join with tolerant code (lowercase & spaces) [CA-5.3, CA-5.4]', async () => {
    const household = await Household.create({
      name: 'Chez Léa',
      invite_code: 'ABCDEF',
      plan: 'free',
    });

    await User.create({
      household_id: household._id,
      email: 'lea@example.com',
      name: 'Léa',
      password_hash: 'hash',
      role: 'owner',
    });

    // Marc joins with lowercase and spaces " abcdef "
    const res = await request(app).post('/api/auth/register').send({
      email: 'marc@example.com',
      name: 'Marc',
      password: 'password123',
      invite_code: '  abcdef  ',
    });

    expect(res.status).toBe(201);
    expect(res.body.household.id).toBe(household._id.toString());
    expect(res.body.user.role).toBe('member');
  });

  it('should reject a 3rd user on free tier with 403 limit message [CA-5.6]', async () => {
    const household = await Household.create({
      name: 'Chez Léa & Marc',
      invite_code: 'ABCDEF',
      plan: 'free',
    });

    await User.create([
      {
        household_id: household._id,
        email: 'lea@example.com',
        name: 'Léa',
        password_hash: 'hash',
        role: 'owner',
      },
      {
        household_id: household._id,
        email: 'marc@example.com',
        name: 'Marc',
        password_hash: 'hash',
        role: 'member',
      },
    ]);

    // 3rd user attempts to join
    const res = await request(app).post('/api/auth/register').send({
      email: 'coloc@example.com',
      name: 'Coloc',
      password: 'password123',
      invite_code: 'ABCDEF',
    });

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('complet en version gratuite');
  });

  it('should return friendly error when code is invalid [CA-5.5]', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      name: 'Test',
      password: 'password123',
      invite_code: 'INVALD',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Ce code ne correspond à aucun foyer');
  });
});
