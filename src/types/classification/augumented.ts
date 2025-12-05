// Types matching the actual data used in Augumentation.js

export interface AugumentedState {
	rotation: boolean;
	crop: boolean;
	verticalFlip: boolean;
	horizontalFlip: boolean;
	brightness: boolean;
	contrast: boolean;
	stauration: boolean;
	noise: boolean;
	blur: boolean;
	rotate_limit: number;
	rotate_prob: number;
	vertical_flip_prob: number;
	horizontal_flip_prob: number;
	brightness_limit: number;
	brightness_prob: number;
	contrast_limit: number;
	contrast_prob: number;
	hue_saturation_limit: number;
	hue_saturation_prob: number;
	gauss_noise_var_limit: number;
	gauss_noise_prob: number;
	blur_limit: number;
	blur_prob: number;
	cropX: number;
	cropY: number;
	cropXratio: number;
	cropYratio: number;
	num_of_images_to_be_generated: string;
	cropProb: number;
	openModal: boolean;
	onClose: boolean;
	isDirty: boolean;
}
// Types for augmentation settings and results

export interface AugmentationSetting {
	type: string;
	parameters: Record<string, any>;
}

export interface AugmentedImage {
	originalImageId: string;
	augmentedImageUrl: string;
	appliedAugmentations: AugmentationSetting[];
}

export interface AugmentationResult {
	images: AugmentedImage[];
	summary: string;
}
