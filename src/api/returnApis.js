import axios from "axios"
export const fetchThumbnail = async ({
    url,
    username,
    task,
    project,
    version,
    thumbnailName,
}) => {
    const response = await axios.get(
        `${url}get_thumbnails`,
        {
            params: {
                username,
                task: task,
                project,
                version,
                thumbnail_name: thumbnailName,
            },
        }
    );
    // console.log('Fetched thumbnail response:', response.data);

    return response.data;
};