// Types matching the actual data used in InferImages.js

export interface InferState {
	selectedFile: File | null;
	conf: number;
	resultImage: string | null;
	imagePreview?: string | null;
	loading?: boolean;
}
// Types for inference requests and results

export interface InferRequest {
	imageUrl: string;
	modelPath: string;
}

export interface InferResult {
	imageId: string;
	predictions: Array<{
		class: string;
		bbox: [number, number, number, number];
		confidence: number;
	}>;
}
