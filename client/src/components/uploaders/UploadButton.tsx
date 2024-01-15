"use client";
import { CldUploadButton } from "next-cloudinary";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import { useToast } from "../ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { AxiosInstanceClient } from "@/lib/axiosConfigClient";
import { IImageItem } from "@/types/image.interface";
import { CloudinaryUploadResult } from "@/types/cloudinaryUploadResult.interface";

const UploadButton = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;
  const uploadImage = async (results: CloudinaryUploadResult) => {
    await AxiosInstanceClient.post<IImageItem>("/images", {
      link: results.info.secure_url,
      cloudinaryId: results.info.public_id,
    });
    router.refresh();
  };

  return (
    <Button asChild>
      <CldUploadButton
        uploadPreset={process.env.CLOUDINARY_UPLOADPRESET}
        className="flex gap-2"
        onUpload={(results) => uploadImage(results as CloudinaryUploadResult)}
      >
        <Upload size={18} />
        Upload
      </CldUploadButton>
    </Button>
  );
};

export default UploadButton;
