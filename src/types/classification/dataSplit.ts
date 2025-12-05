// Types matching the actual data used in DataSplit.js

export interface DataSplitState {
	trainingPercentage: number;
	debouncedTrainingPercentage: string;
	split_ratio?: number;
}
// Types for data split ratios and dataset partitioning

export interface DataSplitRatio {
	train: number;
	validation: number;
	test: number;
}

export interface DataSplitResult {
	trainSet: string[];
	validationSet: string[];
	testSet: string[];
}
