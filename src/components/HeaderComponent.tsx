import { IonCol, IonPage, IonRow } from '@ionic/react'
import React from 'react'
import { useHistory } from 'react-router'
import './HeaderComponent.scss'

interface HeaderProps {
  title?: string
}

const HeaderComponent: React.FC<HeaderProps> = ({ title }) => {
  const history = useHistory()


  return (
    <IonRow>
      <IonCol size='12' style={{ height: '160px' }}>
        <div
          onClick={() => {
            history.goBack();
          }}
          className="header-comp-back-btn"
        >
          <img
            height={38}
            src="assets/images/arrow-left.svg"
            alt="logo"
          />
        </div>
        <div
          className="header-comp-nobo-logo">
          <img height={65} src="assets/images/nobo_logo.png" alt="logo" />
        </div>
      </IonCol>
    </IonRow>
  )
}

export default HeaderComponent
