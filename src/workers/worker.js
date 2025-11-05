
/* eslint-disable no-restricted-globals */
import JSZip from "jszip";


self.onmessage = async function (event) {
    const { file } = event.data;
    const zip = new JSZip();
    const zipContents = await zip.loadAsync(file);

    const folderImageCounts = {};
    const filePromises = [];

    zipContents.forEach((relativePath, zipEntry) => {
        if (zipEntry.dir) {
            return; // Skip directories
        }
        console.log(relativePath, "zipEntry.dir")
        const pathParts = relativePath.split('/');
        const folderName = pathParts.length > 1 ? pathParts[0] : '';

        // Check if the file is an image
        const isImage = /\.(jpg|jpeg|png|bmp)$/i.test(relativePath);
        if (isImage) {
            folderImageCounts[folderName] = (folderImageCounts[folderName] || 0) + 1;
            filePromises.push(
                zipEntry.async('blob').then((blob) => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            resolve({ url: e.target.result, folder: folderName });
                        };
                        reader.readAsDataURL(blob);
                    });
                })
            );
        }
    });

    const results = await Promise.all(filePromises);
    const mostImagesFolder = Object.keys(folderImageCounts).reduce((a, b) =>
        folderImageCounts[a] > folderImageCounts[b] ? a : b
    );

    const imageUrls = results
        .filter((result) => result.folder === mostImagesFolder)
        .map((result) => result.url);

    self.postMessage({ imageUrls, imageFolder: mostImagesFolder });
};

