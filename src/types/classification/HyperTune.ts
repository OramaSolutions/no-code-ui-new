// Types matching the actual data used in HyperTune.js

export interface HyperTuneState {
	pre_trained_model: string;
	imgsz: string;
	batch: string;
	epochs: string;
	mosaic: number;
	close_mosaic: number;
	device: string;
	dropout: string;
	fliplr: number;
	flipud: number;
	patience: string;
	single_class: string;
	validation_conf: number;
	advanced: boolean;
	loader: boolean;
	openModal: boolean;
	isDirty: boolean;
}
// Types for hyperparameter tuning configuration and results

export interface Hyperparameter {
	name: string;
	values: number[] | string[];
}

export interface HyperTuneConfig {
	parameters: Hyperparameter[];
	searchMethod: 'grid' | 'random' | 'bayesian';
}

export interface HyperTuneResult {
	bestParams: Record<string, any>;
	bestScore: number;
	history: Array<Record<string, any>>;
}
