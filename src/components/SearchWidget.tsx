import {
    IonItem,
    IonRow,
    IonCol,
    IonNote,
    IonAvatar,
    IonLabel,
    IonInput,
} from '@ionic/react';
import { useState } from 'react';
import './SearchWidget.css';

interface SearchWidgetProps {
    placeholder: string;
}

const SearchWidget: React.FC<SearchWidgetProps> = ({ placeholder }) => {
    return (
        <div className='urp-search-widget-wrapper'>
            <svg className='urp-search-widget' width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_816_9559)">
                    <circle cx="22.5" cy="22.5" r="14.5" fill="white" />
                </g>
                <g clip-path="url(#clip0_816_9559)">
                    <path d="M30.8906 30.05L26.8594 26.0188C26.7875 25.9469 26.6938 25.9094 26.5938 25.9094H26.2719C27.3438 24.75 28 23.2031 28 21.5C28 17.9094 25.0906 15 21.5 15C17.9094 15 15 17.9094 15 21.5C15 25.0906 17.9094 28 21.5 28C23.2031 28 24.75 27.3438 25.9094 26.275V26.5938C25.9094 26.6938 25.95 26.7875 26.0188 26.8594L30.05 30.8906C30.1969 31.0375 30.4344 31.0375 30.5813 30.8906L30.8906 30.5813C31.0375 30.4344 31.0375 30.1969 30.8906 30.05ZM21.5 27C18.4594 27 16 24.5406 16 21.5C16 18.4594 18.4594 16 21.5 16C24.5406 16 27 18.4594 27 21.5C27 24.5406 24.5406 27 21.5 27Z" fill="#00D6B6" />
                </g>
                <defs>
                    <filter id="filter0_d_816_9559" x="0" y="0" width="45" height="45" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset />
                        <feGaussianBlur stdDeviation="4" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_816_9559" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_816_9559" result="shape" />
                    </filter>
                    <clipPath id="clip0_816_9559">
                        <rect width="16" height="16" fill="white" transform="translate(15 15)" />
                    </clipPath>
                </defs>
            </svg>
            <IonItem lines='none' className="urp-top-search-box">
                {/* <IonLabel className="urp-top-search-box-label" >Search</IonLabel> */}
                <IonInput className="urp-top-search-box-input"></IonInput>
            </IonItem>
        </div>
    );
};

export default SearchWidget;
