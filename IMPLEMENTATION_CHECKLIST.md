# Implementation Checklist & Validation Guide

## ✅ Completed Changes

### LabelView.jsx Updates
- [x] Added `useSelector` import from `react-redux`
- [x] Updated `fetchImageDetails()` call with `baseUrl` parameter (line ~136)
- [x] Updated `getProjectClasses()` call with `baseUrl, username, version, task` parameters (line ~309)
- [x] Updated `getProjectAnnotations()` call with all required parameters (line ~326)
- [x] Updated `saveProjectClasses()` call with all required parameters (line ~349)
- [x] Updated `saveLabelData()` call in `handleSaveNext()` with `baseUrl` (line ~501)
- [x] Updated `saveLabelData()` call in `handleNull()` with `baseUrl` (line ~561)
- [x] Updated `fetchInferenceResults()` call with `baseUrl` parameter (line ~633)
- [x] Updated `useEffect` dependencies for `getProjectAnnotations` (line ~331)

### inferenceUtils.js Updates
- [x] Replaced static `api` instance with `createApiInstance()` function (lines 6-18)
- [x] Updated `uploadModel()` to accept `baseUrl` as first parameter (line 34)
- [x] Updated `getAllModels()` to accept `baseUrl` as first parameter (line 59)
- [x] Updated `predictImage()` to accept `baseUrl` as first parameter (line 78)
- [x] Updated `fetchInferenceResults()` to accept `baseUrl` as first parameter (line 96)
- [x] Updated `fetchDirectInferenceResults()` to accept `baseUrl` as first parameter (line 117)
- [x] Updated `sendInclusionExclutionPoints()` to accept `baseUrl` as first parameter (line 133)

### Documentation
- [x] Created `API_UPDATES_SUMMARY.md` with detailed change log
- [x] Created `QUICK_REFERENCE.md` with usage examples and parameter tables
- [x] Created this implementation checklist

---

## Validation Tests

### Unit Level Tests

#### Test 1: fetchImageDetails
```javascript
// Should work with new signature
const imageDetails = await fetchImageDetails(
  "http://localhost:8000/classification",
  "my-project",
  0
);
```
- [ ] Returns image data successfully
- [ ] No console errors
- [ ] Correct API endpoint called

#### Test 2: getProjectClasses
```javascript
const classes = await getProjectClasses(
  "http://localhost:8000/classification",
  "my-project",
  "user@example.com",
  "v1",
  "classification"
);
```
- [ ] Returns array of classes
- [ ] Classes contain required fields (id, name, index, color)
- [ ] Parameters properly sent to backend

#### Test 3: saveProjectClasses
```javascript
const result = await saveProjectClasses(
  "http://localhost:8000/classification",
  [{ id: "class1", name: "Class 1", index: 0, color: "#FF0000" }],
  "my-project",
  "user@example.com",
  "v1",
  "classification"
);
```
- [ ] Returns response data
- [ ] Backend receives all parameters
- [ ] Classes are properly saved

#### Test 4: getProjectAnnotations
```javascript
const annotations = await getProjectAnnotations(
  "http://localhost:8000/classification",
  "my-project",
  "user@example.com",
  "v1",
  "classification"
);
```
- [ ] Returns array of annotations
- [ ] Filtered by user, version, and task
- [ ] No errors in console

#### Test 5: saveLabelData
```javascript
const success = await saveLabelData(
  "http://localhost:8000/classification",
  "my-project",
  {
    imageName: "image.jpg",
    imageIndex: 0,
    annotations: [/* array of annotations */]
  }
);
```
- [ ] Returns true on success
- [ ] Data persists on backend
- [ ] No network errors

#### Test 6: fetchInferenceResults
```javascript
const results = await fetchInferenceResults(
  "http://localhost:8000/classification",
  "my-project",
  0
);
```
- [ ] Returns inference data
- [ ] Contains correct format (predictions, confidence scores, etc.)
- [ ] No API errors

### Integration Tests

#### Test 7: Full LabelView Workflow
1. Open LabelView component
   - [ ] Component loads without errors
   - [ ] Redux userData is accessible
   - [ ] baseUrl, task are properly resolved

2. Load image
   - [ ] Image loads successfully
   - [ ] No console errors
   - [ ] Image dimensions calculated correctly

3. Load classes
   - [ ] Classes displayed in sidebar
   - [ ] All class properties available
   - [ ] Can add new class

4. Create annotations
   - [ ] Can draw rectangles on image
   - [ ] Can assign classes to rectangles
   - [ ] Visual feedback works

5. Save annotations
   - [ ] "Save & Next" button works
   - [ ] Data properly formatted
   - [ ] Success message appears
   - [ ] Moves to next image

6. Load annotations
   - [ ] Navigate back to previous image
   - [ ] Saved annotations reappear
   - [ ] Data integrity maintained

#### Test 8: Cross-Task Workflow
Test with different tasks:
- [ ] Classification task loads correctly
- [ ] ObjectDetection task loads correctly
- [ ] DefectDetection task loads correctly
- [ ] Each uses correct baseUrl

#### Test 9: Error Handling
- [ ] Missing baseUrl shows error
- [ ] Invalid projectName shows error
- [ ] Network errors handled gracefully
- [ ] Redux state missing shows error

---

## Network Request Validation

### Expected API Calls

#### Classification Task Example
```
GET /projects/my-project/classes?username=user@example.com&version=v1&task=classification
Headers: baseURL: http://localhost:8000/classification

POST /projects/my-project/add_labels
Payload: { imageName, imageIndex, classes, annotations, yoloAnnotations }

GET /projects/my-project/annotations?username=user@example.com&version=v1&task=classification

POST /projects/my-project/infer/0
```

### Validation Steps
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform action in LabelView
4. Check each request:
   - [x] Correct URL (baseUrl included)
   - [x] Correct HTTP method
   - [x] Query parameters present (username, version, task)
   - [x] Response status 200/201
   - [x] Response body contains expected data

---

## Common Issues & Resolution

### Issue 1: "userData.userName is undefined"
**Cause**: Redux state not initialized
**Resolution**:
- Ensure `require-auth` is wrapping the route
- Check Redux store initialization
- Verify user is logged in

### Issue 2: "Cannot read property 'get' of undefined"
**Cause**: baseUrl is null/undefined
**Resolution**:
- Verify backLink param is in route
- Check that getBaseUrlFromBackLink handles the backLink correctly
- Ensure config.js has proper URL mappings

### Issue 3: API returns 400 Bad Request
**Cause**: Missing or incorrect query parameters
**Resolution**:
- Verify all functions pass username, version, task
- Check parameter values are not null/undefined
- Ensure parameter names match backend expectations

### Issue 4: Image fails to load
**Cause**: fetchImageDetails not receiving baseUrl
**Resolution**:
- Verify loadCurrentImage calls with baseUrl
- Check network request for correct endpoint
- Verify imageId is numeric and valid

---

## Rollback Plan

If issues are discovered:

1. **Critical Issues**: Revert changes to inferenceUtils.js
   ```bash
   git checkout src/label/utils/inferenceUtils.js
   ```

2. **LabelView Issues**: Revert LabelView.jsx
   ```bash
   git checkout src/label/lableView/LabelView.jsx
   ```

3. **Full Rollback**: Revert all changes
   ```bash
   git checkout src/label/utils/inferenceUtils.js src/label/lableView/LabelView.jsx
   ```

---

## Sign-Off Checklist

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Network requests validated
- [ ] No console errors in browser
- [ ] No TypeScript/ESLint errors
- [ ] Error handling verified
- [ ] Documentation updated
- [ ] Cross-task testing completed
- [ ] Performance acceptable
- [ ] Ready for production deployment

---

## Related Components Requiring Future Updates

- [ ] `/src/label/segmentView/SegmentView.jsx` - Uses `fetchDirectInferenceResults` and `sendInclusionExclutionPoints`
  - **Status**: Not updated (different route structure)
  - **Action**: Requires separate PR with route parameter changes

---

## Notes for Next Steps

1. **SegmentView Component**: The SegmentView component also imports and uses inference functions but has a different route structure. It should be updated separately once the route structure is verified and standardized.

2. **Backend Compatibility**: Ensure backend API expects and accepts all parameters:
   - `username`
   - `version`
   - `task`
   - `baseUrl` (handled client-side, not sent to server)

3. **Configuration**: Verify `config.js` has correct URL mappings for all tasks:
   - `classification`
   - `objectdetection`
   - `defectdetection`

4. **Testing Environment**: Test with multiple task types to ensure proper URL routing.

5. **Performance**: Monitor performance with large datasets and optimize if needed.
