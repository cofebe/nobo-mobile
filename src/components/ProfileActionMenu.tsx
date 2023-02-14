import { IonItem, useIonViewDidEnter } from '@ionic/react';
import { useEffect, useState } from 'react';
import './ProfileActionMenu.css';

export interface ActionListItem {
  label: string;
  id: number;
  action?: () => void;
}

interface ProfileActionMenuProps {
  openSocialShare?: Function;
  style?: object;
  watchEvent?: Function;
  followEvent?: Function;
  connectEvent?: Function;
  shareEvent?: Function;
  items?: any;
}

const ProfileActionMenu: React.FC<ProfileActionMenuProps> = ({
  openSocialShare,
  style,
}) => {
  return (
    <IonItem style={style} className="urp-action-menu">
      <div
        onClick={(e) => {
          e.preventDefault();
          if (openSocialShare) {
            openSocialShare();
          }
        }}
      >
        <svg
          width="17"
          height="4"
          viewBox="0 0 17 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.73977 3.47954C2.70062 3.47954 3.47954 2.70062 3.47954 1.73977C3.47954 0.778921 2.70062 0 1.73977 0C0.778921 0 0 0.778921 0 1.73977C0 2.70062 0.778921 3.47954 1.73977 3.47954Z"
            fill="#1A3A35"
          ></path>
          <path
            d="M8.50002 3.47954C9.46087 3.47954 10.2398 2.70062 10.2398 1.73977C10.2398 0.778921 9.46087 0 8.50002 0C7.53918 0 6.76025 0.778921 6.76025 1.73977C6.76025 2.70062 7.53918 3.47954 8.50002 3.47954Z"
            fill="#1A3A35"
          ></path>
          <path
            d="M15.2603 3.47954C16.2211 3.47954 17 2.70062 17 1.73977C17 0.778921 16.2211 0 15.2603 0C14.2994 0 13.5205 0.778921 13.5205 1.73977C13.5205 2.70062 14.2994 3.47954 15.2603 3.47954Z"
            fill="#1A3A35"
          ></path>
        </svg>
      </div>
    </IonItem>
  );
};

export default ProfileActionMenu;
