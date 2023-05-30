import { IonCol, IonContent, IonPage, IonRow } from '@ionic/react'
import React from 'react'
import { useHistory } from 'react-router'
import './MySales.scss'

const MySales: React.FC = () => {
  const history = useHistory()

  return (
    <IonPage className='sales-item-main-container'>
      <IonRow>
        <IonCol className='sales-item-header' size='12'>
          <div
            className='sales-item-back-btn'
            onClick={() => {
              history.goBack()
            }}
          >
            <img
              height={23}
              src='assets/images/arrow-left.svg'
              alt='logo'
            />
          </div>
          <IonCol className='sales-item-title-text-container'>MY SALES</IonCol>
        </IonCol>
      </IonRow>

      <IonContent className='sales-item-content'>
        <IonRow >
          <IonCol className='sales-shipping-label' size='12' >SHIPPING LABELS</IonCol>
        </IonRow>
        <IonRow >
          <IonCol
          onClick={()=>{
            history.push('/sales/single-sales-item/3')
          }}
          className='sales-items-container' size='12' >
            <div className="sales-items-props-left">
              <div className="order-no">
                <p className='order'>ORDER N0.</p>
                <p className='num' style={{ color: 'black' }}>001178910</p>
              </div>
              <div className="seller-name">KATELLAN PELL</div>
              <div className="product">product</div>
              <div className="product-name">
                <p>CHANELL</p>
                <p style={{ fontWeight: 600 }}>TAUPE HANDBAG</p>
              </div>
              <div className="year">8 JAN 2023</div>
            </div>
            <div className="sales-items-props-right">
              <div className="img-container">
                <img src='assets/images/test/channel-bag.svg' alt="channel" />
              </div>
              <p className='price'>$800.00</p>
            </div>
          </IonCol>
        </IonRow>
        <div className='sales-item-line-divider'></div>

        <IonRow >
          <IonCol className='sales-items-container' size='12' >
            <div className="sales-items-props-left">

              <div className="order-no">
                <p className='order'>ORDER N0.</p>
                <p className='num' style={{ color: 'black' }}>001178910</p>
              </div>
              <div className="seller-name">KATELLAN PELL</div>
              <div className="product">product</div>
              <div className="product-name">
                <p>CHANELL</p>
                <p style={{ fontWeight: 600 }}>TAUPE HANDBAG</p>
              </div>
              <div className="year">8 JAN 2023</div>
            </div>
            <div className="sales-items-props-right">
              <div className="img-container">
                <img src='assets/images/test/channel-bag.svg' alt="channel" />
              </div>
              <p className='price'>$800.00</p>
            </div>
          </IonCol>
        </IonRow>
        <div className='sales-item-line-divider'></div>
        <IonRow >
          <IonCol className='sales-items-container' size='12' >
            <div className="sales-items-props-left">

              <div className="order-no">
                <p className='order'>ORDER N0.</p>
                <p className='num' style={{ color: 'black' }}>001178910</p>
              </div>
              <div className="seller-name">KATELLAN PELL</div>
              <div className="product">product</div>
              <div className="product-name">
                <p>CHANELL</p>
                <p style={{ fontWeight: 600 }}>TAUPE HANDBAG</p>
              </div>
              <div className="year">8 JAN 2023</div>
            </div>
            <div className="sales-items-props-right">
              <div className="img-container">
                <img src='assets/images/test/channel-bag.svg' alt="channel" />
              </div>
              <p className='price'>$80000.00</p>
            </div>
          </IonCol>
        </IonRow>
        <div className='sales-item-line-divider'></div>
        <IonRow >
          <IonCol className='sales-items-container' size='12' >
            <div className="sales-items-props-left">

              <div className="order-no">
                <p className='order'>ORDER N0.</p>
                <p className='num' style={{ color: 'black' }}>001178910</p>
              </div>
              <div className="seller-name">KATELLAN PELL</div>
              <div className="product">product</div>
              <div className="product-name">
                <p>CHANELL</p>
                <p style={{ fontWeight: 600 }}>TAUPE HANDBAG</p>
              </div>
              <div className="year">8 JAN 2023</div>
            </div>
            <div className="sales-items-props-right">
              <div className="img-container">
                <img src='assets/images/test/channel-bag.svg' alt="channel" />
              </div>
              <p className='price'>$800.00</p>
            </div>
          </IonCol>
        </IonRow>
        <div className='sales-item-line-divider'></div>
        <IonRow >
          <IonCol className='sales-items-container' size='12' >
            <div className="sales-items-props-left">

              <div className="order-no">
                <p className='order'>ORDER N0.</p>
                <p className='num' style={{ color: 'black' }}>001178910</p>
              </div>
              <div className="seller-name">KATELLAN PELL</div>
              <div className="product">product</div>
              <div className="product-name">
                <p>CHANELL</p>
                <p style={{ fontWeight: 600 }}>TAUPE HANDBAG</p>
              </div>
              <div className="year">8 JAN 2023</div>
            </div>
            <div className="sales-items-props-right">
              <div className="img-container">
                <img src='assets/images/test/channel-bag.svg' alt="channel" />
              </div>
              <p className='price'>$800.00</p>
            </div>
          </IonCol>
        </IonRow>
        <div className='sales-item-line-divider'></div>
      </IonContent>
    </IonPage>
  )
}

export default MySales
