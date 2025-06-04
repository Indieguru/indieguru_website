"use client"

import { useState, useRef } from "react"
import { Upload, Image, Loader2 } from "lucide-react"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"

function ProfilePictureModal({ isOpen, onClose, currentPicture, onSave }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(currentPicture)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.match("image.*")) {
      setError("Please select an image file (JPEG, PNG, etc.)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setError("")
    setSelectedFile(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError("")

    try {
      await onSave(selectedFile)
      onClose()
    } catch (error) {
      console.error("Error uploading image:", error)
      setError("An error occurred while uploading. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Profile Picture">
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-2 border-[#d8d8d8] flex items-center justify-center bg-[#f9fbff]">
          {previewUrl ? (
            <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
          ) : (
            <Image className="w-16 h-16 text-[#676767]" />
          )}
        </div>

        {error && <div className="text-[#ff3e02] text-sm mb-4 text-center">{error}</div>}

        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="border border-[#003265] text-[#003265] bg-white hover:bg-[#f5f5f5] flex items-center gap-2"
          >
            <Upload size={16} />
            Select Image
          </Button>
        </div>

        <p className="text-xs text-[#676767] mb-4 text-center">
          Supported formats: JPEG, PNG, GIF
          <br />
          Maximum file size: 5MB
        </p>

        <div className="flex justify-end gap-2 w-full pt-4 border-t border-[#d8d8d8]">
          <Button
            onClick={onClose}
            className="border border-[#676767] text-[#676767] bg-white hover:bg-[#f5f5f5]"
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            className="bg-blue-800 text-white hover:bg-[#143d65] flex items-center gap-2"
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload & Save"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ProfilePictureModal

