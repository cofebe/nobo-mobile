import { IonButton, IonContent, IonPage, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react'
import { useHistory } from 'react-router';
import './TradesCompleted.scss'





const TradesCompleted: React.FC = () => {
	const history = useHistory()
const [currentParams, setSurrentParams] = useState('')





useIonViewWillEnter(()=>{
	const location = history.location.pathname
	const params = location.split("/")[2]
	setSurrentParams(params)


})




	return (
		<IonPage className='trades-completed-main-container'>
			<IonContent className='trades-completed-ion-content' >
				<div className='trades-completed-header-container'>
					<img
						onClick={() => { history.goBack() }}
						className="trades-completed-back-btn"
						src="assets/images/arrow-left.svg"
						alt="logo"
					/>
						<p className='trades-completed-title-text-container'>MY TRADES</p>
					<div
					className='trades-completed-switch-container'

						onClick={e => {
							e.preventDefault();
							history.push(`/settings/trades`);
						}}
					>
						<img src='assets/images/trades-completed.png' alt="" />
					</div>

				</div>



			</IonContent>
		</IonPage>

	)
}

export default TradesCompleted
