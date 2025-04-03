'use server'

import { writeFile } from 'fs/promises'
import path from 'path'

export async function uploadImages(formData) {
  const files = formData.getAll('image')
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images')

  const savedFiles = []

  for (const file of files) {
    const buffer = await file.arrayBuffer()
    const fileName = `image_${Date.now()}_${file.name}`
    const filePath = path.join(uploadDir, fileName)

    try {
      await writeFile(filePath, Buffer.from(buffer))
      savedFiles.push(`/uploads/images/${fileName}`)
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }

  return savedFiles
}

