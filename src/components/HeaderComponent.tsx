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
		<IonRow >
			<IonCol size='12' style={{ height: '110px' }}>
				<img
					onClick={() => {
						history.goBack();
					}}
					className="header-comp-back-btn"
					src="assets/images/arrow-left.svg"
					alt="logo"
				/>
				<div className="header-comp-nobo-logo">
					<img height={65} src="assets/images/nobo_logo.png" alt="logo" />
				</div>
			</IonCol>
		</IonRow>
	)
}

export default HeaderComponent
