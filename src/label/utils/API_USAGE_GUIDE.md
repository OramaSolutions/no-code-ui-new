# Dynamic API URL Usage Guide

All API functions in `crudFunctions.js` have been updated to accept `baseUrl` as the first parameter. This allows you to call any function with a dynamic base URL.

## Function Signatures

### Project Management
```javascript
// Before: createOrUpdateProject(projectName)
// After: createOrUpdateProject(baseUrl, projectName)
createOrUpdateProject(baseUrl, projectName)
getProject(baseUrl, projectName)
deleteProject(baseUrl, projectName)
```

### Image Management
```javascript
addImages(baseUrl, images, projectName)
deleteImage(baseUrl, projectName, imageId)
clearAllImages(baseUrl, projectName)
getProjectImages(baseUrl, projectName, startIndex, endIndex)
LoadImages(baseUrl, projectName, userName, startIndex, endIndex, isInitialLoad)
downloadDataset(baseUrl, projectName, onProgress)
getProjectThumbnails(baseUrl, projectName)
fetchImageDetails(baseUrl, projectName, imageId)
```

### Class Management
```javascript
getProjectClasses(baseUrl, projectName)
saveProjectClasses(baseUrl, classes, projectName)
updateProjectClass(baseUrl, projectName, classId, updates)
deleteProjectClass(baseUrl, projectName, classId)
```

### Label & Annotation Management
```javascript
saveLabelData(baseUrl, projectName, payload)
saveOcrData(baseUrl, projectName, payload)
saveAllAnnotations(baseUrl, allAnnotations, projectName)
saveAllOcrAnnotations(baseUrl, allAnnotations, projectName)
getProjectAnnotations(baseUrl, projectName)
getProjectOcrAnnotations(baseUrl, projectName)
getProjectStats(baseUrl, projectName)
setAnnotationType(baseUrl, projectName, type)
```

### Segment Management
```javascript
saveSegmentData(baseUrl, projectName, payload)
getProjectSegmentAnnotation(baseUrl, projectName)
saveProjectSegmentAnnotations(baseUrl, allSegments, projectName)
```

## Usage Examples

```javascript
import {
  createOrUpdateProject,
  addImages,
  getProjectClasses,
  saveLabelData
} from '@/label/utils/crudFunctions';

// Example 1: Create a project with dynamic URL
const baseUrl = "http://localhost:8000"; // or any other URL
await createOrUpdateProject(baseUrl, "my-project");

// Example 2: Add images with dynamic URL
const images = [{
  name: "image1.jpg",
  blob: imageFile
}];
await addImages(baseUrl, images, "my-project");

// Example 3: Get classes with dynamic URL
const classes = await getProjectClasses(baseUrl, "my-project");

// Example 4: Save label data with dynamic URL
const payload = {
  imageId: "123",
  labels: [...]
};
await saveLabelData(baseUrl, "my-project", payload);

// Example 5: Different URL for different calls
const productionUrl = "https://api.production.com";
const stagingUrl = "https://api.staging.com";

await getProjectStats(productionUrl, "prod-project");
await getProjectStats(stagingUrl, "dev-project");
```

## Key Changes

1. **Helper Function Added**: `createApiInstance(baseUrl)` - Creates a new axios instance with the provided base URL
2. **All Functions Updated**: Every exported function now accepts `baseUrl` as the first parameter
3. **Backwards Compatible Pattern**: You can create wrapper functions if needed to maintain old calling patterns

## Migration Example

If you have existing code using these functions:

```javascript
// Old code
import { createOrUpdateProject } from '@/label/utils/crudFunctions';
await createOrUpdateProject("my-project");

// New code
import { createOrUpdateProject } from '@/label/utils/crudFunctions';
const baseUrl = "http://api.example.com";
await createOrUpdateProject(baseUrl, "my-project");
```

## Optional: Create Wrapper Functions

If you want to maintain the old API while also supporting dynamic URLs, you can create wrapper functions:

```javascript
const DEFAULT_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export const createOrUpdateProjectDefault = (projectName) => {
  return createOrUpdateProject(DEFAULT_BASE_URL, projectName);
};

export const addImagesDefault = (images, projectName) => {
  return addImages(DEFAULT_BASE_URL, images, projectName);
};
```
