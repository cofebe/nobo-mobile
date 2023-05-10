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

const ProfileActionMenu: React.FC<ProfileActionMenuProps> = ({ openSocialShare, style }) => {
  return (
    <IonItem style={style} className="nobo-action-menu">
      <div
        onClick={e => {
          e.preventDefault();
          if (openSocialShare) {
            openSocialShare();
          }
        }}
        style={{ position: 'absolute', top: '0' }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_475_9463)">
            <path
              d="M3.33333 8.00002C3.33333 7.07955 2.58714 6.33335 1.66667 6.33335C0.746192 6.33335 0 7.07955 0 8.00002C0 8.92049 0.746192 9.66669 1.66667 9.66669C2.58714 9.66669 3.33333 8.92049 3.33333 8.00002Z"
              fill="#707070"
            />
            <path
              d="M9.66659 8.00002C9.66659 7.07955 8.92039 6.33335 7.99992 6.33335C7.07944 6.33335 6.33325 7.07955 6.33325 8.00002C6.33325 8.92049 7.07944 9.66669 7.99992 9.66669C8.92039 9.66669 9.66659 8.92049 9.66659 8.00002Z"
              fill="#707070"
            />
            <path
              d="M16.0001 8.00002C16.0001 7.07955 15.2539 6.33335 14.3334 6.33335C13.4129 6.33335 12.6667 7.07955 12.6667 8.00002C12.6667 8.92049 13.4129 9.66669 14.3334 9.66669C15.2539 9.66669 16.0001 8.92049 16.0001 8.00002Z"
              fill="#707070"
            />
          </g>
          <defs>
            <clipPath id="clip0_475_9463">
              <rect width="16" height="16" fill="white" transform="matrix(0 -1 1 0 0 16)" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </IonItem>
  );
};

export default ProfileActionMenu;
