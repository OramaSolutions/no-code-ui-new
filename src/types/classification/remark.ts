// Types matching the actual data used in Remark.js

export interface RemarkState {
	observation: string;
	scopeOfImprovement: string;
	numOfTries: string;
	loading: boolean;
	files: File[];
	hardwareFile: File | null;
	showNext?: boolean;
	existingRemark?: string | null;
	uploadedFiles?: string[];
	isEditMode?: boolean;
}
// Types for user remarks and feedback

export interface Remark {
	user: string;
	comment: string;
	createdAt: string;
}

export interface RemarkList {
	remarks: Remark[];
}
