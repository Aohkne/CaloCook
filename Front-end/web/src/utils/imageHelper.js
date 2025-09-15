export const getWebImagePath = (imagePath) => {
  if (!imagePath) return '/img/default-img.png';

  if (imagePath.startsWith('@assets/img/')) {
    return imagePath.replace('@assets/img/', '/img/');
  }

  return imagePath;
};
