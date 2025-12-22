// labelled.ts - Proper type definitions without assumptions

// Component Props
export interface LabelledProps {
    username: string;
    state: {
        name: string;
        version: string;
    };
    onApply: () => void;
    onChange: () => void;
    url: string;
}

// Component State
export interface LabelledState {
    imageUrls: string[];
    imageFolder: File | null;
    loading: boolean;
    resizecheck: boolean;
    width: number | null;
    open: boolean;
    close: boolean | null;
    openImport: boolean;
    closeImport: boolean;
}

// API Response Types (known from fetch calls)
export interface ThumbnailResponse {
    thumbnails?: string[];
    count?: number;
}

// Worker Message Event
export interface ZipWorkerMessage {
    imageUrls: string[];
    imageFolder: File;
}

// Data size storage
export interface DataSize {
    Size: number;
}

// Types for labelled data and annotation formats
export interface Label {
    class: string;
    bbox: [number, number, number, number];
    confidence?: number;
}

export interface LabelledImage {
    imageId: string;
    imageUrl: string;
    labels: Label[];
}

export interface LabelledDataset {
    images: LabelledImage[];
    createdAt: string;
}
