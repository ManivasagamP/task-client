import { uploadToCloudinary } from './cloudinary.js'

export const uploadImageToCloudinary = async (file) => {
  try {
    validateImageFile(file)
    
    const secureUrl = await uploadToCloudinary(file)
    
    return secureUrl
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw error
  }
}

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
  }
  
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 5MB')
  }
  
  return true
}

export const uploadImageToPublic = uploadImageToCloudinary