//import { useState } from "react";
//import {
//  useIonLoading,
//  useIonViewWillEnter,
//} from "@ionic/react";
import "./ImageZoom.scss";
//import { loadingOptions } from '../util';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface ImageZoomProps {
  show: boolean;
  imageUrl: string;
  onClose: () => void;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ show, imageUrl, onClose }) => {

  function close() {
    if (onClose) {
      onClose();
    }
  }

  return (
    <div className={'urp-image-zoom ' + (show ? 'show' : 'hide')}>
      <TransformWrapper >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <div className="tools">
              <div className="close" onClick={(item: any) => {
                close();
                resetTransform();
                zoomOut(0);
              }}

              >
                <svg width="17" height="17" viewBox="0 0 13 14" opacity="0.7" fill="none" xmlns="http://www.w3.org/2000/svg"
                  //onClick={(item: any) => {
                  //  close();
                  //  resetTransform();
                  //  zoomOut(0);
                  //}}
                >
                  <path d="M12.0669 0.183281C12.3112 0.427656 12.3112 0.822655 12.0669 1.06703L8.13375 5.00016H11C11.3456 5.00016 11.625 5.28016 11.625 5.62516C11.625 5.97016 11.3456 6.25016 11 6.25016H7.875C6.84125 6.25016 6 5.40891 6 4.37516V1.25016C6 0.905156 6.27938 0.625156 6.625 0.625156C6.97062 0.625156 7.25 0.905156 7.25 1.25016V4.11641L11.1831 0.183281C11.4275 -0.0610937 11.8225 -0.0610937 12.0669 0.183281Z" fill="#1a3a35" />
                  <path d="M0.183369 13.317C-0.0610059 13.0726 -0.0610059 12.6776 0.183369 12.4332L4.11649 8.50009L1.25024 8.50009C0.904619 8.50009 0.625244 8.22009 0.625244 7.87509C0.625244 7.53009 0.904619 7.25009 1.25024 7.25009L4.37524 7.25009C5.40899 7.25009 6.25024 8.09134 6.25024 9.12509L6.25024 12.2501C6.25024 12.5951 5.97087 12.8751 5.62524 12.8751C5.27962 12.8751 5.00024 12.5951 5.00024 12.2501L5.00024 9.38384L1.06712 13.317C0.822744 13.5613 0.427744 13.5613 0.183369 13.317Z" fill="#1a3a35" />
                </svg>

              </div>
            </div>
            <TransformComponent wrapperClass="zoom-wrapper" contentClass="zoom-content">
              <img style={{ height: "100%", width: "100%", margin: "auto" }} src={imageUrl} alt="zoom" />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default ImageZoom;
