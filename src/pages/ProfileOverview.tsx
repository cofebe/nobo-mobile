import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import {
  IonPage,
} from '@ionic/react';
import Profile from './Profile';
import StyleFeed from './StyleFeed';
import './ProfileOverview.scss';
import Toggle from '../components/Toggle';

interface ProfileOverviewProps {
    defaultToggled: boolean;
    myProfile?: boolean;
    showToggle?: Boolean;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({defaultToggled, myProfile = true, showToggle=true}) => {
    const [isToggled, setIsToggled] = useState(defaultToggled || false);
    const history = useHistory();
    const myProfileText = "MY PROFILE";
    const styleFeedText = "STYLE FEED"

    const handleClick = () => {
        setIsToggled(!isToggled);
    }

    return (
        <IonPage className="home-page-athlete-profile" style={{ backgroundColor: '#F9FBFB' }}>

            {showToggle && <Toggle
                className={`toggle-switch ${isToggled ? 'checked' : ''}`}
                labelOne={myProfileText}
                labelTwo={styleFeedText}
                isToggled={isToggled}
                onClick={handleClick}>
            </Toggle>}

            <div className="stylefeed-page" style={{display: `${isToggled ? 'none' : ''}`}}>
                <Profile myProfile={showToggle ? myProfile : false}/>
            </div>

            <div className="stylefeed-page" style={{display: `${isToggled ? '' : 'none'}`}}>
                <StyleFeed />
            </div>
        </IonPage>
    );
}

export default ProfileOverview;
