const getUpdatedAttributes = (original: any, updated: any) => {
  return Object.keys(updated).reduce((acc: any, key) => {
    if (original[key] !== updated[key]) {
      acc[key] = updated[key];
    }
    return acc;
  }, {});
};

export default getUpdatedAttributes;
