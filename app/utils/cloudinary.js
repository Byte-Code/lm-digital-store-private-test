import cloudinary from 'cloudinary-core';

const cloudinaryName = 'leroymerlin';

const cl = cloudinary.Cloudinary.new({ cloud_name: cloudinaryName });
cl.config('cdn_subdomain', true);

export default function getUrl(imageId, options = {}) {
  const cleanImageId =
      imageId && imageId.charAt(0) === '/'
          ? imageId.substr(1)
          : imageId;

  const url = cl.url(cleanImageId, {
    crop: 'pad',
    default_image: 'no_image_available',
    flags: 'progressive',
    ...options,
  });

  return url;
}
