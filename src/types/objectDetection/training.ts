// types.ts
import store from '../../reduxToolkit/store';
// Router location.state for this page
export interface ODProjectLocationState {
  name: string;
  version: number | string;
  projectId:string;
}

// LocalStorage "userLogin" structure used by this feature
export interface ODUserLogin {
  activeUser?: {
    userName?: string;
	
    // add other known fields if used elsewhere, e.g., id, email
  };
  token?:string;
  // add other global fields if needed
}

// Canonical step keys used across the flow
export type StepKey =
  | 'labelled'
  | 'augumented'
  | 'images'
  | 'dataSplit'
  | 'HyperTune'
  | 'infer'
  | 'remark'
  | 'application';

// Steps order as a readonly tuple (helps with indexOf and literal inference)
export type StepOrder = readonly StepKey[];

// Status values for a step
export type StepStatusValue = 'not_started' | 'in_progress' | 'completed';

// Map of step -> status container
export type StepStatusMap = {
  [K in StepKey]?: { status: StepStatusValue };
};

// Boolean completion flags for UI mirroring
export type CompletedStepsState = {
  [K in StepKey]: boolean;
};

// Redux root state type (import your store here to infer)
export type RootState = ReturnType<typeof store.getState>;

// The relevant shape from steps slice this component reads
export interface StepsSliceState {
  hasChangedSteps: Record<StepKey, boolean>;
  // include additional fields if used elsewhere, e.g., loading flags
}

// Contract returned by useStepPersistence(userData, locationState)
export interface UseStepPersistenceReturn {
  stepStatus: StepStatusMap | undefined;
  currentStep: StepKey | null;
  isLoading: boolean;
  fetchProjectStatus: () => Promise<void>;
  updateStepStatus: (step: StepKey, status: StepStatusValue) => Promise<void>;
  isStepAccessible: (step: StepKey) => boolean;
}
