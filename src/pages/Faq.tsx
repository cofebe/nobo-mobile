import React, { useState } from 'react';
import { IonPage, IonContent, IonCol, IonRow, IonModal, IonButton } from '@ionic/react';
import { useHistory } from 'react-router'
import './Faq.scss'

const Faq = () => {
  const history = useHistory()
  const faqItems = [
    {
      question: 'How do you list an item with NOBO?',
      answer: `Click on the “List My Item” button on the top of the home page. You will then be taken to a page where you can fill in information about your product, selecting the brand, style of the item, condition, price, etc. If your product is a trade item, you will need to send it to TheNOBO for authentication and warehousing, and will not need to upload a photo. TheNOBO will take photos of all authenticated and approved trade items.
        <br>For Trade Items Only<br>
        You will be prompted to download a shipping label. Once the shipping label is downloaded, package the item neatly in a box of your choosing, place the shipping label on the box, and drop it off at USPS.
        Note: All trade products are stored at TheNOBO headquarters until trade transactions go through between users.`,
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept major credit cards, such as Visa, Mastercard, and American Express...',
    },
    {
      question: 'What are the Consigner Terms?',
      answer: (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ITEM SALE PRICE</th>
                <th>COSIGNER</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$3,500 and above</td>
                <td>80%</td>
              </tr>
              <tr>
                <td>$2,500 - $3,499</td>
                <td>75%</td>
              </tr>
              <tr>
                <td>$1,000 - $2,499</td>
                <td>70%</td>
              </tr>
              <tr>
                <td>$1 - $999</td>
                <td>65%</td>
              </tr>
            </tbody>
          </table>
          <p style={{marginBottom: '0'}}>Sneaker Consignment Fees</p>
          <table>
            <thead>
              <tr>
                <th>QUARTERLY SALES</th>
                <th>COSIGNER</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$0 - $499</td>
                <td>10.0%%</td>
              </tr>
              <tr>
                <td>$500 - $1,499</td>
                <td>9.5%</td>
              </tr>
              <tr>
                <td>$1,500 - $4,999</td>
                <td>9.0%</td>
              </tr>
              <tr>
                <td>$5,000 - $29,999</td>
                <td>8.5%</td>
              </tr>
              <tr>
                <td>$30,000+</td>
                <td>8.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      question: 'How does authentication work for Sale products?',
      answer: 'For all sale items, TheNOBO uses a combination of technology, data and digital inspection to confirm the authenticity of products. If you have concerns about the authenticity of a purchased product, return it to us. We have a 100% authenticity assurance policy!',
    },
    {
      question: 'How does authentication work for Trade products?',
      answer: 'All trade products are shipped to TheNOBO headquarters for in person inspection and authentication. Once we receive an item for authentication, we immediately begin the process of reviewing its quality and confirming the value. If a product is deemed authentic, we take photos of the product, confirm its price, and create a product listing. As the product goes through this process, you will receive notifications in your account and via email.'
    },
    {
      question: 'What happens if the Condition of the Trade is too poor but is an Authentic product?',
      answer: 'We have strict guidelines around the conditions of the products we accept for trade. If the condition of your product is not as described or too degraded, your listing will be rejected. Your product will be shipped back to you, and you will be charged for all shipping fees.'
    },
    {
      question: 'What happens after my Trade product has ben authenticated?',
      answer: `You will receive an account notification that your product has been approved, and an email with a link to your live listing. You will now be able to trade for another luxury item within a 20% price bandwidth of your product. What does that mean? If you have a product that is priced at $1000.00, you can trade for an item that is at a maximum $1200.00.<br>
        Note: If a user that has a trade product that is of higher value than your trade product and outside the 20% price bandwidth, let’s say, $2000, they can always send a trade offer to you or another user with a trade product that is valued less than their product and outside the 20% price bandwidth.`
    },
    {
      question: 'What is a Trade Offer?',
      answer: `A Trade Offer is when a user with another trade product is ready to exchange their product with yours. Effectively using the value of their product, to trade with you, so that you both only pay a fee + taxes to TheNOBO if the transaction goes through.`
    },
    {
      question: 'What happens if TheNOBO identifies my product as fake or counterfeit?',
      answer: `You will be notified immediately that we have identified your product as fake. It is illegal for TheNOBO to engage in the shipping of counterfeit items. Any products that are identified as counterfeit, will be destroyed, the user will be charged all shipping fees, a $35 fee for our authentication services and may face repercussions on their account for trying to list a counterfeit product.`
    },
    {
      question: 'What are are TheNOBO fees associated with Trades?',
      answer: (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>TRADE TRANSACTION VALUE</th>
                <th>TRADE TRANSACTION FEE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$1 - $19,999</td>
                <td>12%</td>
              </tr>
              <tr>
                <td>$20,000 - $49,999</td>
                <td>8%</td>
              </tr>
              <tr>
                <td>$50,000 +</td>
                <td>4%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      question: 'How much does each user pay on a Trade Transaction?',
      answer: `If User A has a product valued at $100 and they send a trade offer to User B who has a product valued at $98, the total value of the transaction is:
        $102 + $98 = $200<br>
        Then we take a 12% fee from the total trade transaction value.<br>
        $200 x 12% = $12<br>
        Each user pays $12 to acquire a new for them product valued at $200!`
    },
    {
      question: 'How are Trade products priced?',
      answer: `Once we receive a trade product in our warehouse, we review the price a user submits as part of their List My Item submission. We then verify it based on our inhouse data, market demand, age, condition, brand, inventory, and item style. We reserve the discretion to change the price, either by increasing or decreasing it, based on the aforementioned variables.`
    },
    {
      question: 'Wha is the trading bandwidth?',
      answer: `The price or value range that you can trade your product with another user! You can only trade up to 20% above your listed product’s price / value. But of course, you can trade with any product valued below your product.`
    },
    {
      question: 'How can I track my sales?',
      answer: `The sales of all your products can be tracked within My Account.`
    },
    {
      question: 'When will I be paid on my consignment?',
      answer: `To be paid for any of your products that have sold, they must be past the 10 day hold that is placed on sale items, to ensure that a buyer is happy with their purchase. During this time, you will see the amount the product(s) sold for in the “Pending Funds” section of Withdrawal Request. After the 10 days, the funds will become “Available Funds” and you will be able to process a Withdrawal Request to your preferred Payout Method. TheNOBO will make sure you are paid within 7 days of your withdrawal request going through.`
    },
    {
      question: 'Can TheNOBO apply a discount to my sale listings?',
      answer: `Yes, TheNOBO can discount listings up to 30% as part of our promotional efforts.`
    },
    {
      question: 'What are the Women, Men, or Sneaker Experience Preferences in My Account?',
      answer: `The experience preferences allow you to select the kinds of products you want to see when you first come to our marketplace. For instance, if you select "Sneakers" in Account Settings, you will automatically default to the Sneaker explore page every time you log in, and be able to shop and trade sneaker products. That way if you are not interested in any of the other products on our user's list i.e., men's boots or women's handbags, you will never see them when you come to our marketplace!`
    },
    {
      question: 'How does the Sale Schedule in My Account Work?',
      answer: `The Sale Schedule gives YOU more control over when your products go on sale! Opt into as many sale options as you would like, and we will automatically select your products for sale if for some reason they do not sell within the first two weeks of you listing them on our website.`
    },
    {
      question: 'What is Savings & Sustainability?',
      answer: `This is where you can track your savings, access your rewards and learn more about the impacts of fast fashion on the world's environment. It's our goal to reward you for trading, selling, and buying pre-owned luxury bags, shoes, and jewelry on our marketplace, because your efforts DO go a long way to make the environment cleaner and safer.`
    },
    {
      question: 'How do Rewards Work?',
      answer: (
        <div className="answer-wrapper" style={{marginTop: '1rem'}}>
          <p style={{marginBottom: '0'}}>
            <strong>3 Points</strong> - Each Completed Trade Transaction<br />
            <strong>2 Points</strong> - For Selling an Item<br />
            <strong>1 Point</strong> - For Buying an Item<br />
          </p>
          <p style={{marginTop: '0'}}>
            Every time you trade an item, sell an item, or buy an item on our marketplace, you will get points that lead to rewards like free shipping or coupon codes for discounts off your next trade transaction or sale purchase. For some rewards, you can even choose a sustainable fashion non-profit for us to make a donation to in your name!
          </p>
        </div>
      )
    },
    {
      question: 'What is the Style Feed?',
      answer: `The Style Feed is your personal place to show off your recent listings, luxury trades, or luxury purchases from our marketplace! Connect with other NOBO insiders, post pictures of your style, or just let your followers know how you're feeling about the day!
        Make sure to check out other NOBO Insider's style feeds, comment, and like their photos too!`
    },
    {
      question: 'What is a Trade Closet?',
      answer: `Your Trade Closet is where all your Trade product listings are shown.`
    },
    {
      question: 'What is a Sell Closet?',
      answer: `Your Sell Closet is where all your Sale product listings are shown.`
    },
    {
      question: 'Additional Questions?',
      answer: (
        <div style={{marginTop: '1rem'}}>
          <p>
            If you have any additional questions or run into any issues while using the marketplace, please email us any time at{' '}
            <span className="email-address">customerservice@TheNOBO.com</span>.
          </p>
        </div>
      )
    }
  ];

  const [activeIndex, setActiveIndex] = useState(-1);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const closeModal = () => {
    setActiveIndex(-1);
  };

  return (
    <IonPage className='faq-main-container'>
      <IonRow >
        <IonCol style={{ height: '118px' }} size='12'>
          <div
            className='faq-back-btn'
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

          <IonCol className='faq-title-text-container'>FAQs</IonCol>
        </IonCol>
      </IonRow>
      <IonContent className='faq-ion-content'>
        <IonRow>
          {faqItems.map((item, index) => (
            <React.Fragment key={index}>
              <IonCol size="11" className="faq-question" onClick={() => toggleAccordion(index)}>
                {item.question}
              </IonCol>
              <IonCol size="1" onClick={() => toggleAccordion(index)}>
                <svg className={`faq-arrow ${activeIndex === index ? 'rotate' : ''}`} width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_3298_13825)" filter="url(#filter0_d_3298_13825)">
                  <path d="M21.375 6L12.625 6C11.1777 6 10 7.17775 10 8.625L10 17.375C10 18.8222 11.1777 20 12.625 20H21.375C22.8222 20 24 18.8222 24 17.375V8.625C24 7.17775 22.8222 6 21.375 6ZM23.4167 17.375C23.4167 18.5008 22.5008 19.4167 21.375 19.4167H12.625C11.4992 19.4167 10.5833 18.5008 10.5833 17.375L10.5833 8.625C10.5833 7.49917 11.4992 6.58333 12.625 6.58333L21.375 6.58333C22.5008 6.58333 23.4167 7.49917 23.4167 8.625V17.375Z" fill="black"/>
                  <g clip-path="url(#clip1_3298_13825)">
                  <path d="M21.0833 20H12.9167C12.1434 19.9991 11.4021 19.6915 10.8553 19.1447C10.3085 18.5979 10.0009 17.8566 10 17.0833L10 8.91667C10.0009 8.1434 10.3085 7.40208 10.8553 6.85529C11.4021 6.30851 12.1434 6.00093 12.9167 6L21.0833 6C21.8566 6.00093 22.5979 6.30851 23.1447 6.85529C23.6915 7.40208 23.9991 8.1434 24 8.91667V17.0833C23.9991 17.8566 23.6915 18.5979 23.1447 19.1447C22.5979 19.6915 21.8566 19.9991 21.0833 20ZM12.9167 7.16667C12.4525 7.16667 12.0074 7.35104 11.6792 7.67923C11.351 8.00742 11.1667 8.45254 11.1667 8.91667L11.1667 17.0833C11.1667 17.5475 11.351 17.9926 11.6792 18.3208C12.0074 18.649 12.4525 18.8333 12.9167 18.8333H21.0833C21.5475 18.8333 21.9926 18.649 22.3208 18.3208C22.649 17.9926 22.8333 17.5475 22.8333 17.0833V8.91667C22.8333 8.45254 22.649 8.00742 22.3208 7.67923C21.9926 7.35104 21.5475 7.16667 21.0833 7.16667L12.9167 7.16667ZM17 15.3333C16.573 15.3338 16.1606 15.1777 15.8409 14.8947C15.6502 14.7249 15.4693 14.5598 15.3509 14.4414L13.675 12.7941C13.5719 12.6843 13.5152 12.5389 13.5168 12.3883C13.5185 12.2376 13.5784 12.0935 13.6839 11.986C13.7894 11.8785 13.9324 11.816 14.083 11.8116C14.2336 11.8072 14.38 11.8611 14.4917 11.9622L16.1717 13.6125C16.2813 13.7216 16.4447 13.8697 16.6144 14.0208C16.721 14.1148 16.8582 14.1667 17.0003 14.1667C17.1424 14.1667 17.2796 14.1148 17.3862 14.0208C17.5553 13.8703 17.7187 13.7222 17.8248 13.6166L19.5083 11.9622C19.5621 11.905 19.627 11.8592 19.6989 11.8276C19.7709 11.796 19.8485 11.7792 19.9271 11.7784C20.0056 11.7775 20.0836 11.7925 20.1562 11.8225C20.2289 11.8525 20.2947 11.8969 20.3497 11.953C20.4048 12.0091 20.4479 12.0757 20.4766 12.1489C20.5053 12.222 20.5189 12.3003 20.5166 12.3788C20.5142 12.4574 20.4961 12.5346 20.4632 12.606C20.4303 12.6774 20.3833 12.7413 20.325 12.7941L18.6456 14.4443C18.5289 14.561 18.3498 14.7243 18.1597 14.8929C17.8401 15.1769 17.4275 15.3336 17 15.3333Z" fill="black"/>
                  </g>
                  </g>
                  <defs>
                  <filter id="filter0_d_3298_13825" x="0" y="0" width="34" height="34" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="4"/>
                  <feGaussianBlur stdDeviation="5"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3298_13825"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3298_13825" result="shape"/>
                  </filter>
                  <clipPath id="clip0_3298_13825">
                  <rect width="14" height="14" fill="white" transform="translate(10 6)"/>
                  </clipPath>
                  <clipPath id="clip1_3298_13825">
                  <rect width="14" height="14" fill="white" transform="translate(10 6)"/>
                  </clipPath>
                  </defs>
                </svg>
              </IonCol>
            {activeIndex === index && (
              <div className="answer-wrapper">
                {typeof item.answer === 'string' ? (
                  <p dangerouslySetInnerHTML={{ __html: item.answer }} />
                ) : (
                  item.answer
                )}
              </div>
            )}
            </React.Fragment>
          ))}
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Faq;
