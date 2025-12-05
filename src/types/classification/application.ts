// Types matching the actual data used in Application.jsx

export interface ApplicationItem {
	id: number;
	title: string;
	description: string;
	image: string;
}

export interface ApplicationState {
	selectedApp: ApplicationItem | null;
	taskId: string | null;
	buildStatus: 'started' | 'running' | 'done' | 'error' | null;
	buildResult: any;
	error: string | null;
}
// Types for application-level metadata and configuration

export interface ApplicationMeta {
	name: string;
	version: string;
	createdBy: string;
	createdAt: string;
}

export interface ApplicationConfig {
	modelType: string;
	description?: string;
	settings: Record<string, any>;
}
