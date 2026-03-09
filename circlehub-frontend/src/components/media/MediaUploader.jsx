import { useState, useRef } from 'react';
import { mediaService } from '../../services/api';
import { X, Upload, Image, Video, File } from 'lucide-react';

const MediaUploader = ({ onUploadComplete, maxFiles = 5, accept = 'image/*,video/*' }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    if (files.length + newFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }

    // Filter valid files
    const validFiles = newFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit

      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }

      return isImage || isVideo;
    });

    setFiles([...files, ...validFiles]);

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, {
          file: file,
          url: reader.result,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      let uploadedUrls = [];

      if (files.length === 1) {
        const response = await mediaService.uploadFile(files[0]);
        uploadedUrls = [response.data.url];
      } else {
        const response = await mediaService.uploadMultiple(files);
        uploadedUrls = response.data.urls;
      }

      onUploadComplete(uploadedUrls);
      
      // Reset
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (type) => {
    if (type === 'image') return <Image className="w-5 h-5" />;
    if (type === 'video') return <Video className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-3">
          <Upload className="w-12 h-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Drop files here or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
              >
                browse
              </button>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Images and videos up to 50MB (max {maxFiles} files)
            </p>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                {preview.type === 'image' ? (
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={preview.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
              </div>

              {/* File Type Badge */}
              <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                {getFileIcon(preview.type)}
                <span>{preview.type}</span>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full 
                  opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>

              {/* File Info */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs truncate">
                {preview.file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setFiles([]);
              setPreviews([]);
            }}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            disabled={uploading}
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={uploadFiles}
            disabled={uploading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
