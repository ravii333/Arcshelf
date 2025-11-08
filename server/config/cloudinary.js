import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    const isPdf = ext === 'pdf';

    return {
      folder: 'ArcShelf/papers',
      resource_type: isPdf ? 'raw' : 'image',
      access_mode: 'public',
      allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-').toLowerCase()}`,
    };
  },
});

export { cloudinary, storage };
