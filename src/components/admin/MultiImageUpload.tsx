import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, ImagePlus, Loader2, GripVertical } from "lucide-react";

interface MultiImageUploadProps {
  label?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
  placeholder?: string;
}

const MultiImageUpload = ({
  label = "Ảnh gallery",
  value = [],
  onChange,
  folder = "gallery",
  maxImages = 10,
  placeholder = "Kéo thả hoặc click để tải ảnh lên"
}: MultiImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [dragOver, setDragOver] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      handleFilesSelected(files);
    }
  }, [value, maxImages]);

  const handleFilesSelected = (files: File[]) => {
    const remainingSlots = maxImages - value.length - previewFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.warning(`Chỉ có thể thêm ${remainingSlots} ảnh nữa (tối đa ${maxImages} ảnh)`);
    }

    // Validate files
    const validFiles: { file: File; preview: string }[] = [];
    for (const file of filesToAdd) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} không phải là file ảnh`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} vượt quá 5MB`);
        continue;
      }
      validFiles.push({
        file,
        preview: URL.createObjectURL(file)
      });
    }

    if (validFiles.length > 0) {
      setPreviewFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFilesSelected(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePreview = (index: number) => {
    setPreviewFiles(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const removeUploadedImage = (index: number) => {
    const newUrls = [...value];
    newUrls.splice(index, 1);
    onChange(newUrls);
  };

  const uploadAllPreviews = async () => {
    if (previewFiles.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < previewFiles.length; i++) {
        const { file } = previewFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${i}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        setUploadProgress(prev => ({ ...prev, [i]: 0 }));

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        setUploadProgress(prev => ({ ...prev, [i]: 100 }));

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      // Clean up previews
      previewFiles.forEach(p => URL.revokeObjectURL(p.preview));
      setPreviewFiles([]);
      setUploadProgress({});

      // Update value with new URLs
      onChange([...value, ...uploadedUrls]);
      toast.success(`Đã tải lên ${uploadedUrls.length} ảnh`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Lỗi khi tải ảnh: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const totalImages = value.length + previewFiles.length;
  const canAddMore = totalImages < maxImages;

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium">
          {label} ({value.length}/{maxImages})
        </label>
      )}

      {/* Uploaded Images Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {value.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeUploadedImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Images (not yet uploaded) */}
      {previewFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Ảnh chờ tải lên ({previewFiles.length})
          </div>
          <div className="grid grid-cols-4 gap-2">
            {previewFiles.map((item, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={item.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border-2 border-dashed border-primary/50"
                />
                {uploadProgress[index] !== undefined && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-sm">
                      {uploadProgress[index]}%
                    </div>
                  </div>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePreview(index)}
                  disabled={uploading}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={uploadAllPreviews}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Tải lên {previewFiles.length} ảnh
              </>
            )}
          </Button>
        </div>
      )}

      {/* Upload Zone */}
      {canAddMore && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <ImagePlus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{placeholder}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Có thể chọn nhiều ảnh cùng lúc (tối đa 5MB/ảnh)
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
