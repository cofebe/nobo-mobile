import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import { IonContent, IonPage, IonCard, IonCardContent, IonRow, IonCol, useIonViewWillEnter } from "@ionic/react";
import DonutGraph from "../components/DonutGraph";
import { OrdersResponse, TradesResponse } from "../models"
import "./SavingsAndSustainability.scss";
import "./SavingsPurchases.scss";
import "./SavingsTrades.scss";
import { UserService } from "../services/UserService";
import Toggle from '../components/Toggle';
import { formatPrice, getImageUrl } from "../utils";

const SavingsAndSustainabilityPage: React.FC = () => {

  const unmounted = useRef(false);


  const history = useHistory()
  const pointsData = [3, 5];
  // const pointsLabels = ["Current Points", "Points to Next Reward"];
  const userService = new UserService();
  const [myOrders, setMyOrders] = useState<OrdersResponse[]>([]);
  const [myTrades, setMyTrades] = useState<TradesResponse[]>([]);
  const [points, setPoints] = useState<number>();
  const [savingsAmount, setSavingsAmount] = useState<string>("");
  const [tradesSavings, setTradeSavings] = useState<number>(0)
  const [purchasesSavings, setpurchasesSavings] = useState<number>(0)


  const rewardNumber = Array.from(String(points), Number)

  // const pointsData = [1,5];
  const pointsLabels = ["Current Points", "Points to Next Reward"];



  const [isToggled, setIsToggled] = useState(false);
  const myPurchasesText = "PURCHASE SAVINGS";
  const mySavingsText = "TRADE SAVINGS";

  const handleClick = () => {
    setIsToggled(!isToggled);
  }

  function onLoad() {
    userService
      .getOrders()
      .then(orders => {
        if (orders) {
          setMyOrders([orders]);
        }
      });

    userService
      .getMyTrades()
      .then((trades: any) => {
        if (trades) {
          setMyTrades([trades]);

        }
      })
      .then(() => {

      })
      ;

    userService
      .getRewards()
      .then(reward => {
        if (reward) {
          setPoints(reward.points)
        }
      })

    console.log(points)
    setPoints(5)
  }

  useIonViewWillEnter(() => {
    onLoad()
  })

  function sumArray(numbers: any) {
    let totalSum = 0;
    for (let i = 0; i < numbers.length; i++) {
      totalSum += numbers[i];
    }
    return totalSum.toString();
  }


  useEffect(() => {

    getTradeSavings()
    getPurchaseSavings()

    return () => { unmounted.current = true }
  }, [myTrades])

  const getTradeSavings = () => {
    const acceptedTrades = myTrades[0]?.received.filter((p) => p.status === "accepted")
    const totalPriceArr = acceptedTrades?.map((p: any) => p.products?.offered.price)
    const totalFeeArr = acceptedTrades?.map((p: any) => p.salesTax.initiator.order_total_amount)
    const totalPrice = totalPriceArr?.reduce((total: any, num: any) => total + num, 0);
    const totalFee = totalFeeArr?.reduce((total: any, num: any) => total + num, 0);
    setTradeSavings(totalPrice - totalFee)
  }


  const getPurchaseSavings = () => {

    const retailPrice: any = myOrders[0]?.docs.map((p) => p.products.map((p) => p.retailPrice))
    const subTotal: any = myOrders[0]?.docs.map((p) => p.subtotal)
    let sum = 0

    let mainArr = []
    mainArr.push(retailPrice)
    const r = sumArray(mainArr)
    let retailPriceArr = []
    retailPriceArr.push(r)
    const numbers = retailPriceArr[0].split(',').map(Number);
    const totalRetail = numbers?.reduce((total, num) => total + num, 0);
    const totalSub = subTotal?.reduce((total: any, num: any) => total + num, 0);
    setpurchasesSavings(totalRetail - totalSub)

  }


  return (
    <IonPage className="savings-page">
      <IonRow>
        <IonCol className="savings-header" size="12">
          <div
            className="savings-back-btn"
            onClick={() => {
              history.goBack()
            }}
          >
            <img
              height={23}
              src="assets/images/arrow-left.svg"
              alt="logo"
            />
          </div>
          <div className="savings-title-text-container">SAVINGS & SUSTAINABILITY</div>
        </IonCol>
        <IonCol className="savings-header" size="12">
          <div className="savings-title-text-container savings-sub-title" style={{ textAlign: "left" }}>REWARDS</div>
        </IonCol>
      </IonRow>
      <IonContent className="rewards-content">
        <div className="rewards-container">
          <IonCard className="rewards-card">
            <IonCardContent>
              <IonRow>
                <IonCol className="savings-header" size="6">
                  <div className="rewards-graph">
                    <DonutGraph data={rewardNumber} labels={pointsLabels} />
              <p className='sustain-reward-g-text'>+{points}</p>

                  </div>
                </IonCol>
                <IonCol className="savings-header" size="6">
                  <div className="rewards-points">
                    <p className="savings-text">{pointsData[1]} POINTS FROM YOUR NEXT REWARD!</p>
                    <p className="savings-details"
                      onClick={() => {
                        history.push('/settings/saving/rewards')
                      }}
                    >DETAILS</p>
                  </div>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>
        </div>
        <IonRow>
          <IonCol className="savings-header" size="12">
            <div className="savings-title-text-container savings-sub-title" style={{ textAlign: "left" }}>SAVINGS</div>
          </IonCol>
          <IonCol className="savings-header" size="12">
            {/* <p className="savings-amount">${savingsAmount || "0.00"}</p> */}
            <p className="savings-amount">{formatPrice(tradesSavings + purchasesSavings) || 0}</p>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="savings-header" size="12">
            <div className="savings-title-text-container savings-sub-title" style={{ textAlign: "left" }}>SUSTAINABILITY</div>
          </IonCol>
          <IonCol className="savings-header" size="12"
          style={{marginBottom:20, marginTop:20}}
          >

              {/* <img src="assets/images/reward-tree.png" alt="reward tree" /> */}
            <div className="rewards-graph2">
            <img
              height={130}
              src="assets/images/reward-tree-01.png"
              alt="logo"
            />
              {/* <DonutGraph data={pointsData} labels={pointsLabels} /> */}
            </div>
          </IonCol>
        </IonRow>
        <IonRow>
          <Toggle
            className={`toggle-switch-savings ${isToggled ? 'checked' : ''}`}
            labelOne={myPurchasesText}
            labelTwo={mySavingsText}
            isToggled={isToggled}
            onClick={handleClick}>
          </Toggle>
        </IonRow>
        {isToggled && (
          <>
            <IonRow className="purchase-s-main-header-container1">
              <IonCol size="3" className="purchase-s-header-item-box">
                <p className="purchase-s-header-item-text">Item</p>
              </IonCol>
              <IonCol size="1.5"></IonCol>
              <IonCol size="2.5" className="purchase-s-header-retail-box">
                <p className="purchase-s-header-retail-text">Est. Retail Price</p>
              </IonCol>
              <IonCol size="2.5" className="purchase-s-header-price-box">
                <p className="purchase-s-header-price-text">TheNOBO Price</p>
              </IonCol>
              <IonCol size="2.5" className="purchase-s-header-savings-box">
                <p className="purchase-s-header-savings-text">Total Savins</p>
              </IonCol>
            </IonRow>

            {myOrders[0]?.docs.map((order) => (
              <div>
                {
                  order.products.map((singleProduct, index: any) => (
                    <IonRow className='purchase-s-main-container'>
                      <IonCol className='purchase-img-s-box' size='3'>
                        <div className="purchase-s-img"
                          style={{
                            backgroundImage: singleProduct.images?.length
                              ? getImageUrl(singleProduct.images[0]?.url)
                              : '',
                          }}
                        ></div>
                      </IonCol>
                      <IonCol size='1.5'></IonCol>
                      <IonCol className='purchase-retail-s-box' size='2.5'>
                        <p className='purchase-retail-s-text'>{formatPrice(singleProduct.retailPrice)}</p>
                      </IonCol>
                      <IonCol className='purchase-fee-s-box' size='2.5'>
                        <p className='purchase-fee-s-text'>{formatPrice(singleProduct.price)}</p>

                      </IonCol>
                      <IonCol className='purchase-saving-s-box' size='2.5'>
                        <p className='purchase-saving-s-text'>{formatPrice(singleProduct.retailPrice - singleProduct.price)}</p>
                      </IonCol>
                    </IonRow>
                  ))
                }
              </div>
            ))}
          </>
        )}
        {!isToggled && (
          <>
            <IonRow className="trades-s-main-header-container1">
              <IonCol size="3" className="trades-s-header-item-box">
                <p className="trades-s-header-item-text">Item</p>
              </IonCol>
              <IonCol size="1.5"></IonCol>
              <IonCol size="2.5" className="trades-s-header-retail-box">
                <p className="trades-s-header-retail-text">Est. Retail Price</p>
              </IonCol>
              <IonCol size="2.5" className="trades-s-header-price-box">
                <p className="trades-s-header-price-text">TheNOBO Price</p>
              </IonCol>
              <IonCol size="2.5" className="trades-s-header-savings-box">
                <p className="trades-s-header-savings-text">Total Savins</p>
              </IonCol>
            </IonRow>

            {myTrades[0]?.received.map((product: any) => product.status === 'accepted' && (
              <div>


                <IonRow className='trades-s-main-container'>
                  <IonCol className='trades-img-s-box' size='3'>
                    <div className="trades-s-img"
                      style={{
                        backgroundImage: product?.products?.offered.images?.length
                          ? getImageUrl(product?.products?.offered.images[0]?.url)
                          : '',
                      }}
                    ></div>
                  </IonCol>
                  <IonCol size='1.5'></IonCol>
                  <IonCol className='trades-retail-s-box' size='2.5'>
                    <p className='trades-retail-s-text'>{formatPrice(product?.products?.offered.retailPrice)}</p>
                  </IonCol>
                  <IonCol className='trades-fee-s-box' size='2.5'>
                    <p className='trades-fee-s-text'>{formatPrice(product?.fee)}</p>

                  </IonCol>
                  <IonCol className='trades-saving-s-box' size='2.5'>
                    <p className='trades-saving-s-text'>
                      {
                        formatPrice(product?.products?.offered.retailPrice
                          - product?.fee - product?.salesTax.initiator.shipping)
                      }
                    </p>
                  </IonCol>
                </IonRow>


              </div>
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SavingsAndSustainabilityPage;
