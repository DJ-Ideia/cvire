import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { findSafeCutY, mergeYIntervals } from './pdfPageCut';

describe('mergeYIntervals', () => {
  it('merges overlapping and nested intervals', () => {
    const merged = mergeYIntervals([
      { top: 900, bottom: 1000 },
      { top: 980, bottom: 1030 },
      { top: 1100, bottom: 1200 },
    ]);
    assert.deepEqual(merged, [
      { top: 900, bottom: 1030 },
      { top: 1100, bottom: 1200 },
    ]);
  });
});

describe('findSafeCutY', () => {
  it('returns full remaining height when content fits on one page', () => {
    const slice = findSafeCutY([], 1800, 1000, 2000);
    assert.equal(slice, 200);
  });

  it('keeps max slice when targetCutY is in a free band', () => {
    const occupied = [
      { top: 100, bottom: 400 },
      { top: 1200, bottom: 1400 },
    ];
    const slice = findSafeCutY(occupied, 0, 1000, 2000);
    assert.equal(slice, 1000);
  });

  it('cuts in gap between blocks for single-column layout', () => {
    const occupied = [
      { top: 100, bottom: 900 },
      { top: 950, bottom: 1500 },
    ];
    const slice = findSafeCutY(occupied, 0, 980, 2000);
    assert.equal(slice, 925);
  });

  it('does not cut through sidebar text when main column has a wider gap', () => {
    const occupied = [
      { top: 900, bottom: 1000 },
      { top: 1050, bottom: 1200 },
      { top: 1020, bottom: 1040 },
    ];
    const maxSlice = 1030;
    const slice = findSafeCutY(occupied, 0, maxSlice, 2000);
    const cutY = slice;
    assert.ok(cutY <= 1020, `cutY ${cutY} must be at or above English top`);
    assert.ok(cutY >= 1000, `cutY ${cutY} should use the free band above English`);
    assert.notEqual(cutY, 1025, 'must not use main-only gap middle through English');
    assert.equal(cutY, 1010);
  });
});
