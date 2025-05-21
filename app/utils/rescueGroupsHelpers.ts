const getPicturesAndVideos = (response: any) => {
  if (!Array.isArray(response?.data)) {
    console.error(
      "Error: No response data from Rescue Groups: ",
      response?.data
    );
    return;
  }

  const pictures: { objId: string; url: string }[] = [];
  const videos: { objId: string; video: any }[] = [];

  // Initialize photos and videos attributes
  response.data.forEach((item: any) => {
    item.attributes.photos = [];
    item.attributes.videos = [];
  });

  // Extract picture URLs
  const pictureUrls = response.included
    ?.filter((item: any) => item.type === "pictures")
    ?.map((item: any) => item.attributes.original.url);

  // Extract video URLs
  const videoUrls = response.included
    ?.filter((item: any) => item.type === "videourls")
    ?.map((item: any) => ({
      url: item.attributes.url,
      urlThumbnail: item.attributes.urlThumbnail,
      id: item.id,
    }));

  // Populate pictures array based on matching IDs
  response.data.forEach((item: any) => {
    pictureUrls?.forEach((url: any) => {
      if (url.includes(item.id)) {
        pictures.push({ objId: item.id, url });
      }
    });

    videoUrls?.forEach((video: any) => {
      if (item?.relationships?.videourls?.data[0]?.id === video.id) {
        videos.push({ objId: item.id, video });
      }
    });
  });

  // Assign photos and videos back to the original objects
  response.data.forEach((item: any) => {
    item.attributes.photos = pictures
      .filter((p: any) => p.objId === item.id)
      .map((p: any) => p.url);

    item.attributes.videos = videos
      .filter((v: any) => v.objId === item.id)
      .map((v: any) => v.video);
  });

  return response.data;
};

const fetchDataFromApi = async (baseQuery: any) => {
  const promises = Array.from({ length: 6 }, (_, index) =>
    baseQuery(
      `https://api.rescuegroups.org/v5/public/orgs/5798/animals/search/dogs?sort=-animals.adoptedDate&page=${
        index + 1
      }&limit=250`
    )
  );
  const response = await Promise.all(promises);
  return response;
};

export { getPicturesAndVideos, fetchDataFromApi };
