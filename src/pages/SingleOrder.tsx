import { useRef, useState } from 'react'
import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonModal, IonPage, IonRow, IonToolbar, useIonViewWillEnter } from '@ionic/react'
import './SingleOrder.scss'
import { useHistory, useParams } from 'react-router'
import Search from '../components/Search'
import { UserService } from '../services/UserService'
import { FullOrder, OrdersResponse, User } from '../models'
import { getCardImage } from '../utils'







const SingleOrder: React.FC = () => {
	const userService = new UserService()
	const params = useParams()
	const userId: any = params

	const history = useHistory()
	const [productsData, setProductData] = useState<FullOrder[]>([])
	const [inputValue, setInputValue] = useState('')
	const [peopleIfollow, setPeopleIfollow] = useState<string[]>([]);
	const [following, setFollowing] = useState(false)
	const [sellerId, setsellerId] = useState<any>('')



	useIonViewWillEnter(() => {
		userService.getOrder(userId.id)
			.then((products: FullOrder) => {
				if (products) {
					// console.log("product res info ---",products.docs[0]?.products[0]?.attributes.map((att)=>att))
					setProductData([products])
					// setsellerId(products?.fromVendors[0])
					// console.log(products)
				} else { console.log("something went wrong") }
			})
			.catch((err) => { console.log("err info while fetching products ", err) })
	})

	useIonViewWillEnter(()=>{

			userService.getOrder(userId.id)
			.then((products: FullOrder) => {
				// console.log(products.fromVendors[0])
				setsellerId(products.fromVendors[0])



				userService
				.getMe()
				.then((user:User)=>{
					setPeopleIfollow(user.following)


				})
			})

	})




console.log("the people i follow ",peopleIfollow)
setTimeout(() => {
	console.log("the people i follow ", peopleIfollow.includes(sellerId, 0))
}, 4000);
	const followVendor = (vendorId: any) => {
		userService
			.getMe()
			.then((user: User) => {
				const result = user.following.includes(vendorId, 0)
				if (result === true) {
					console.log(result);
					userService.removeFollowUser(vendorId)
						.then((res) => {
							if (!peopleIfollow.includes(vendorId)) {
								setFollowing(false)
								console.log(' you have successfully unfollowed ', vendorId);
							} else {
								console.log(' something went wrong, unable to unfollow ');
							}
						})
						.catch((error) => { console.log(error) })

				} else {
					console.log(result);

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



	const formatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: '2-digit'
	})



	const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

	const filteredProduct = productsData.filter(product =>
		product.products[0]?.name.toLowerCase().includes(inputValue.toLowerCase(), 0) ||
		product.products[0]?.brand.toLowerCase().includes(inputValue.toLowerCase(), 0)
	);

	// console.log(productsData[0]?.docs?.map((pro: any) => pro.products[0]))
	// console.log("testing --> ",productsData.map((product)=>typeof(product._id)))
	// console.log("pr ",vendorId)
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
								<p style={{ textAlign: 'center' }}>{formatter.format(parseInt(product.createdAt))}</p>
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
									purchased from <span style={{ color: '#D6980E' }}>@{product.products[0]?.shipmentInfo.from_address.name.split(" ")[0].toLocaleLowerCase()}</span>

								</p>
								<p className="order-details-item-price">{currencyFormat.format(product.products[0].price)}</p>
							</div>
							<div className='order-details-item-view-container'>
								{/* <p className="purchase-item-view-text"
									onClick={() =>{
										 console.log("view details")
										history.push(`/settings/purchases/single-order/${product._id}`)
										}}
								>
									VIEW DETAILS</p> */}
							</div>
						</div>
						<IonRow>

							<IonCol className='order-details-item-msg-flw'>
								<IonButton size='small'>MESSAGE SELLER</IonButton>
								<IonButton size='small'
									onClick={(e) => {
										// e.preventDefault()
										// e.stopPropagation()
										followVendor(product.fromVendors[0])
									}}
								>{following? 'FOLLOWING' :'FOLLOW SELLER'}</IonButton>
							</IonCol>
						</IonRow>
						<div className='order-details-value-line' style={{ backgroundColor: '#707070', height: '1px' }}></div>
						<IonRow>
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
							<IonCol style={{ color: '#D6980E' }} className='order-details-general-col'>{currencyFormat.format(product.products[0].summary.coupon)}</IonCol>
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
								<p>**** {product.charge.payment_method_details.card.last4}</p>
								<p>Exp. {product?.charge.payment_method_details.card.exp_month}
									/ {product?.charge.payment_method_details.card.exp_year.toString().slice(-2)}</p>
								<p>{product.customer.firstName.toUpperCase() + " " + product.customer.lastName.toUpperCase()}</p>
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
