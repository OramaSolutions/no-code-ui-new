# Dynamic Base URL Integration Guide

## Overview

The `ProjectOverview.jsx` component now automatically resolves the base URL based on the `backLink` parameter from the route, and passes it to all API functions.

## How It Works

### 1. BackLink to Config Key Mapping

The `getBaseUrlFromBackLink()` function in `crudFunctions.js` maps backLink patterns to configuration keys:

```javascript
'object-detection-training' → 'objectdetection'
'classification-training'   → 'classification'
'defect-detection-training' → 'defectdetection'
```

### 2. URL Resolution

The function uses `getUrl()` from `config.js` to resolve the actual API URL:

```javascript
// Example: backLink = 'classification-training'
const baseUrl = getBaseUrlFromBackLink('classification-training');
// Returns: 'http://192.168.1.177:5008/' (or configured URL)
```

### 3. Passing BaseURL to API Functions

All API functions now receive `baseUrl` as the first parameter:

```javascript
// Before
await getProjectClasses(projectName);

// After
await getProjectClasses(baseUrl, projectName);
```

## Implementation Details

### In crudFunctions.js

```javascript
export const getBaseUrlFromBackLink = (backLink) => {
  if (!backLink) return null;

  const keyMap = {
    'object-detection-training': 'objectdetection',
    'classification-training': 'classification',
    'defect-detection-training': 'defectdetection',
  };

  const key = keyMap[backLink] || keyMap[backLink.toLowerCase()];

  if (!key) {
    console.warn(`Unknown backLink: ${backLink}`);
    return null;
  }

  try {
    return getUrl(key);
  } catch (error) {
    console.error(`Error getting URL for backLink "${backLink}":`, error);
    return null;
  }
};
```

### In ProjectOverview.jsx

```javascript
function ProjectOverview() {
  const { backLink, projectId, projectName, version } = useParams();
  
  // Get baseUrl from backLink
  const baseUrl = getBaseUrlFromBackLink(backLink);
  if (!baseUrl) {
    throw new Error(`Unable to resolve base URL for backLink: ${backLink}`);
  }

  // All API calls now use baseUrl
  const fetchAnnotationType = async () => {
    const stats = await getProjectStats(baseUrl, projectName);
    // ...
  };

  const loadClasses = async (useBackendData) => {
    const backendClasses = await getProjectClasses(baseUrl, projectName);
    // ...
  };
  
  // ... other functions using baseUrl
}
```

## Updated API Functions in ProjectOverview

All of these functions now receive `baseUrl` as the first parameter:

- `getProjectStats(baseUrl, projectName)`
- `setAnnotationType(baseUrl, projectName, type)`
- `getProjectClasses(baseUrl, projectName)`
- `getProjectThumbnails(baseUrl, projectName)`
- `getProjectAnnotations(baseUrl, projectName)`
- `getProjectSegmentAnnotation(baseUrl, projectName)`
- `getProjectOcrAnnotations(baseUrl, projectName)`
- `saveProjectClasses(baseUrl, classes, projectName)`

## Error Handling

If the backLink cannot be resolved:
1. A warning is logged to the console
2. The function returns `null`
3. The component throws an error preventing initialization

This ensures that invalid backLinks are caught early.

## Adding New Backend Types

To add support for a new backend type:

1. **Update the keyMap in `getBaseUrlFromBackLink()`:**
   ```javascript
   const keyMap = {
     'your-new-training': 'yournewkey', // Add this line
     // ... existing mappings
   };
   ```

2. **Add the URL to `config.js`:**
   ```javascript
   export function getUrl(key) {
     const urls = {
       'yournewkey': 'https://your-api-url.com/',
       // ... existing URLs
     };
     // ...
   }
   ```

3. **The component will automatically work with the new backend type!**

## Benefits

- ✅ **Centralized Configuration**: All URLs are managed in `config.js`
- ✅ **Automatic Resolution**: No manual URL management per request
- ✅ **Type Safety**: Errors are caught early if backLink is invalid
- ✅ **Extensible**: Easy to add new backend types
- ✅ **Consistent**: All API calls use the same pattern
- ✅ **Environment Support**: Works across local dev, staging, and production URLs
