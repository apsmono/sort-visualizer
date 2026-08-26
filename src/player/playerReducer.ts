import type { PlayerState, PlayerAction } from './types.ts';

export const initialPlayerState: PlayerState = {
  steps: [],
  cursor: 0,
  array: [],
  comparing: [],
  writing: [],
  sorted: new Set<number>(),
  pivot: null,
  range: null,
  note: null,
  status: 'idle',
  stats: {
    comparisons: 0,
    writes: 0,
    stepIndex: 0,
    totalSteps: 0,
  },
};

export function playerReducer(
  state: PlayerState,
  action: PlayerAction
): PlayerState {
  switch (action.type) {
    case 'load': {
      const { array, steps } = action;
      const isFinished = steps.length === 0;
      return {
        ...state,
        steps,
        cursor: 0,
        array: [...array],
        comparing: [],
        writing: [],
        sorted: new Set<number>(),
        pivot: null,
        range: null,
        note: null,
        status: isFinished ? 'finished' : 'idle',
        stats: {
          comparisons: 0,
          writes: 0,
          stepIndex: 0,
          totalSteps: steps.length,
        },
      };
    }

    case 'play': {
      if (state.cursor === state.steps.length) {
        return state;
      }
      return {
        ...state,
        status: 'playing',
      };
    }

    case 'pause': {
      if (state.status === 'playing') {
        return {
          ...state,
          status: 'paused',
        };
      }
      return state;
    }

    case 'reset': {
      // Revert the array to the original state by unapplying all steps from cursor-1 down to 0
      const newArray = [...state.array];
      for (let i = state.cursor - 1; i >= 0; i--) {
        const step = state.steps[i];
        if (step.kind === 'write' && step.writes) {
          for (let j = step.writes.length - 1; j >= 0; j--) {
            const w = step.writes[j];
            newArray[w.index] = w.prev;
          }
        }
      }

      return {
        ...state,
        cursor: 0,
        array: newArray,
        comparing: [],
        writing: [],
        sorted: new Set<number>(),
        pivot: null,
        range: null,
        note: null,
        status: state.steps.length === 0 ? 'finished' : 'idle',
        stats: {
          comparisons: 0,
          writes: 0,
          stepIndex: 0,
          totalSteps: state.steps.length,
        },
      };
    }

    case 'forward': {
      const { count } = action;
      if (state.cursor === state.steps.length) {
        return state;
      }

      const targetCursor = Math.min(state.steps.length, state.cursor + count);
      const newArray = [...state.array];
      
      let additionalComparisons = 0;
      let additionalWrites = 0;
      const newSorted = new Set<number>(state.sorted);
      let currentPivot = state.pivot;
      let currentRange = state.range;

      for (let i = state.cursor; i < targetCursor; i++) {
        const step = state.steps[i];
        if (step.kind === 'write' && step.writes) {
          for (const w of step.writes) {
            newArray[w.index] = w.value;
          }
          additionalWrites += step.writes.length;
        } else if (step.kind === 'compare') {
          additionalComparisons++;
        } else if (step.kind === 'mark-sorted' && step.sorted) {
          for (const idx of step.sorted) {
            newSorted.add(idx);
          }
        }

        if (step.pivot !== undefined) {
          currentPivot = step.pivot;
        }
        if (step.range !== undefined) {
          currentRange = step.range;
        }
      }

      const lastAppliedStep = state.steps[targetCursor - 1];
      const isFinished = targetCursor === state.steps.length;

      return {
        ...state,
        cursor: targetCursor,
        array: newArray,
        comparing:
          lastAppliedStep?.kind === 'compare' && lastAppliedStep.compare
            ? lastAppliedStep.compare
            : [],
        writing:
          lastAppliedStep?.kind === 'write' && lastAppliedStep.writes
            ? lastAppliedStep.writes.map((w) => w.index)
            : [],
        sorted: newSorted,
        pivot: currentPivot,
        range: currentRange,
        note: lastAppliedStep?.note ?? null,
        status: isFinished ? 'finished' : state.status,
        stats: {
          comparisons: state.stats.comparisons + additionalComparisons,
          writes: state.stats.writes + additionalWrites,
          stepIndex: targetCursor,
          totalSteps: state.steps.length,
        },
      };
    }

    case 'back': {
      const { count } = action;
      if (state.cursor === 0) {
        return state;
      }

      const targetCursor = Math.max(0, state.cursor - count);
      const newArray = [...state.array];

      // Unapply steps in reverse order
      for (let i = state.cursor - 1; i >= targetCursor; i--) {
        const step = state.steps[i];
        if (step.kind === 'write' && step.writes) {
          for (let j = step.writes.length - 1; j >= 0; j--) {
            const w = step.writes[j];
            newArray[w.index] = w.prev;
          }
        }
      }

      // Recompute stats and stateful highlights from steps[0...targetCursor)
      let comparisons = 0;
      let writes = 0;
      const sorted = new Set<number>();
      let pivot: number | null = null;
      let range: readonly [number, number] | null = null;

      for (let i = 0; i < targetCursor; i++) {
        const step = state.steps[i];
        if (step.kind === 'compare') {
          comparisons++;
        } else if (step.kind === 'write' && step.writes) {
          writes += step.writes.length;
        } else if (step.kind === 'mark-sorted' && step.sorted) {
          for (const idx of step.sorted) {
            sorted.add(idx);
          }
        }

        if (step.pivot !== undefined) {
          pivot = step.pivot;
        }
        if (step.range !== undefined) {
          range = step.range;
        }
      }

      const lastAppliedStep = targetCursor > 0 ? state.steps[targetCursor - 1] : undefined;

      return {
        ...state,
        cursor: targetCursor,
        array: newArray,
        comparing:
          lastAppliedStep?.kind === 'compare' && lastAppliedStep.compare
            ? lastAppliedStep.compare
            : [],
        writing:
          lastAppliedStep?.kind === 'write' && lastAppliedStep.writes
            ? lastAppliedStep.writes.map((w) => w.index)
            : [],
        sorted,
        pivot,
        range,
        note: lastAppliedStep?.note ?? null,
        status: state.status === 'finished' ? 'paused' : state.status,
        stats: {
          comparisons,
          writes,
          stepIndex: targetCursor,
          totalSteps: state.steps.length,
        },
      };
    }

    case 'seek': {
      const { cursor: targetCursor } = action;
      const boundedTarget = Math.max(0, Math.min(state.steps.length, targetCursor));
      if (boundedTarget === state.cursor) {
        return state;
      }
      if (boundedTarget > state.cursor) {
        return playerReducer(state, {
          type: 'forward',
          count: boundedTarget - state.cursor,
        });
      } else {
        return playerReducer(state, {
          type: 'back',
          count: state.cursor - boundedTarget,
        });
      }
    }

    default:
      return state;
  }
}
