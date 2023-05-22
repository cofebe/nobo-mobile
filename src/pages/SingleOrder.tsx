import { useRef, useState } from 'react'
import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonModal, IonPage, IonRow, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react'
import './SingleOrder.scss'
import { useHistory, useParams } from 'react-router'
import { UserService } from '../services/UserService'
import { FullOrder, User } from '../models'
import { getCardImage } from '../utils'







const SingleOrder: React.FC = () => {
	const userService = new UserService()
	const params = useParams()
	const userId: any = params

	const history = useHistory()
	const [productsData, setProductData] = useState<FullOrder[]>([])
	const [inputValue, setInputValue] = useState('')
	const [following, setFollowing] = useState(false)
const [showItem, setShowItem] = useState(false)


	useIonViewWillEnter(() => {
		userService.getOrder(userId.id)
			.then((products: FullOrder) => {
				if (products) {
					setProductData([products])
				} else { console.log("something went wrong") }
			})
			.catch((err) => { console.log("err info while fetching products ", err) })
	})

	useIonViewDidEnter(() => {
		const vendorId: any = history.location.state
		userService
			.getMe()
			.then((user: User) => {
				console.log("from location ", user.following.includes(vendorId, 0))
				if (user.following.includes(vendorId, 0)) {
					setFollowing(true)
				} else {
					setFollowing(false)
				}


			})
	})




	const followVendor = (vendorId: any) => {
		userService
			.getMe()
			.then((user: User) => {
				const result = user.following.includes(vendorId, 0)
				if (result) {
					userService.removeFollowUser(vendorId)
						.then(() => {
							setFollowing(false)
						})
						.catch((error) => { console.log(error) })

				} else {

					userService
						.followUsers(vendorId)
						.then(user => {
							if (user.following.includes(vendorId)) {
								setFollowing(true)
								console.log(' you have successfully followed ', vendorId);
							} else {
								console.log(' something went wrong, unable to follow ');
							}
						})
						.catch((err: any) => {
							console.log(' FollowUser', err);
						});
				}





			})
			.catch(error => {
				console.log('error msg while fetching user profile', error);
			});

	};




	const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

	const filteredProduct = productsData.filter(product =>
		product.products[0]?.name.toLowerCase().includes(inputValue.toLowerCase(), 0) ||
		product.products[0]?.brand.toLowerCase().includes(inputValue.toLowerCase(), 0)
	);

	console.log(filteredProduct)
	return (
		<IonPage className='order-details-item-main-container'>
			<IonHeader className="order-details-item-header">
				<IonToolbar className="order-details-item-header-toolbar">
					<IonGrid>
						<IonRow>
							<IonCol size="12" className="order-details-item-title">
								{/* <div className="order-details-item-title"> */}
								<div
									className="order-details-item-back-button"
									onClick={e => {
										e.preventDefault();
										e.stopPropagation();
										history.goBack();
									}}
								>
									<img src="assets/images/arrow-left.svg" alt="back" />
								</div>

								<p className='order-details-item-back-text'>Back To All Purchases</p>
								{/* </div> */}
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonToolbar>
			</IonHeader>
			{/* <div className='order-details-item-search-container'>
				<Search
					value={inputValue}
					onChange={(value) => setInputValue(value)}
				/>
			</div> */}
			<IonContent className='order-details-item-content'>

				{/* PURCHASE-ITEMS-CONTAINER */}
				{filteredProduct?.map((product: FullOrder) => (
					<IonRow key={product._id} className="order-details-item-container">

						<div className="order-details-item-info">
							<div className="order-details-item-order-date">
								<p style={{ color: '#ACACAC', textAlign: 'center' }}>ORDER DATE</p>
								<p style={{ textAlign: 'center' }}>
									{new Date(product.updatedAt).toDateString().slice(0 - 11)}
								</p>
							</div>
							<div className="order-details-item-order-num">
								<p style={{ color: '#ACACAC', textAlign: 'center' }}>ORDER NO.</p>
								<p style={{ textAlign: 'center' }}>{product.uniqueNumber}</p>
							</div>
							<div className="order-details-item-order-payment">
								<p style={{ color: '#ACACAC', textAlign: 'center' }} >PAYMENT METHOD</p>
								{/* <p style={{ textAlign: 'center' }} >{product.charge.payment_method_details.card.brand}</p> */}
								<img className='order-details-card-brand' src={getCardImage(product.charge.source.brand)} alt="card brand" />

							</div>
							<div className="order-details-item-order-status">
								<p style={{ color: '#ACACAC', textAlign: 'center' }}>STATUS</p>
								<p style={{ color: '#42D60E', textAlign: 'center' }}>{product.status}</p>
							</div>
						</div>



						<div className="order-details-item">
							<div className='order-details-item-img-container'>
								<img
									className='order-details-item-img'
									src={`https://staging.thenobo.com/${product.products[0].images[0]?.url}`} alt="img"
								/>
							</div>
							<div className='order-details-item-props'>
								<p className="order-details-item-name1">{product.products[0].brand}</p>
								<p className="order-details-item-name">{product.products[0].name}</p>
								<p className="order-details-item-src">
									purchased from <span style={{ color: '#D6980E' }}>@{product.products[0]?.vendor.displayName}</span>

								</p>
								{/* <p className="order-details-item-src">
									purchased from <span style={{ color: '#D6980E' }}>@{product.products[0]?.shipmentInfo.from_address.name.split(" ")[0].toLocaleLowerCase()}</span>

								</p> */}
								<p className="order-details-item-price">{currencyFormat.format(product.products[0].price)}</p>
							</div>
							<div className='order-details-item-view-container'>

							</div>
						</div>
						<IonRow>

							<IonCol className='order-details-item-msg-flw'>
								<IonButton size='small'>MESSAGE SELLER</IonButton>
								<IonButton size='small'
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										followVendor(product.fromVendors[0])
									}}
								>{following ? 'FOLLOWING' : 'FOLLOW SELLER'}</IonButton>
							<div style={{fontSize:'12px',  }} onClick={()=>setShowItem(!showItem)}>{showItem ? 'HIDE' : 'SHOW'}</div>
							</IonCol>
						</IonRow>

						<IonRow className={ showItem ? 'order-item-info-container': 'order-item-info-container-hide'}>
							<div className='order-item-img-container'>
								<img src={`https://staging.thenobo.com/${product.products[0].images[0]?.url}`} alt={product.products[0].name} />
							</div>
							<IonCol size='12' className='order-item-year-purchsed'>
								<p>{product.products[0].attributes[0].id.toUpperCase()}</p>
								<p>{product.products[0].attributes[0].value}</p>
							</IonCol>

							<IonCol size='12' className='order-item-year-purchsed'>
								<p>{product.products[0].attributes[1].id.toUpperCase()}</p>
								<p>{product.products[0].attributes[1].value}</p>
							</IonCol>

							<IonCol size='12' className='order-item-year-purchsed'>
								<p>{product.products[0].attributes[2].id.toUpperCase()}</p>
								<p>{product.products[0].attributes[2].value}</p>
							</IonCol>
							<IonCol size='12' className='order-item-year-purchsed'>
								<p>{product.products[0].attributes[3].id.toUpperCase()}</p>
								<p>{product.products[0].attributes[3].value}</p>
							</IonCol>
							<IonCol size='12' className='order-item-year-purchsed'>
								<p>{product.products[0].attributes[4].id.toUpperCase()}</p>
								<p>{product.products[0].attributes[4].value}</p>
							</IonCol>
							<IonCol size='12' className='order-item-year-purchsed'>
								<p>{product.products[0].attributes[5].id.toUpperCase()}</p>
								<p>{product.products[0].attributes[5].value}</p>
							</IonCol>

							<IonCol size='12' className='order-details-summary-title'>ORDER SUMMARY</IonCol>
						</IonRow>
						<IonRow className='order-details-general-class'>
							<IonCol>ORDER SUBTOTAL</IonCol>
							<IonCol className='order-details-general-col'>{currencyFormat.format(product.total)}</IonCol>
						</IonRow>
						<IonRow className='order-details-general-class'>
							<IonCol >SHIPPING</IonCol>
							<IonCol className='order-details-general-col'>{currencyFormat.format(product.shipping)}</IonCol>
						</IonRow>
						<IonRow className='order-details-general-class'>
							<IonCol >SALES TAX</IonCol>
							<IonCol className='order-details-general-col'>{currencyFormat.format(product.salesTax)}</IonCol>
						</IonRow>
						<IonRow className='order-details-general-class'>
							<IonCol >DISCOUNT CODE</IonCol>
							<IonCol style={{ color: '#D6980E' }} className='order-details-general-col'>
								{currencyFormat.format(product.products[0].summary.coupon)}
							</IonCol>
						</IonRow>

						<div className='order-details-value-line' style={{ backgroundColor: '#707070', height: '1px' }}></div>

						<IonRow style={{ color: '#D6980E', fontWeight: 700 }} className='order-details-general-class'>
							<IonCol >TOTAL</IonCol>
							<IonCol
								className='order-details-general-col'>
								{currencyFormat.format(product.total + product.shipping + product.salesTax - product.products[0].summary.coupon)}
							</IonCol>
						</IonRow>

						<div className='order-details-value-line' style={{ backgroundColor: '#707070', height: '1px' }}></div>

						<IonRow style={{ marginBottom: '14px' }}>
							<IonCol size='12' className='order-details-summary-title'>PAYMENT METHOD</IonCol>
							<IonCol style={{ fontWeight: 500 }} className='order-details-payment-method' size='12' >
								<img className='order-details-card-brand' src={getCardImage(product.charge.source.brand)} alt="card brand" />
								<p style={{ width: '74px' }}>**** {product.charge.payment_method_details.card.last4}</p>
								<p style={{ width: '74px' }}>
									Exp.{product?.charge.payment_method_details.card.exp_month}
									/{product?.charge.payment_method_details.card.exp_year.toString().slice(-2)}
								</p>
								<p>{product.customer.firstName + " " + product.customer.lastName}</p>
							</IonCol>
						</IonRow>

						<div className='order-details-value-line' style={{ backgroundColor: '#707070', height: '1px' }}></div>

						<IonRow style={{ marginBottom: '14px' }}>
							<IonCol size='12' className='order-details-summary-title'>BILLING ADDRESS</IonCol>
							<IonCol size='12' className='order-details-general-billing'>{product.shippingAddress.address1}</IonCol>
							<IonCol size='12' className='order-details-general-billing'>{product.shippingAddress.city}</IonCol>
							<IonCol size='12' className='order-details-general-billing'>{product.shippingAddress.state}</IonCol>
							<IonCol size='12' className='order-details-general-billing'>{product.shippingAddress.postalCode}</IonCol>
							<IonCol size='12' className='order-details-general-billing'>{product.shippingAddress.phone}</IonCol>
						</IonRow>
					</IonRow>

				))}

			</IonContent>
		</IonPage>
	)
}

export default SingleOrder
