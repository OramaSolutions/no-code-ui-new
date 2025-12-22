// config.js
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

// Main backend API
// export const Url = 'https://nocode-node.oramasolutions.in/api/v1/';
export const Url = 'http://localhost:3100/api/v1/';

// Dynamic service resolver
export function getUrl(key) {
    const urls = {
       'defectdetection': 'https://nocode-defect-detection.oramasolutions.in/',
        // 'defectdetection': 'http://192.168.0.246:5000/',
        'classification': 'https://nocode-classification.oramasolutions.in/',
        // 'classification': 'http://192.168.1.177:5008/',
        'text-extraction': 'https://nocode-text-extraction.oramasolutions.in/',
        // 'objectdetection': 'https://nocode-object-detection.oramasolutions.in/'
        'objectdetection': 'http://192.168.1.177:5009/'
    };

    if (urls[key]) {
        return urls[key];
    } else {
        throw new Error(`Invalid key: ${key}`);
    }
}
