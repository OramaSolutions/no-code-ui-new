# Quick Reference: API Parameter Changes

## Summary Table - All Updated Functions

### crudFunctions.js
| Function | Old Params | New Params | Required? |
|----------|-----------|-----------|-----------|
| `fetchImageDetails` | `(projectName, imageId)` | `(baseUrl, projectName, imageId)` | ✅ |
| `getProjectClasses` | `(projectName)` | `(baseUrl, projectName, username, version, task)` | ✅ |
| `getProjectAnnotations` | `(projectName)` | `(baseUrl, projectName, username, version, task)` | ✅ |
| `saveProjectClasses` | `(classes, projectName)` | `(baseUrl, classes, projectName, username, version, task)` | ✅ |
| `saveLabelData` | `(projectName, payload)` | `(baseUrl, projectName, payload)` | ✅ |

### inferenceUtils.js
| Function | Old Params | New Params | Required? |
|----------|-----------|-----------|-----------|
| `uploadModel` | `(projectName, modelFile, classes)` | `(baseUrl, projectName, modelFile, classes)` | ✅ |
| `getAllModels` | `()` | `(baseUrl)` | ✅ |
| `predictImage` | `(projectName, imageIndex, modelPath)` | `(baseUrl, projectName, imageIndex, modelPath)` | ✅ |
| `fetchInferenceResults` | `(projectName, imageId)` | `(baseUrl, projectName, imageId)` | ✅ |
| `fetchDirectInferenceResults` | `(projectName, imageId, point)` | `(baseUrl, projectName, imageId, point)` | ✅ |
| `sendInclusionExclutionPoints` | `(projectName, imageId, inclusion, exclusion)` | `(baseUrl, projectName, imageId, inclusion, exclusion)` | ✅ |

---

## Parameter Sources in LabelView.jsx

```javascript
// Available at component level:
const { backLink, projectId, projectName, version, imageId } = useParams();

// Derived values:
const baseUrl = getBaseUrlFromBackLink(backLink);
const task = getTaskFromBackLink(backLink);
const userData = useSelector(state => state.auth.user);
// Use: userData.userName
```

---

## Usage Examples

### Loading Classes
```javascript
// OLD (❌ Won't work)
const classes = await getProjectClasses(projectName);

// NEW (✅ Correct)
const classes = await getProjectClasses(baseUrl, projectName, userData.userName, version, task);
```

### Saving Classes
```javascript
// OLD (❌ Won't work)
await saveProjectClasses(newClasses, projectName);

// NEW (✅ Correct)
await saveProjectClasses(baseUrl, newClasses, projectName, userData.userName, version, task);
```

### Loading Annotations
```javascript
// OLD (❌ Won't work)
const annotations = await getProjectAnnotations(projectName);

// NEW (✅ Correct)
const annotations = await getProjectAnnotations(baseUrl, projectName, userData.userName, version, task);
```

### Saving Labels
```javascript
// OLD (❌ Won't work)
await saveLabelData(projectName, payload);

// NEW (✅ Correct)
await saveLabelData(baseUrl, projectName, payload);
```

### Fetching Image Details
```javascript
// OLD (❌ Won't work)
const imageDetails = await fetchImageDetails(projectName, currentIndex);

// NEW (✅ Correct)
const imageDetails = await fetchImageDetails(baseUrl, projectName, currentIndex);
```

### Running Inference
```javascript
// OLD (❌ Won't work)
const results = await fetchInferenceResults(projectName, imageData.id);

// NEW (✅ Correct)
const results = await fetchInferenceResults(baseUrl, projectName, imageData.id);
```

---

## Changes Applied In LabelView.jsx

### 1. Imports (Line 3)
```javascript
// Added:
import { useSelector } from "react-redux";
```

### 2. Function Calls Updated
- `fetchImageDetails()` - Line ~135
- `getProjectClasses()` - Line ~307
- `getProjectAnnotations()` - Line ~325
- `saveProjectClasses()` - Line ~348
- `saveLabelData()` - Lines ~500, ~560
- `fetchInferenceResults()` - Line ~632

### 3. Dependency Array Updated
- `getProjectAnnotations` useEffect now includes: `baseUrl, version, task, userData.userName`

---

## Changes Applied In inferenceUtils.js

### 1. Replaced Static Instance (Lines 6-15)
```javascript
// OLD:
const api = axios.create({ baseURL: API_BASE_URL });

// NEW:
const createApiInstance = (baseUrl) => {
  const apiInstance = axios.create({ baseURL: baseUrl });
  apiInstance.interceptors.request.use(async (config) => {
    return config;
  });
  return apiInstance;
};
```

### 2. Updated All Functions
- All 6 exported functions now accept `baseUrl` as first parameter
- Each function creates its own API instance: `const api = createApiInstance(baseUrl);`

---

## Testing Checklist

- [ ] Load project and verify classes load correctly
- [ ] Add new class and verify save works
- [ ] Load image and verify annotations display
- [ ] Save annotations and verify persistence
- [ ] Run inference and verify results load
- [ ] Test navigation between images
- [ ] Verify no console errors
- [ ] Check browser Network tab for proper API calls

---

## Common Errors & Fixes

### Error: "Cannot read property 'get' of undefined"
**Cause**: Function not receiving `baseUrl` parameter
**Fix**: Ensure all API calls pass `baseUrl` as first parameter

### Error: "userData.userName is undefined"
**Cause**: Redux state not loaded or useSelector not imported
**Fix**: Ensure `useSelector` is imported from `react-redux`

### Error: "baseUrl is undefined"
**Cause**: `getBaseUrlFromBackLink` returned null
**Fix**: Verify `backLink` param is correctly passed in route and matches expected values

### Error: 400/401 Bad Request
**Cause**: Missing or incorrect `username`, `version`, or `task` parameters
**Fix**: Verify all parameters are passed correctly to API functions

---

## Files Modified

1. ✅ `/src/label/lableView/LabelView.jsx` - Updated all API calls
2. ✅ `/src/label/utils/inferenceUtils.js` - Updated all functions to use dynamic baseUrl
3. ⚠️ `/src/label/segmentView/SegmentView.jsx` - **Requires manual updates** (different route structure)
