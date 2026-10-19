import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EnergyMode, InertiaContext, JudgeScenario, SensoryProfile, SpoonState, TaskItem } from '../types/spoons';
import { createInitialTasks, computeOverdraftAndMarkTasks, deriveEnergyModeFromSpoons, deterministicSlice } from '../app/page';

export interface SpoonStore extends SpoonState {
  setDailyBudget: (spoons: number) => void;
  setEnergyMode: (mode: EnergyMode) => void;
  setCurrentInertia: (inertia: InertiaContext) => void;
  completeTask: (id: string) => void;
  moveTaskToPlate: (id: string) => void;
  moveTaskToHolding: (id: string) => void;
  compostTask: (id: string) => void;
  toggleMicroStep: (taskId: string, stepId: string) => void;
  sliceTask: (id: string) => void;
  completeRechargeRitual: (spoonsRestored: number) => void;
  updateSensory: (partial: Partial<SensoryProfile>) => void;
  loadJudgeScenario: (scenario: JudgeScenario) => void;
}

export const useSpoonStore = create<SpoonStore>()(
  persist(
    (set, get) => ({
      dailyBudget: 10,
      spentSpoons: 2,
      borrowedFromTomorrow: 0,
      currentInertia: 'desk',
      energyMode: 'high',
      tasks: createInitialTasks(),
      sensory: {
        fontFamily: 'hyperlegible',
        saccadicReading: false,
        reducedMotion: false,
        brownNoiseActive: false,
        brownNoiseVolume: 0.35,
        uxAnnotationsVisible: true,
      },
      setDailyBudget: (spoons) => {
        const clamped = Math.max(0, Math.min(12, spoons));
        const { spentSpoons, tasks } = get();
        const remaining = Math.max(0, clamped - spentSpoons);
        const { updatedTasks, borrowedFromTomorrow } = computeOverdraftAndMarkTasks(tasks, clamped, spentSpoons);
        set({
          dailyBudget: clamped,
          energyMode: deriveEnergyModeFromSpoons(remaining),
          tasks: updatedTasks,
          borrowedFromTomorrow,
        });
      },
      setEnergyMode: (energyMode) => set({ energyMode }),
      setCurrentInertia: (currentInertia) => set({ currentInertia }),
      completeTask: (id) => {
        const { tasks, spentSpoons, dailyBudget } = get();
        const target = tasks.find((t) => t.id === id);
        if (!target) return;
        const nextSpent = Math.min(12, spentSpoons + target.spoonCost);
        const nextTasks = tasks.map((t) => (t.id === id ? { ...t, status: 'completed' as const } : t));
        const { updatedTasks, borrowedFromTomorrow } = computeOverdraftAndMarkTasks(nextTasks, dailyBudget, nextSpent);
        set({
          spentSpoons: nextSpent,
          tasks: updatedTasks,
          borrowedFromTomorrow,
          energyMode: deriveEnergyModeFromSpoons(Math.max(0, dailyBudget - nextSpent)),
        });
      },
      moveTaskToPlate: (id) => {
        const { tasks, dailyBudget, spentSpoons } = get();
        const nextTasks = tasks.map((t) => (t.id === id ? { ...t, status: 'plate' as const } : t));
        const { updatedTasks, borrowedFromTomorrow } = computeOverdraftAndMarkTasks(nextTasks, dailyBudget, spentSpoons);
        set({ tasks: updatedTasks, borrowedFromTomorrow });
      },
      moveTaskToHolding: (id) => {
        const { tasks, dailyBudget, spentSpoons } = get();
        const nextTasks = tasks.map((t) => (t.id === id ? { ...t, status: 'holding' as const } : t));
        const { updatedTasks, borrowedFromTomorrow } = computeOverdraftAndMarkTasks(nextTasks, dailyBudget, spentSpoons);
        set({ tasks: updatedTasks, borrowedFromTomorrow });
      },
      compostTask: (id) => {
        const { tasks, dailyBudget, spentSpoons } = get();
        const nextTasks = tasks.map((t) => (t.id === id ? { ...t, status: 'composted' as const } : t));
        const { updatedTasks, borrowedFromTomorrow } = computeOverdraftAndMarkTasks(nextTasks, dailyBudget, spentSpoons);
        set({ tasks: updatedTasks, borrowedFromTomorrow });
      },
      toggleMicroStep: (taskId, stepId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  microSteps: t.microSteps.map((m) =>
                    m.id === stepId ? { ...m, completed: !m.completed } : m
                  ),
                }
              : t
          ),
        }));
      },
      sliceTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            const sliced = deterministicSlice(t.title);
            return {
              ...t,
              spoonCost: 1,
              activationFriction: 1,
              rolloverCount: 0,
              ignitionPrompt: sliced.ignitionPrompt,
              microSteps: sliced.microSteps,
            };
          }),
        }));
      },
      completeRechargeRitual: (spoonsRestored) => {
        const { spentSpoons, dailyBudget } = get();
        const nextSpent = Math.max(0, spentSpoons - spoonsRestored);
        const nextBudget = Math.min(12, Math.max(dailyBudget, nextSpent + spoonsRestored));
        const nextRem = Math.max(1, nextBudget - nextSpent);
        set({
          spentSpoons: nextSpent,
          dailyBudget: nextBudget,
          energyMode: deriveEnergyModeFromSpoons(nextRem),
        });
      },
      updateSensory: (partial) =>
        set((state) => ({ sensory: { ...state.sensory, ...partial } })),
      loadJudgeScenario: (scenario) => {
        const fresh = createInitialTasks();
        if (scenario === 'morning-high') {
          set({ dailyBudget: 10, spentSpoons: 0, currentInertia: 'desk', energyMode: 'high', tasks: fresh });
        } else if (scenario === 'afternoon-crash') {
          set({ dailyBudget: 8, spentSpoons: 6, currentInertia: 'low-brain', energyMode: 'survival', tasks: fresh });
        } else if (scenario === 'overdraft-guardrail') {
          set({ dailyBudget: 5, spentSpoons: 2, currentInertia: 'desk', energyMode: 'balanced', tasks: fresh });
        } else if (scenario === 'zero-spoon-recharge') {
          set({ dailyBudget: 6, spentSpoons: 6, energyMode: 'recharge', tasks: fresh });
        }
      },
    }),
    { name: 'spoons-v2-storage' }
  )
);
