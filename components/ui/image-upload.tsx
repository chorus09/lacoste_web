"use client";


import { ImagePlus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageUploadProps {
   disabled?: boolean;
   onChange: (value: string) => void;
   onRemove: (value: string) => void;
   value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);
    
    const onUpload = (result: any) => {
      console.log('Upload result:', result);
      if (result && result.info && result.info.secure_url) {
        onChange(result.info.secure_url);
      }
    };
    
    if (!isMounted) {
        return null;
    }
    
  return (
  <div>
    {/* Блок с фото */}
    <div className="mb-4 flex items-center gap-4">
      {value.map((url) => (
        <div
          key={url}
          className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-green-500"
        >
          <div className="z-10 absolute top-2 right-2">
            <Button
              type="button"
              onClick={() => onRemove(url)}
              variant="destructive"
              size="icon"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          <Image
            src={url}
            alt="Image"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </div>
    
    {/* Блок с кнопкой загрузки */}
    <div className="flex items-center">
      <CldUploadWidget onSuccess={onUpload} uploadPreset="43t34tefeger43223432rs">
        {({ open }) => {
          const onClick = () => open();
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
              size="sm"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  </div>
);

};

export default ImageUpload;
