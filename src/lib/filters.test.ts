import { describe, it, expect } from 'vitest';
import { filterGames, type Filterable } from './filters';

const items: (Filterable & { name: string })[] = [
    { name: 'a', category: { id: 1, name: 'C1' }, publisher: { id: 10, name: 'P1' } },
    { name: 'b', category: { id: 2, name: 'C2' }, publisher: { id: 10, name: 'P1' } },
    { name: 'c', category: { id: 1, name: 'C1' }, publisher: { id: 20, name: 'P2' } },
    { name: 'd', category: null, publisher: null },
];

const names = (list: { name: string }[]): string[] => list.map((i) => i.name);

describe('filterGames', () => {
    it('returns everything when no filters are set', () => {
        expect(names(filterGames(items, {}))).toEqual(['a', 'b', 'c', 'd']);
        expect(names(filterGames(items, { categoryIds: [], publisherId: null }))).toEqual(['a', 'b', 'c', 'd']);
    });

    it('filters by a single category', () => {
        expect(names(filterGames(items, { categoryIds: [1] }))).toEqual(['a', 'c']);
    });

    it('matches any of multiple categories', () => {
        expect(names(filterGames(items, { categoryIds: [1, 2] }))).toEqual(['a', 'b', 'c']);
    });

    it('filters by publisher', () => {
        expect(names(filterGames(items, { publisherId: 10 }))).toEqual(['a', 'b']);
    });

    it('combines category and publisher with AND', () => {
        expect(names(filterGames(items, { categoryIds: [1], publisherId: 20 }))).toEqual(['c']);
        expect(names(filterGames(items, { categoryIds: [2], publisherId: 20 }))).toEqual([]);
    });

    it('excludes games without category/publisher when filtering on them', () => {
        expect(names(filterGames(items, { categoryIds: [1, 2] }))).not.toContain('d');
        expect(names(filterGames(items, { publisherId: 10 }))).not.toContain('d');
    });

    it('returns an empty list when nothing matches', () => {
        expect(filterGames(items, { categoryIds: [99] })).toEqual([]);
    });
});
