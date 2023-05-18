import { IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonToolbar, useIonViewWillEnter } from '@ionic/react'
import React, { useState } from 'react'
import './Purchases.scss'
import { useHistory } from 'react-router'
import Search from '../components/Search'
import { UserService } from '../services/UserService'
import { FullOrder, OrdersResponse, Product } from '../models'






const Purchases: React.FC = () => {
	const [productsData, setProductData] = useState<OrdersResponse[]>([])
	const userService = new UserService()
	const history = useHistory()


	useIonViewWillEnter(() => {
		userService.getOrders()
			.then((products) => {
				if (products) {
					// console.log("product res info ---",products.docs[0]?.products[0]?.attributes.map((att)=>att))
					setProductData([products])
					// console.log(products)
				} else { console.log("something went wrong") }
			})
			.catch((err) => { console.log("err info while fetching products ", err) })
	})



	let newArr: OrdersResponse = productsData[0]
	const products = newArr?.docs[0]?.products
	console.log(productsData[0]?.docs?.map((pro: any) => pro.products[0]))

	return (
		<IonPage className='purchase-item-main-container'>
			<IonHeader className="purchase-item-header">
				<IonToolbar className="purchase-item-header-toolbar">
					<IonGrid>
						<IonRow>
							<IonCol size="12">
								<div className="purchase-item-title">
									<div
										className="purchase-item-back-button"
										onClick={e => {
											e.preventDefault();
											e.stopPropagation();
											history.goBack();
										}}
									>
										<img src="assets/images/arrow-left.svg" alt="back" />
									</div>
									MY PURCHASES
								</div>
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonToolbar>
			</IonHeader>
			<div className='purchase-item-search-container'
			>
				<Search
					onChange={() => { }}
				/>
			</div>
			<IonContent className='purchase-item-content'>

				{/* PURCHASE-ITEMS-CONTAINER */}
				{productsData[0]?.docs?.map((product: FullOrder) => (
					<div className="purchase-itsem-container">

						<div className="purchase-item-info">
							<div className="purchase-item-order-date">
								<p style={{ color: '#ACACAC', textAlign: 'center' }}>ORDER DATE</p>
								<p style={{ textAlign: 'center' }}>{
									new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(parseInt(product.products[0].updatedAt)).split(",")[0]


								}</p>
							</div>
							<div className="purchase-item-order-num">
								<p style={{ color: '#ACACAC', textAlign: 'center' }}>ORDER NO.</p>
								<p style={{ textAlign: 'center' }}>123456</p>
							</div>
							<div className="purchase-item-order-payment">
								<p style={{ color: '#ACACAC', textAlign: 'center' }} >PAYMENT METHOD</p>
								<p>08 JAN 2023</p>
							</div>
							<div className="purchase-item-order-status">
								<p style={{ color: '#ACACAC', textAlign: 'center' }}>STATUS</p>
								<p style={{ color: '#42D60E', textAlign: 'center' }}>SHIPPED</p>
							</div>
						</div>



						<div className="purchase-item">
							<div className='purchases-item-img-container'>

								<img
									className='purchases-item-img'
									src={`https://staging.thenobo.com/${product.products[0].images[0]?.url}`} alt="img"
								/>
							</div>
							<div className="purchse-item-props">
								<p className="purchases-item-name1">{product.products[0].brand}</p>
								<p className="purchases-item-name">{product.products[0].name}</p>
								<p className="purchases-item-src">purchased from <span>{product.products[0]?.shipmentInfo.from_address.name}</span></p>
								<p className="purchases-item-price">${product.products[0].price}</p>
							</div>
							<div className="purchase-item-view-container">
								<p className="purchase-item-view-text">VIEW DETAILS</p>
							</div>
						</div>

					</div>

				))}
			</IonContent>
		</IonPage>
	)
}

export default Purchases
