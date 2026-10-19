/**
 * Data-access helpers for categories.
 *
 * Helpers take an injectable `db` argument so they work with both the real
 * database (in Astro page frontmatter at build time) and in-memory test databases.
 */
import { asc } from 'drizzle-orm';
import type { Database } from './db';
import { categories } from '../../db/schema';
import type { Category } from '../types/game';

/**
 * Retrieves all categories ordered by name, so static builds are deterministic.
 *
 * @param db - The Drizzle database instance to query.
 * @returns A promise resolving to every category's `id` and `name`.
 */
export async function getAllCategories(db: Database): Promise<Category[]> {
    const rows = await db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .orderBy(asc(categories.name));
    return rows.map((row) => ({ id: row.id, name: row.name }));
}
