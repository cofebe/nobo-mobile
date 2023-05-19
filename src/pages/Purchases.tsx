import { useRef, useState } from 'react'
import { IonCol, IonContent, IonGrid, IonHeader, IonModal, IonPage, IonRow, IonToolbar, useIonViewWillEnter } from '@ionic/react'
import './Purchases.scss'
import { useHistory, } from 'react-router'
import Search from '../components/Search'
import { UserService } from '../services/UserService'
import { FullOrder, OrdersResponse } from '../models'







const Purchases: React.FC = () => {
	const userService = new UserService()
	const history = useHistory()
	const [productsData, setProductData] = useState<OrdersResponse[]>([])
	const [inputValue, setInputValue] = useState('')


	useIonViewWillEnter(() => {
		userService.getOrders()
			.then((products) => {
				if (products) {
					// console.log("product res info ---",products.docs[0]?.products[0]?.attributes.map((att)=>att))
					setProductData([products])
					 console.log(products)
				} else { console.log("something went wrong") }
			})
			.catch((err) => { console.log("err info while fetching products ", err) })
	})


	const formatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: '2-digit'
	})

	const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })



	const filteredProduct = productsData[0]?.docs?.filter(product =>
		product.products[0]?.name.toLowerCase().includes(inputValue.toLowerCase(), 0) ||
		product.products[0]?.brand.toLowerCase().includes(inputValue.toLowerCase(), 0)
	);

	// console.log(productsData[0]?.docs?.map((pro: any) => pro.products[0]))
	// console.log(filteredProduct)
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
			<div className='purchase-item-search-container'>
				<Search
					value={inputValue}
					onChange={(value) => setInputValue(value)}
				/>
			</div>
			<IonContent className='purchase-item-content'>

				{/* PURCHASE-ITEMS-CONTAINER */}
				{filteredProduct?.map((product: FullOrder) => (
					<div key={product._id} className="purchase-item-container">

						<div className="purchase-item-info">
							<div className="purchase-item-order-date">
								<p style={{ color: '#ACACAC', textAlign: 'center' }}>ORDER DATE</p>
								<p style={{ textAlign: 'center' }}>{formatter.format(parseInt(product.createdAt))}</p>
							</div>
							<div className="purchase-item-order-num">
								<p style={{ color: '#ACACAC', textAlign: 'center' }}>ORDER NO.</p>
								<p style={{ textAlign: 'center' }}>{product.uniqueNumber}</p>
							</div>
							<div className="purchase-item-order-payment">
								<p style={{ color: '#ACACAC', textAlign: 'center' }} >PAYMENT METHOD</p>
								<p style={{ textAlign: 'center' }} >{product.charge.payment_method_details.card.brand}</p>
							</div>
							<div className="purchase-item-order-status">
								<p style={{ color: '#ACACAC', textAlign: 'center' }}>STATUS</p>
								<p style={{ color: '#42D60E', textAlign: 'center' }}>{product.status}</p>
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
								<p className="purchases-item-src">purchased from <span style={{ color: '#D6980E' }}>@{product.products[0]?.shipmentInfo.from_address.name.split(" ")[0].toLocaleLowerCase()}</span></p>
								<p className="purchases-item-price">{currencyFormat.format(product.products[0].price)}</p>
							</div>
							<div className="purchase-item-view-container">
								<p className="purchase-item-view-text"
									onClick={() => {
										console.log("view details")
										history.push({ pathname: `/settings/purchases/single-order/${product._id}`, state: {} })
									}}
								>
									VIEW DETAILS</p>
							</div>
						</div>

					</div>

				))}
			</IonContent>
		</IonPage>
	)
}

export default Purchases
