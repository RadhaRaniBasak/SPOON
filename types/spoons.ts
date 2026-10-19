export type EnergyMode = 'high' | 'balanced' | 'survival' | 'recharge';

export type InertiaContext = 'desk' | 'mobile' | 'physical' | 'low-brain';

export type ActivationFriction = 1 | 2 | 3; // 1: Easy start, 2: Moderate, 3: Wall of Awful

export type SpoonCost = 1 | 2 | 3 | 4;

export interface MicroStep {
  id: string;
  label: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  spoonCost: SpoonCost;
  activationFriction: ActivationFriction;
  inertia: InertiaContext;
  ignitionPrompt: string;        // 30-second absurdly small starting action
  microSteps: MicroStep[];       // 1-spoon slices
  status: 'plate' | 'holding' | 'completed' | 'composted';
  rolloverCount: number;         // Triggers gentle compost prompt at >= 3
  isBorrowedEnergy?: boolean;    // True if task exceeds daily budget
  createdAt: string;
}

export interface SensoryProfile {
  fontFamily: 'hyperlegible' | 'jakarta' | 'mono';
  saccadicReading: boolean;      // Zero-CLS opacity-based Bionic anchoring
  reducedMotion: boolean;
  brownNoiseActive: boolean;
  brownNoiseVolume: number;      // 0.0 to 1.0
  uxAnnotationsVisible: boolean; // Judge Mode overlay pins
}

export interface SpoonState {
  dailyBudget: number;           // 0 to 12 Spoons calibrated in morning
  spentSpoons: number;
  borrowedFromTomorrow: number;  // Overdraft tracking (max 3)
  currentInertia: InertiaContext;
  energyMode: EnergyMode;        // Derived automatically or overridden
  tasks: TaskItem[];
  sensory: SensoryProfile;
}

export type JudgeScenario =
  | 'morning-high'
  | 'afternoon-crash'
  | 'overdraft-guardrail'
  | 'zero-spoon-recharge';
