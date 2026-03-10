import { storage } from 'app/lib/firebase'
import { deleteObject, ref } from 'firebase/storage'

/**
 * Deletes an image or video from Firebase Storage.
 * @param {string} fileName - The name of the file to delete.
 * @param {"image" | "video"} type - The type of the file (image or video).
 * @returns {Promise<void>} - Resolves if the deletion is successful.
 */
export const deleteFileFromFirebase = async (fileName: string, type: 'image' | 'video' = 'image'): Promise<void> => {
  if (!fileName) {
    throw new Error('No file name provided')
  }

  try {
    // Create a storage reference to the file
    const filePath = `${type}s/${fileName}` // Match the upload folder structure
    const fileRef = ref(storage, filePath)

    // Delete the file
    await deleteObject(fileRef)
  } catch (error) {
    throw error // Optionally rethrow the error
  }
}
