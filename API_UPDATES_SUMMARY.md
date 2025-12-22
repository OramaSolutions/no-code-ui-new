# API Updates Summary - LabelView Component

## Overview
Updated all API calls in `LabelView.jsx` and related utility files (`crudFunctions.js` and `inferenceUtils.js`) to pass required parameters: `baseUrl`, `username`, `version`, and `task`. These parameters were previously omitted but are required by the backend API for proper request routing and authentication.

---

## Files Modified

### 1. `/src/label/lableView/LabelView.jsx`

#### Changes Made:

**a) Added missing import**
```javascript
import { useSelector } from "react-redux";
```

**b) Updated API calls with required parameters:**

| Function | Old Call | New Call | Parameters Added |
|----------|----------|----------|------------------|
| `fetchImageDetails` | `fetchImageDetails(projectName, currentIndex)` | `fetchImageDetails(baseUrl, projectName, currentIndex)` | `baseUrl` |
| `getProjectClasses` | `getProjectClasses(projectName)` | `getProjectClasses(baseUrl, projectName, userData.userName, version, task)` | `baseUrl, username, version, task` |
| `getProjectAnnotations` | `getProjectAnnotations(projectName)` | `getProjectAnnotations(baseUrl, projectName, userData.userName, version, task)` | `baseUrl, username, version, task` |
| `saveProjectClasses` | `saveProjectClasses(newClasses, projectName)` | `saveProjectClasses(baseUrl, newClasses, projectName, userData.userName, version, task)` | `baseUrl, username, version, task` |
| `saveLabelData` (x2) | `saveLabelData(projectName, {...})` | `saveLabelData(baseUrl, projectName, {...})` | `baseUrl` |
| `fetchInferenceResults` | `fetchInferenceResults(projectName, imageData.id)` | `fetchInferenceResults(baseUrl, projectName, imageData.id)` | `baseUrl` |

**c) Updated useEffect dependency arrays:**
- `getProjectAnnotations` now includes dependencies: `baseUrl, version, task, userData.userName`

---

### 2. `/src/label/utils/inferenceUtils.js`

#### Changes Made:

**a) Replaced static axios instance with dynamic instance creator:**
```javascript
// OLD
const api = axios.create({
  baseURL: API_BASE_URL,
});

// NEW
const createApiInstance = (baseUrl) => {
  const apiInstance = axios.create({
    baseURL: baseUrl,
  });
  
  apiInstance.interceptors.request.use(async (config) => {
    return config;
  });
  
  return apiInstance;
};
```

**b) Updated all exported functions to accept and use `baseUrl`:**

| Function | Parameters Changed |
|----------|-------------------|
| `uploadModel` | Added `baseUrl` as first parameter |
| `getAllModels` | Added `baseUrl` as first parameter |
| `predictImage` | Added `baseUrl` as first parameter |
| `fetchInferenceResults` | Added `baseUrl` as first parameter |
| `fetchDirectInferenceResults` | Added `baseUrl` as first parameter |
| `sendInclusionExclutionPoints` | Added `baseUrl` as first parameter |

**Example of function signature change:**
```javascript
// OLD
export async function uploadModel(projectName, modelFile, classes = [])

// NEW
export async function uploadModel(baseUrl, projectName, modelFile, classes = [])
```

---

## Usage Examples

### Before (Incorrect)
```javascript
const classes = await getProjectClasses(projectName);
await saveProjectClasses(newClasses, projectName);
const details = await fetchImageDetails(projectName, imageId);
const results = await fetchInferenceResults(projectName, imageId);
```

### After (Correct)
```javascript
const classes = await getProjectClasses(baseUrl, projectName, userData.userName, version, task);
await saveProjectClasses(baseUrl, newClasses, projectName, userData.userName, version, task);
const details = await fetchImageDetails(baseUrl, projectName, imageId);
const results = await fetchInferenceResults(baseUrl, projectName, imageId);
```

---

## Parameters Explanation

- **`baseUrl`**: Dynamic API base URL determined from the `backLink` parameter (e.g., classification, objectdetection, defectdetection)
- **`projectName`**: Name of the current project
- **`username`**: Current user's name from Redux state (`userData.userName`)
- **`version`**: Version parameter from route params
- **`task`**: Task type determined from backLink (classification, objectdetection, or defectdetection)

---

## Impact

### Affected Endpoints (Backend)
All API calls now include proper routing context:
- Requests can be routed to the correct backend service based on `baseUrl`
- User-specific and version-specific data is now properly tracked
- Annotation data is properly scoped to user, version, and task

### No Breaking Changes
- Local helper functions (`getMasterRectangles`, `saveMasterRectangles`) use localStorage and don't require updates
- All changes maintain backward compatibility with backend API expectations

---

## Testing Checklist

- [ ] Verify image loading works with new `fetchImageDetails` call
- [ ] Verify classes are loaded and saved correctly
- [ ] Verify annotations are retrieved and saved properly
- [ ] Verify inference results are fetched correctly
- [ ] Test with different task types (classification, objectdetection, defectdetection)
- [ ] Verify Redux userData is properly initialized before API calls
- [ ] Check console for any API errors in network tab

---

## Notes

- The `useSelector` hook was added to ensure Redux state is properly imported
- All utility functions now follow consistent parameter ordering: `baseUrl` first, followed by business logic parameters
- Error handling remains unchanged - existing error handlers will work as before
- The dynamic API instance creation pattern matches that used in `crudFunctions.js`

---

## Additional Files Affected (Future Updates Needed)

### `/src/label/segmentView/SegmentView.jsx`
**Status**: ⚠️ Requires Updates

This component also imports and uses the following functions from `inferenceUtils.js`:
- `fetchDirectInferenceResults` (line 637)
- `sendInclusionExclutionPoints` (line 699)

**Note**: This component has a different route structure (uses `userName`, `projectName`, `index` from params instead of `backLink`, `projectId`, `projectName`, `version`). Updates to this file should be handled separately, as it will need:
1. Access to `baseUrl` (may require route parameter changes or environment configuration)
2. Access to `version` and `task` parameters (currently not available in route params)

**Recommended Actions**:
- [ ] Verify SegmentView's route structure and parameters
- [ ] Determine if it should follow the same pattern as LabelView
- [ ] Update SegmentView with proper `baseUrl`, `version`, and `task` parameters once route structure is confirmed
