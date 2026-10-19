/**
 * Data-access helpers for publishers.
 *
 * Helpers take an injectable `db` argument so they work with both the real
 * database (in Astro page frontmatter at build time) and in-memory test databases.
 */
import { asc } from 'drizzle-orm';
import type { Database } from './db';
import { publishers } from '../../db/schema';
import type { Publisher } from '../types/game';

/**
 * Retrieves all publishers ordered by name, so static builds are deterministic.
 *
 * @param db - The Drizzle database instance to query.
 * @returns A promise resolving to every publisher's `id` and `name`.
 */
export async function getAllPublishers(db: Database): Promise<Publisher[]> {
    const rows = await db
        .select({ id: publishers.id, name: publishers.name })
        .from(publishers)
        .orderBy(asc(publishers.name));
    return rows.map((row) => ({ id: row.id, name: row.name }));
}
