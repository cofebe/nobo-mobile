import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import { IonContent, IonPage, IonCard, IonCardContent, IonRow, IonCol, useIonViewWillEnter, useIonViewDidEnter, IonModal } from "@ionic/react";
import DonutGraph from "../components/DonutGraph";
import { OrdersResponse, TradesResponse } from "../models"
import "./SavingsAndSustainability.scss";
import "./SavingsPurchases.scss";
import "./SavingsTrades.scss";
import { UserService } from "../services/UserService";
import Toggle from '../components/Toggle';
import { formatPrice, getImageUrl } from "../utils";

const sustainabilityOptions = [
  {
    text: 'The EPA estimates that around 85% of all textiles (roughly 13 million tons) thrown away in the United States either end up in landfills or are incinerated.',
    source: 'EPA',
    link: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/textiles-material-specific-data'
  },
  {
    text: 'We’ll need three times as many natural resources by 2050 if consumption continues at its current rate.',
    source: 'ORGANISATION FOR ECONOMIC CO-OPERATION AND DEVELOPMENT',
    link: 'https://www.oecd.org/env/indicators-modelling-outlooks/oecdenvironmentaloutlookto2050theconsequencesofinaction-keyfactsandfigures.htm'
  },
  {
    text: 'Children under the age of age 18 account for 60% of those who labor in the global fashion industry, making child labor one of the biggest fast fashion problems.',
    source: 'ECOFRIENDLYHABITS',
    link: 'https://www.ecofriendlyhabits.com/fashion-industry-facts/'
  },
  {
    text: 'Children under the age of age 18 account for 60% of those who labor in the global fashion industry, making child labor one of the biggest fast fashion problems.',
    source: 'ECOFRIENDLYHABITS',
    link: 'https://www.ecofriendlyhabits.com/fashion-industry-facts/'
  },{
    text: 'The textile industry is responsible for approximately 25% of global chemical output.',
    source: 'SEWDYNAMIC',
    link: 'https://www.sewdynamic.com/pages/polyester-industry'
  },{
    text: 'The fast fashion industry contributes to climate change, more than international aviation and shipping combined. Clothing production is the third biggest manufacturing industry following the automotive and technology industries.',
    source: 'GOOD ON YOU',
    link: 'https://goodonyou.eco/fast-fashion-facts/'
  },{
    text: 'Certain materials used to create shoes that end up in landfill will still be there in 1,000 years.',
    source: 'THE GUARDIAN',
    link: 'https://www.theguardian.com/environment/2009/aug/23/repair-trainers-ethical-living'
  },{
    text: 'According to Eco Watch, over 70% of the rivers and lakes in China are contaminated with over 2.5 billion gallons of wastewater from the dye and textile industries.',
    source: 'ECOWATCH',
    link: 'https://www.ecowatch.com/fast-fashion-riverblue-2318389169.html'
  },{
    text: 'As much as 35% of micro plastic flows into the ocean are because of fast fashion production.',
    source: 'THE STATE OF FASHION, 2020',
    link: 'https://www.mckinsey.com/~/media/mckinsey/industries/retail/our%20insights/the%20state%20of%20fashion%202020%20navigating%20uncertainty/the-state-of-fashion-2020-final.pdf'
  },{
    text: 'The EPA reports that landfills received 10.5 million tons of textiles in 2015, representing 7.6% of US landfills. An additional 2.45 million tons were recycled and 3.05 million were incinerated.',
    source: 'EPA',
    link: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/textiles-material-specific-data'
  },{
    text: 'Due to clothing underutilization and the lack of recycling and donation, more than $500 Billion of value is lost annually.',
    source: 'GOOD ON YOU',
    link: 'https://goodonyou.eco/fast-fashion-facts/'
  },{
    text: 'Roughly 80% of the world’s garment workers are women, where low wages and unsafe working conditions are alarmingly prevalent.',
    source: 'THE GUARDIAN',
    link: 'https://www.theguardian.com/sustainable-business/2016/mar/08/fashion-industry-protect-women-unsafe-low-wages-harassment'
  },{
    text: 'An estimated 8000 types of chemicals, including carcinogens and hormone disruptors, are utilized in fashion manufacturing.',
    source: 'COMPARE ETHICS',
    link: 'https://compareethics.com/chemicals-in-clothing/'
  },{
    text: 'People wear their fast fashion garments less than 5 times and keep for 35 days. This produces over 400% more carbon emissions per item per year than those garments that are worn 50 times and kept for one full year.',
    source: 'FORBES',
    link: 'https://www.forbes.com/sites/jamesconca/2015/12/03/making-climate-change-fashionable-the-garment-industry-takes-on-global-warming/?sh=4f39c77979e4'
  },
]

const SavingsAndSustainabilityPage: React.FC = () => {

  const unmounted = useRef(false);


  const history = useHistory()
  const userService = new UserService();
  const [myOrders, setMyOrders] = useState<OrdersResponse[]>([]);
  const [myTrades, setMyTrades] = useState<TradesResponse[]>([]);
  const [rewardPoints, setRewardPoints] = useState<number>(0);
  const [untilNextReward, setUntilNextReward] = useState<number>(0);
  const [savingsAmount, setSavingsAmount] = useState<string>("");
  const [tradesSavings, setTradeSavings] = useState<number>(0)
  const [purchasesSavings, setpurchasesSavings] = useState<number>(0)

  const pointsData = [rewardPoints, untilNextReward];
  const pointsLabels = ["Current Points", "Points to Next Reward"];

  const [sustainabilityOption, setSustainabilityOption] = useState(sustainabilityOptions[0]);

  const [isToggled, setIsToggled] = useState(false);
  const myPurchasesText = "PURCHASE SAVINGS";
  const mySavingsText = "TRADE SAVINGS";

  const modal = useRef<HTMLIonModalElement>(null);

  function sustainability() {
    const previousIndex = Number(localStorage.getItem('sustainabilityIndex') ?? 0);
    if(previousIndex === sustainabilityOptions.length - 1) {
      setSustainabilityOption(sustainabilityOptions[0]);
      localStorage.setItem('sustainabilityIndex', '0');
    } else {
      localStorage.setItem('sustainabilityIndex', (previousIndex + 1).toString());
      setSustainabilityOption(sustainabilityOptions[previousIndex + 1]);
    }
    modal.current?.present();
  }

  const calculateSavings = (product: any) => {
    console.log(product)
    const retailPrice = product.retailPrice || 0;
    const price = product.price || 0;

    const savings = retailPrice - price;
    setSavingsAmount(savingsAmount + savings);
    return savings;
  };

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
      });

    userService
      .getRewards()
      .then(reward => {
        if (reward) {
          setRewardPoints(reward.points)
          setUntilNextReward(reward?.pointsTillNextReward)
          console.log("untilNextReward", untilNextReward)
        }
      })
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
      </IonRow>
      <IonContent className="rewards-content">
        <IonRow>
            <IonCol className="savings-header savings-sub-title" size="12">
              <div className="savings-title-text-container" style={{ textAlign: "left" }}>REWARDS</div>
            </IonCol>
            <IonCol size="12">
                <div className="rewards-container">
                  <IonCard className="rewards-card">
                    <IonCardContent>
                      <IonRow>
                        <IonCol className="savings-header" size="6">
                          <div className="rewards-graph">
                            <DonutGraph data={pointsData} labels={pointsLabels} />
                      <p className='sustain-reward-g-text'>+{rewardPoints}</p>

                          </div>
                        </IonCol>
                        <IonCol className="savings-header" size="6">
                          <div className="rewards-points">
                            <p className="savings-text">{untilNextReward} POINTS FROM YOUR NEXT REWARD!</p>
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
            </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="savings-header savings-sub-title" size="12">
            <div className="savings-title-text-container" style={{ textAlign: "left" }}>SAVINGS</div>
          </IonCol>
          <IonCol className="savings-header" size="12">
            <p className="savings-amount">{formatPrice(tradesSavings + purchasesSavings) || 0}</p>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="savings-header savings-sub-title" size="12">
            <div className="savings-title-text-container" style={{ textAlign: "left" }}>SUSTAINABILITY</div>
          </IonCol>
          <IonCol className="savings-header" size="12"
          style={{marginBottom:20, marginTop:20}}
          >
            <div className="rewards-graph2" onClick={() => sustainability()}>
            <img
              height={130}
              src="assets/images/reward-tree-01.png"
              alt="logo"
            />
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
        {!isToggled && (
          <>
            <IonRow className="purchase-s-main-header-container1">
              <IonCol size="3" className="purchase-s-header-item-box">
                <p className="purchase-s-header-item-text">Item</p>
              </IonCol>
              <IonCol size="1"></IonCol>
              <IonCol size="2.5" className="purchase-s-header-retail-box">
                <p className="purchase-s-header-retail-text">Est. Retail Price</p>
              </IonCol>
              <IonCol size="2.5" className="purchase-s-header-price-box">
                <p className="purchase-s-header-price-text">TheNOBO Price</p>
              </IonCol>
              <IonCol size="2.5" className="purchase-s-header-savings-box">
                <p className="purchase-s-header-savings-text">Total Savings</p>
              </IonCol>
            </IonRow>

            {myOrders[0]?.docs.map((order) => (
              <div key={order._id}>
                {
                  order.products.map((singleProduct) => (
                    <IonRow className='purchase-s-main-container' key={singleProduct._id}>
                      <IonCol className='purchase-img-s-box' size='3'>
                        <div className="purchase-s-img"
                          style={{
                            backgroundImage: singleProduct.images?.length
                              ? getImageUrl(singleProduct.images[0]?.url)
                              : '',
                          }}
                        ></div>
                      </IonCol>
                      <IonCol size='1'></IonCol>
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
        {isToggled && (
          <>
            <IonRow className="trades-s-main-header-container1">
              <IonCol size="3" className="trades-s-header-item-box">
                <p className="trades-s-header-item-text">Item</p>
              </IonCol>
              <IonCol size="1"></IonCol>
              <IonCol size="2.5" className="trades-s-header-retail-box">
                <p className="trades-s-header-retail-text">Est. Retail Price</p>
              </IonCol>
              <IonCol size="2.5" className="trades-s-header-price-box">
                <p className="trades-s-header-price-text">TheNOBO Price</p>
              </IonCol>
              <IonCol size="2.5" className="trades-s-header-savings-box">
                <p className="trades-s-header-savings-text">Total Savings</p>
              </IonCol>
            </IonRow>

            {myTrades[0]?.sent.map((product: any) => (product.status === 'accepted') && (
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


        <IonModal
          className="modal-wrapper"
          ref={modal}
          backdropDismiss={true}
          swipeToClose={true}
        >
          <div className="modal-content">
            <p className="modal-text">
              {sustainabilityOption.text}
            </p>
            <p className="modal-source">
                SOURCE:
                <a href={sustainabilityOption.link} target="_blank">{sustainabilityOption.source}</a>
            </p>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default SavingsAndSustainabilityPage;
