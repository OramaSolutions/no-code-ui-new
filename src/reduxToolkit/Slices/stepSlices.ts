// import { createSlice } from "@reduxjs/toolkit";

// const stepsSlice = createSlice({
//     name: "steps",
//     initialState: {
//         hasChangedSteps: {}, // Tracks which steps have changes
//     },
//     reducers: {
//         markStepChanged: (state, action) => {
//             const { step } = action.payload;
//             state.hasChangedSteps[step] = true; // Mark this step as changed
//         },
//         clearStepChange: (state, action) => {
//             const { step } = action.payload;
//             state.hasChangedSteps[step] = false; // Clear changes for this step
//         },
//         resetAllChanges: (state) => {
//             state.hasChangedSteps = {}; // Reset all changes
//         },
//     },
// });

// export const { markStepChanged, clearStepChange, resetAllChanges } =
//     stepsSlice.actions;

// export default stepsSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { StepsSliceState, StepKey } from "types/objectDetection/training";

const initialHasChanged: StepsSliceState['hasChangedSteps'] = {
  labelled: false,
  augumented: false,
  images: false,
  dataSplit: false,
  HyperTune: false,
  infer: false,
  remark: false,
  application: false,
};

const initialState: StepsSliceState = {
  hasChangedSteps: initialHasChanged,
};

const stepsSlice = createSlice({
    name: "steps",
    initialState,
    reducers: {
        markStepChanged: (state, action: PayloadAction<{ step: StepKey }>) => {
            const { step } = action.payload;
            state.hasChangedSteps[step] = true; // Mark this step as changed
        },
        clearStepChange: (state, action: PayloadAction<{ step: StepKey }>) => {
            const { step } = action.payload;
            state.hasChangedSteps[step] = false; // Clear changes for this step
        },
        resetAllChanges: (state) => {
             state.hasChangedSteps = { ...initialHasChanged }; // Reset all changes
        },
    },
});

export const { markStepChanged, clearStepChange, resetAllChanges } =
    stepsSlice.actions;

export default stepsSlice.reducer;
