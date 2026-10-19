import { EnergyMode, InertiaContext, TaskItem } from '../types/spoons';

export interface CompatibilityBreakdown {
  total: number;
  capacityTerm: number;
  inertiaBonus: number;
  frictionPenalty: number;
  overdraftPenalty: number;
  fatigueFactor: number;
}

export function getCompatibilityBreakdown(
  task: TaskItem,
  remainingSpoons: number,
  currentInertia: InertiaContext,
  dailyBudget: number,
  spentSpoons: number = 0
): CompatibilityBreakdown {
  const safeBudget = Math.max(1, dailyBudget);
  const effectiveSpent = spentSpoons > 0 ? spentSpoons : Math.max(0, dailyBudget - remainingSpoons);
  const fatigueFactor = 1 + effectiveSpent / safeBudget;

  const capacityTerm = 3.5 * (remainingSpoons - task.spoonCost);
  const inertiaBonus = task.inertia === currentInertia ? 4.0 : 0;
  const frictionPenalty = 2.5 * (task.activationFriction * fatigueFactor);
  const overdraftPenalty = 1.5 * Math.pow(Math.max(0, task.spoonCost - remainingSpoons), 2);

  const total = Number((capacityTerm + inertiaBonus - frictionPenalty - overdraftPenalty).toFixed(2));

  return {
    total,
    capacityTerm: Number(capacityTerm.toFixed(2)),
    inertiaBonus: Number(inertiaBonus.toFixed(2)),
    frictionPenalty: Number(frictionPenalty.toFixed(2)),
    overdraftPenalty: Number(overdraftPenalty.toFixed(2)),
    fatigueFactor: Number(fatigueFactor.toFixed(2)),
  };
}

export function calculateTaskCompatibility(
  task: TaskItem,
  remainingSpoons: number,
  currentInertia: InertiaContext,
  dailyBudget: number,
  spentSpoons: number = 0
): number {
  return getCompatibilityBreakdown(task, remainingSpoons, currentInertia, dailyBudget, spentSpoons).total;
}

export function getVisiblePlateTasks(
  tasks: TaskItem[],
  energyMode: EnergyMode,
  remainingSpoons: number,
  currentInertia: InertiaContext,
  dailyBudget: number,
  spentSpoons: number = 0
): TaskItem[] {
  if (energyMode === 'recharge') {
    return [];
  }

  const plateTasks = tasks.filter((t) => t.status === 'plate');

  const sorted = [...plateTasks].sort((a, b) => {
    const scoreB = calculateTaskCompatibility(b, remainingSpoons, currentInertia, dailyBudget, spentSpoons);
    const scoreA = calculateTaskCompatibility(a, remainingSpoons, currentInertia, dailyBudget, spentSpoons);
    return scoreB - scoreA;
  });

  if (energyMode === 'high') {
    return sorted.slice(0, 5);
  }

  if (energyMode === 'balanced') {
    const filtered = sorted.filter((t) => t.spoonCost <= 3);
    const pool = filtered.length > 0 ? filtered : sorted;
    return pool.slice(0, 3);
  }

  if (energyMode === 'survival') {
    // Prioritize 1-spoon, low-friction tasks first
    const survivalSorted = [...sorted].sort((a, b) => {
      const aIdeal = a.spoonCost === 1 && a.activationFriction === 1 ? 1 : 0;
      const bIdeal = b.spoonCost === 1 && b.activationFriction === 1 ? 1 : 0;
      if (aIdeal !== bIdeal) return bIdeal - aIdeal;
      if (a.spoonCost !== b.spoonCost) return a.spoonCost - b.spoonCost;
      return a.activationFriction - b.activationFriction;
    });
    return survivalSorted.slice(0, 1);
  }

  return sorted.slice(0, 3);
}
