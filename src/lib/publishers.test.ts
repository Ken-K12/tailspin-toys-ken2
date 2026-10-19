import { describe, it, expect } from 'vitest';
import { createTestDatabase } from '../../db/test-helpers';
import { publishers } from '../../db/schema';
import { getAllPublishers } from './publishers';

describe('getAllPublishers', () => {
    it('returns publishers ordered by name', async () => {
        const db = await createTestDatabase();
        await db.insert(publishers).values([
            { name: 'Zeta', description: 'z' },
            { name: 'Alpha', description: 'a' },
        ]);
        expect(await getAllPublishers(db)).toEqual([
            { id: expect.any(Number), name: 'Alpha' },
            { id: expect.any(Number), name: 'Zeta' },
        ]);
    });

    it('returns an empty list when there are no publishers', async () => {
        expect(await getAllPublishers(await createTestDatabase())).toEqual([]);
    });
});
