/**
 * Pure game-filtering helpers.
 *
 * Framework-free and DB-free so the same logic is unit-tested (`filters.test.ts`)
 * and reused by the client-side script on the home page.
 */
import type { Game } from '../types/game';

/** Active filter selection. Omitted/empty values mean "no restriction". */
export interface GameFilters {
    /** Selected category ids; a game matches when its category is any of them. */
    categoryIds?: number[];
    /** Selected publisher id, or null/undefined for all publishers. */
    publisherId?: number | null;
}

/** Minimal game shape needed for filtering. */
export type Filterable = Pick<Game, 'category' | 'publisher'>;

/**
 * Filters games by category and publisher. Category and publisher conditions
 * are combined with AND; multiple categories are combined with OR.
 *
 * @param items - Games (or objects with `category`/`publisher`) to filter.
 * @param filters - The active filters.
 * @returns The matching items, preserving input order.
 */
export function filterGames<T extends Filterable>(items: T[], filters: GameFilters): T[] {
    const categoryIds = filters.categoryIds ?? [];
    const publisherId = filters.publisherId ?? null;
    return items.filter((item) => {
        if (categoryIds.length > 0 && (item.category === null || !categoryIds.includes(item.category.id))) {
            return false;
        }
        if (publisherId !== null && item.publisher?.id !== publisherId) {
            return false;
        }
        return true;
    });
}
