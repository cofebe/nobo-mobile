import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonToolbar,
  IonRow,
  IonCol,
  IonTitle,
  IonButtons,
  IonIcon,
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';

import { useHistory } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const history = useHistory();

  function emailSupport(subject: string) {
    window.location.href = `mailto:support@noboplus.com?subject=${subject}`;
  }

  return (
    <IonPage>
      <IonHeader className="home-header">
        <IonToolbar className="home-header-toolbar">
          <IonButtons slot="start">
            <IonButtons slot="start">
              <IonIcon
                style={{ paddingLeft: '1rem' }}
                onClick={() => {
                  history.goBack();
                }}
                slot="icon-only"
                icon={chevronBackOutline}
              />
            </IonButtons>
          </IonButtons>
          <IonTitle>Privacy Policy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow>
          <IonCol offset="1" size="10">
            <h3>Privacy Policy</h3>
            <h5>Last modified: December 7, 2022</h5>
            <h4>Introduction</h4>
            URP+ Inc. (“URP+” or “we”) respects your privacy and are committed to protecting it
            through our compliance with this policy. This policy describes:
            <p style={{ paddingLeft: '1rem' }}>
              • The types of information we may collect or that you may provide when you download,
              install, register with, access, or use the URP+ website (the “Website”) and mobile
              applications (the “Application”) (collectively referred to as the “Service”).
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Our practices for collecting, using, maintaining, protecting, and disclosing that
              information.{' '}
            </p>
            <br></br>This policy applies only to information we collect in the Service and in email,
            text, and other electronic communications sent through or in connection with the
            Service. This policy DOES NOT apply to information that:
            <p style={{ paddingLeft: '1rem' }}>
              • We collect offline or on any other company apps or websites, including websites you
              may access through our Service.{' '}
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • You provide to or is collected by any third party (see Third-Party Information
              Collection).
            </p>
            <br></br>Please read this policy carefully to understand our policies and practices
            regarding your information and how we will treat it. If you do not agree with our
            policies and practices, do not download, register with, or use our Service. By
            downloading, registering with, or using the Service, you agree to this privacy policy.
            This policy may change from time to time (see https://www.noboplus.com/privacy-policy)
            Your continued use of our Service after we revise this policy means you accept those
            changes, so please check the policy periodically for updates.
            <h4>CHILDREN UNDER THE AGE OF 13</h4>
            The Children’s Online Privacy Protection Act of 1998 and its rules (collectively,
            “COPPA”) require us to inform parents and legal guardians (as used in this section,
            “parents”) about our practices for collecting, using, and disclosing personal
            information from children under the age of 13 (“children”). It also requires us to
            obtain verifiable consent from a child's parent for certain collection, use, and
            disclosure of the child's personal information. This section notifies parents of:
            <p style={{ paddingLeft: '1rem' }}>
              1. The types of information we may collect from children.
            </p>
            <p style={{ paddingLeft: '1rem' }}>2. How we use the information we collect.</p>
            <p style={{ paddingLeft: '1rem' }}>3. Our practices for disclosing that information.</p>
            <p style={{ paddingLeft: '1rem' }}>
              4. Our practices for notifying and obtaining parents' consent when we collect personal
              information from children, including how a parent may revoke consent.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              5. All operators that collect or maintain information from children through this
              Service.
            </p>
            This section only applies to children under the age of 13 and supplements the other
            provisions of this Privacy Policy. Only the other provisions of this Privacy Policy
            apply to teens and adults.
            <h5>1. Information We Collect from Children</h5>
            Children can access many parts of the Service and its content and use many of its
            features without providing us with personal information. However, some content and
            features are available only to registered users or require us to collect certain
            information, including personal information, from them. In addition, we use certain
            technologies, such as cookies, to automatically collect information from our users
            (including children) when they visit or use the Service.<br></br>
            We only collect as much information about a child as is reasonably necessary for the
            child to participate in an activity, and we do not condition his or her participation on
            the disclosure of more personal information than is reasonably necessary.<br></br>
            <b>Information We Collect Directly.</b> A child must provide us with the following
            information to register with this website: the child's first name, birth date, and a
            parent's email address. We also require the child to create a member name and password.
            We may request additional information from your child, but this information is optional.
            We specify whether information is required or optional when we request it.<br></br>
            We enable registered users to communicate with others on or through this Service through
            chat, email and posting to public areas of the Service ("Social Features"). The nature
            of these features allows children to disclose personal information about themselves. We
            do not monitor or review this content before it is posted, and we do not control the
            actions of third parties with whom your child shares his or her information. We
            encourage parents to educate their children about safe internet use and to monitor their
            children's use of social features. Automatic Information Collection and Tracking. We use
            technology to automatically collect information from our users, including children, when
            they access and navigate through the Service and use certain of its features. The
            information we collect through these technologies may include:
            <p style={{ paddingLeft: '1rem' }}>
              • One or more persistent identifiers that can be used to recognize a user over time
              and across different websites and online services.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Information that identifies a device’s location (geolocation information).
            </p>
            We also may combine non-personal information we collect through these technologies with
            personal information about you or your child that we collect online. For information
            about our automatic information collection practices, including how you can opt out of
            certain information collection, see the "Automatic Information Collection and Tracking"
            and "Choices About How We Use and Disclose Your Information" sections of our general
            Privacy Policy.
            <h5>2. How We Use Your Child's Information</h5>
            We use the personal information we collect from your child to:
            <p style={{ paddingLeft: '1rem' }}>• register him or her with the Service;</p>
            <p style={{ paddingLeft: '1rem' }}>
              • communicate with him or her about activities or features of the Service that may be
              of interest;
            </p>
            We use the information we collect automatically through technology (see Automatic
            Information Collection and Tracking) and other nonpersonal information we collect to
            improve our Service and to deliver a better and more personalized experience by enabling
            us to:
            <p style={{ paddingLeft: '1rem' }}>• Estimate our audience size and usage patterns.</p>
            <p style={{ paddingLeft: '1rem' }}>
              • Store information about the child’s preferences, allowing us to customize the
              content according to individual interests.
            </p>
            <p style={{ paddingLeft: '1rem' }}>• Speed up your searches.</p>
            <h5>3. Our Practices for Disclosing Children's Information</h5>
            We do not share, sell, rent, or transfer children’s personal information other than as
            described in this section. We may disclose aggregated information about many of our
            users. In addition, we may disclose children's personal information:
            <p style={{ paddingLeft: '1rem' }}>
              • To third parties we use to support the internal operations of our Service and who
              are bound by contractual or other obligations to use the information only for such
              pnoboose and to keep the information confidential.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • If we are required to do so by law or legal process, such as to comply with any
              court order or subpoena or to respond to any government or regulatory request.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • If we believe disclosure is necessary or appropriate to protect the rights,
              property, or safety of URP+, our customers or others, including to:
              <p style={{ paddingLeft: '1rem' }}>- protect the safety of a child;</p>
              <p style={{ paddingLeft: '1rem' }}>
                - protect the safety and security of the Service; or
              </p>
              <p style={{ paddingLeft: '1rem' }}>
                - enable us to take precautions against liability.
              </p>
              <p style={{ paddingLeft: '1rem' }}>
                - To law enforcement agencies or for an investigation related to public safety.
              </p>
            </p>
            <b>Social Features.</b> The Service offers social features, including in-app messaging,
            chat, and posting on message boards, that enable children communicate with others on or
            through the Service. We do not control the types of information your child can send or
            post through them. We encourage parents to educate their children about safety online
            and to carefully monitor their children's use of social features to ensure they do not
            disclose their personal information through them.
            <h5>4. Accessing and Correcting Your Child's Personal Information</h5>
            At any time, you may review the child’s personal information maintained by us, require
            us to correct or delete the personal information, and/or refuse to permit us from
            further collecting or using the child's information. You can review, change, or delete
            your child's personal information by:
            <p style={{ paddingLeft: '1rem' }}>
              - Logging into your child’s account and visiting his or her account profile page.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              - Sending us an email at support@noboplus.com. To protect your privacy and security,
              we may require you to take certain steps or provide additional information to verify
              your identity before we provide any information or make corrections.
            </p>
            <h5>5. Operators That Collect or Maintain Information from Children</h5>
            No other third-party operators may collect or maintain personal information from
            children through the Service.{' '}
            {/*Commented [JC2]: Is this correct? To be COPPA compliant you
            need to list the names of all operators that collect or maintain
            personal information from children through your Service. If there
            are none (other than URP) this is the language we should use.
*/}
            <h4>Information We Collect and How We Collect It</h4>
            We collect information from and about users of our Service:
            <p style={{ paddingLeft: '1rem' }}>• Directly from you when you provide it to us.</p>
            <p style={{ paddingLeft: '1rem' }}>• Automatically when you use the Service.</p>
            Information You Provide to Us When you download, register with, or use this Service, we
            may ask you provide information:
            <p style={{ paddingLeft: '1rem' }}>
              • By which you may be personally identified, such as full name, postal address, email
              address, date of birth, or telephone number (“personal information”).
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • That is about you but individually does not identify you, such as place of birth,
              geographical indicators, employment information (for coaches), education information
              (provided by users).
            </p>
            This information includes:
            <p style={{ paddingLeft: '1rem' }}>
              • Information that you provide by filling in forms in the Service. This includes
              information provided at the time of registering to use the Service, subscribing to our
              service, posting material, and requesting further services. We may also ask you for
              information when you report a problem with the Service.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Records and copies of your correspondence (including email addresses and phone
              numbers), if you contact us.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Your responses to surveys that we might ask you to complete for research pnobooses.
            </p>
            <p style={{ paddingLeft: '1rem' }}>• Your search queries on the Service.</p>
            You may also provide information for publication or display ("Posted") on public areas
            of the app or websites you access through the Service (collectively, "User
            Contributions"). Your User Contributions are Posted and transmitted to others at your
            own risk. Additionally, we cannot control the actions of third parties with whom you may
            choose to share your User Contributions. Therefore, we cannot and do not guarantee that
            your User Contributions will not be viewed by unauthorized persons.
            <h4>Automatic Information Collection and Tracking</h4>
            When you download, access, and use the Service, it may use technology to automatically
            collect:
            <p style={{ paddingLeft: '1rem' }}>
              • Usage Details. When you access and use the Service, we may automatically collect
              certain details of your access to and use of the Service, including traffic data,
              location data, logs, and other communication data and the resources that you access
              and use on or through the Service.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Device Information. We may collect information about your mobile device and internet
              connection, including the device’s unique device identifier, IP address, operating
              system, browser type, mobile network information, and the device’s telephone number.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Stored Information and Files. The Service also may access metadata and other
              information associated with other files stored on your device. This may include, for
              example, photographs, audio and video clips, personal contacts, and address book
              information.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Location Information. This Service does not collect real-time information about the
              location of your device.
            </p>
            If you do not want us to collect this information do not download the Application or
            access the Website or delete it from your device. You may opt out at any time by
            contacting us at support@noboplus.com. For more information, see{' '}
            <a id="how-we-use">"Choices About How We Use and Disclose Your Information."</a> Note,
            however, that opting out of the Service’s collection of location information will
            disable its location-based features.
            <h4>Information Collection and Tracking Technologies</h4>
            The technologies we use for automatic information collection may include:
            <p style={{ paddingLeft: '1rem' }}>
              • Cookies (or mobile cookies). A cookie is a small file placed on your computer or
              smartphone. It may be possible to refuse to accept cookies by activating the
              appropriate setting on your computer or smartphone. However, if you select this
              setting, you may be unable to access certain parts of our Service.
            </p>
            <h4>Third-Party Information Collection</h4>
            When you use the Service or its content, certain third parties may use automatic
            information collection technologies to collect information about you or your device.
            These third parties [may] include:
            <p style={{ paddingLeft: '1rem' }}>• Advertisers, ad networks, and ad servers.</p>
            <p style={{ paddingLeft: '1rem' }}>• Analytics companies.</p>
            <p style={{ paddingLeft: '1rem' }}>• Your mobile device manufacturer.</p>
            <p style={{ paddingLeft: '1rem' }}>• Your mobile service provider.</p>
            We do not control these third parties’ tracking technologies or how they may be used. If
            you have any questions about an advertisement or other targeted content, you should
            contact the responsible provider directly.
            <h4>How We Use Your Information</h4>
            We use information that we collect about you or that you provide to us, including any
            personal information, to:
            <p style={{ paddingLeft: '1rem' }}>
              • Provide you with the Service and its contents, and any other information, products
              or services that you request from us.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Fulfill any other pnoboose for which you provide it.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Carry out our obligations and enforce our rights arising from any contracts entered
              into between you and us, including for billing and collection.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Notify you when Service updates are available, and of changes to any products or
              services we offer or provide though it.
            </p>
            The usage information we collect helps us to improve our Service and to deliver a better
            and more personalized experience by enabling us to:
            <p style={{ paddingLeft: '1rem' }}>• Estimate our audience size and usage patterns.</p>
            <p style={{ paddingLeft: '1rem' }}>
              • Store information about your preferences, allowing us to customize our Service
              according to your individual interests.
            </p>
            <p style={{ paddingLeft: '1rem' }}>• Speed up your searches.</p>
            <p style={{ paddingLeft: '1rem' }}>• Recognize you when you use the Service.</p>
            <h4>Disclosure of Your Information</h4>
            We may disclose aggregated information about our users, and information that does not
            identify any individual or device, without restriction. In addition, we may disclose
            personal information that we collect or you provide:
            <p style={{ paddingLeft: '1rem' }}>• To our subsidiaries and affiliates.</p>
            <p style={{ paddingLeft: '1rem' }}>
              • To contractors, service providers, and other third parties we use to
            </p>
            support our business and who are bound by contractual obligations to keep personal
            information confidential and use it only for the pnobooses for which we disclose it to
            them.
            <p style={{ paddingLeft: '1rem' }}>
              • To fulfill the pnoboose for which you provide it.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • For any other pnoboose disclosed by us when you provide the
            </p>
            information.
            <p style={{ paddingLeft: '1rem' }}>• With your consent.</p>
            <p style={{ paddingLeft: '1rem' }}>
              • To comply with any court order, law, or legal process, including to respond to any
              government or regulatory request.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • To enforce our rights arising from any contracts entered into between you and us,
              including the Terms of Service, and for billing and collection, if applicable.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • If we believe disclosure is necessary or appropriate to protect the rights,
              property, or safety of URP+, our customers or others.
            </p>
            <h4>Your Choices About Our Collection, Use, and Disclosure of Your Information</h4>
            We strive to provide you with choices regarding the personal information you provide to
            us. This section describes mechanisms we provide for you to control certain uses and
            disclosures of over your information.
            <p style={{ paddingLeft: '1rem' }}>
              • Tracking Technologies. You can set your browser to refuse all or some browser
              cookies, or to alert you when cookies are being sent. If you disable or refuse cookies
              or block the use of other tracking technologies, some parts of the Service may then be
              inaccessible or not function properly.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Location Information. You can choose whether or not to allow the Service to collect
              and use real-time information about your device’s location through the device’s
              privacy settings. If you block the use of location information, some parts of the
              Service may become inaccessible or not function properly.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Promotion by the Company. If you do not want us to use your email address or contact
              information to promote our own or third parties’ products or services, you can opt-out
              by emailing us at support@noboplus.com. You can also always opt-out by logging into
              the Service and adjusting your user preferences in your account profile by checking or
              unchecking the relevant boxes or by sending us an email stating your request to
              support@noboplus.com.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Targeted Advertising by the Company. If you do not want us to use information that
              we collect or that you provide to us to deliver advertisements according to our
              advertisers’ target-audience preferences, you can opt-out by emailing us at
              support@noboplus.com. You can also always adjust your user advertising preferences in
              your account profile or by sending us an email stating your request to
              support@noboplus.com.
            </p>
            <p style={{ paddingLeft: '1rem' }}>
              • Disclosure of Your Information for Third- Party Advertising and Marketing. If you do
              not want us to share your personal information with unaffiliated or non-agent third
              parties for advertising and marketing pnobooses, you can opt-out by emailing us at
              support@noboplus.com. You can also always opt-out by logging into the Service and
              adjusting your user preferences in your account profile by checking or unchecking the
              relevant boxes or by sending us an email stating your request to support@noboplus.com.
            </p>
            We do not control third parties' collection or use of your information to serve
            interest-based advertising. However, these third parties may provide you with ways to
            choose not to have your information collected or used in this way. You can opt out of
            receiving targeted ads from members of the Network Advertising Initiative ("NAI") on the
            NAI's website. Residents in certain states, such as California, may have additional
            personal information rights and choices. Please see Your State Privacy Rights for more
            information. {/*Commented [JC4]: Link to this section below */}
            <h4>Accessing and Correcting Your Personal Information</h4>
            You can review and change your personal information by logging into the Service and
            visiting your account profile page. You may also send us an email at
            support@noboplus.com to request access to, correct, or delete any personal information
            that you have provided to us. We cannot delete your personal information except by also
            deleting your user account. We may not accommodate a request to change information if we
            believe the change would violate any law or legal requirement or cause the information
            to be incorrect [If you delete your User Contributions from the App, copies of your User
            Contributions may remain viewable in cached and archived pages, or might have been
            copied or stored by other Service users. Proper access and use of information provided
            on the Service, including User Contributions, is governed by our Terms of Use. Residents
            in certain states, such as California, may have additional personal information rights
            and choices. Please see Your State Privacy Rights below for more information.
            <h4>Your State Privacy Rights</h4>
            State consumer privacy laws may provide their residents with additional rights regarding
            our use of their personal information. To learn more about California residents’ privacy
            rights, visit https://oag.ca.gov/privacy/ccpa and https://thecpra.org/. [California’s
            "Shine the Light" law (Civil Code Section § 1798.83) permits users of our Service that
            are California residents to request certain information regarding our disclosure of
            personal information to third parties for their direct marketing pnobooses. To make such
            a request, please send an email to support@noboplus.com.
            <h4>Data Security</h4>
            We have implemented measures designed to secure your personal information from
            accidental loss and from unauthorized access, use, alteration, and disclosure. All
            information you provide to us is stored on our secure servers behind firewalls. Any
            payment transactions will be encrypted using SSL technology.{' '}
            <a href="/terms-and-conditions">Terms of Use</a> <br></br>
            The safety and security of your information also depends on you. Where we have given you
            (or where you have chosen) a password for access to certain parts of our Service, you
            are responsible for keeping this password confidential. We ask you not to share your
            password with anyone. We urge you to be careful about giving out information in public
            areas of the Service like message boards. The information you share in public areas may
            be viewed by any user of the Service.<br></br>
            Unfortunately, the transmission of information via the internet and mobile platforms is
            not completely secure. Although we do our best to protect your personal information, we
            cannot guarantee the security of your personal information transmitted through our
            Service. Any transmission of personal information is at your own risk. We are not
            responsible for circumvention of any privacy settings or security measures we provide.
            <h4>Changes to Our Privacy Policy</h4>
            We may update our privacy policy from time to time. If we make material changes to how
            we treat our users’ personal information, we will post the new privacy policy on this
            page. The date the privacy policy was last revised is identified at the top of the page.
            You are responsible for ensuring we have an up-to-date active and deliverable email
            address and/or phone number for you and for periodically visiting this privacy policy to
            check for any changes.
            <h3>Contact Information</h3>
            <p>
              To ask questions or comment about this privacy policy and our privacy practices,
              contact us at:
            </p>
            <p>27472 Portola Pkwy</p>
            <p>Suite 205-108</p>
            <p>Foothill Ranch, CA 92610</p>
            <p>support@noboplus.com</p>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default PrivacyPolicy;
