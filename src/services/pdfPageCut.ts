export type YInterval = {
  top: number;
  bottom: number;
};

export function mergeYIntervals(intervals: YInterval[]): YInterval[] {
  if (intervals.length === 0) {
    return [];
  }

  const sorted = [...intervals]
    .filter((i) => i.bottom > i.top)
    .sort((a, b) => a.top - b.top || a.bottom - b.bottom);

  if (sorted.length === 0) {
    return [];
  }

  const merged: YInterval[] = [{ top: sorted[0].top, bottom: sorted[0].bottom }];

  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i];
    const last = merged[merged.length - 1];
    if (current.top <= last.bottom) {
      last.bottom = Math.max(last.bottom, current.bottom);
    } else {
      merged.push({ top: current.top, bottom: current.bottom });
    }
  }

  return merged;
}

function intervalContaining(occupied: YInterval[], cutY: number): YInterval | null {
  for (const interval of occupied) {
    if (cutY > interval.top && cutY < interval.bottom) {
      return interval;
    }
  }
  return null;
}

export function findSafeCutY(
  occupied: YInterval[],
  yOffsetPx: number,
  maxSlicePx: number,
  canvasHeightPx: number
): number {
  if (yOffsetPx + maxSlicePx >= canvasHeightPx) {
    return canvasHeightPx - yOffsetPx;
  }

  const targetCutY = yOffsetPx + maxSlicePx;
  const merged = mergeYIntervals(occupied);
  const hit = intervalContaining(merged, targetCutY);

  let bestCutPx = targetCutY;

  if (hit) {
    if (hit.top - yOffsetPx > maxSlicePx * 0.65) {
      let previousBottom = yOffsetPx;
      for (const interval of merged) {
        if (interval.bottom <= hit.top && interval.bottom > previousBottom) {
          previousBottom = interval.bottom;
        }
      }

      if (previousBottom > yOffsetPx && previousBottom < hit.top) {
        bestCutPx = Math.round((previousBottom + hit.top) / 2);
      } else {
        bestCutPx = hit.top;
      }
    }
  }

  return Math.max(100, bestCutPx - yOffsetPx);
}
