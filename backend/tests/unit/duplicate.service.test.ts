import { describe, it, expect } from 'vitest';
import { normalizeQuery, matchDuplicateSimilarity } from '../../src/services/duplicate.service.js';

describe('DuplicateService Unit Tests [CA-3.1, CA-3.3, CA-3.5]', () => {
  it('should ignore accents and uppercase letters [CA-3.3]', () => {
    expect(normalizeQuery('Sèche-cheveux')).toBe('seche-cheveux');
    expect(normalizeQuery('SECHE CHEVEUX')).toBe('seche cheveux');
    expect(normalizeQuery('Rallonge 5m')).toBe('rallonge 5m');
  });

  it('should return true when searching a prefix or substring of existing item [CA-3.1]', () => {
    const existingNormalized = 'rallonge 5m';
    const query1 = 'rallonge';
    const query2 = 'RALLONGE';
    const query3 = 'rall';

    expect(matchDuplicateSimilarity(query1, existingNormalized)).toBe(true);
    expect(matchDuplicateSimilarity(query2, existingNormalized)).toBe(true);
    expect(matchDuplicateSimilarity(query3, existingNormalized)).toBe(true);
  });

  it('should not match when query has less than 2 characters [CA-3.5]', () => {
    const existingNormalized = 'rallonge 5m';
    expect(matchDuplicateSimilarity('r', existingNormalized)).toBe(false);
    expect(matchDuplicateSimilarity('', existingNormalized)).toBe(false);
  });

  it('should not match completely unrelated words [CA-3.5]', () => {
    const existingNormalized = 'rallonge 5m';
    expect(matchDuplicateSimilarity('grille-pain', existingNormalized)).toBe(false);
  });
});
