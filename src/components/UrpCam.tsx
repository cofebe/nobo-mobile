import { Camera, CameraResultType } from '@capacitor/camera';
import { useState } from 'react';
import './UrpCam.css';

interface UrpCamProps {
    active: Boolean;
    quality: number;
};

export const takePicture = async (ucp:UrpCamProps) => {
    const image = await Camera.getPhoto({
        quality: ucp.quality,
        allowEditing: true,
        resultType: CameraResultType.Base64
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    //var imageUrl = image.webPath;

    // Can be set to the src of an image now
   return image;
};

const UrpCam: React.FC<UrpCamProps> = ({active, quality}) => {
    const [imagePreview, setImagePreview] = useState({});
    return (
        <div className="urp-image-capture">
            <a href="#" onClick={async (e) => {
              e.preventDefault();
              let previewSrc = await takePicture({active: true, quality: 90}) || "";
              setImagePreview(previewSrc);
            }}>Capture Picture{imagePreview ? ` :${imagePreview}`: ""}</a>
        </div>
    );
};

export default UrpCam;
