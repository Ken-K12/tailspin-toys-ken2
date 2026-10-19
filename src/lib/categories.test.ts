import { describe, it, expect } from 'vitest';
import { createTestDatabase } from '../../db/test-helpers';
import { categories } from '../../db/schema';
import { getAllCategories } from './categories';

describe('getAllCategories', () => {
    it('returns categories ordered by name', async () => {
        const db = await createTestDatabase();
        await db.insert(categories).values([
            { name: 'Zeta', description: 'z' },
            { name: 'Alpha', description: 'a' },
        ]);
        expect(await getAllCategories(db)).toEqual([
            { id: expect.any(Number), name: 'Alpha' },
            { id: expect.any(Number), name: 'Zeta' },
        ]);
    });

    it('returns an empty list when there are no categories', async () => {
        expect(await getAllCategories(await createTestDatabase())).toEqual([]);
    });
});
