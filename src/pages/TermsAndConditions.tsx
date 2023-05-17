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

const TermsAndConditions: React.FC = () => {
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
          <IonTitle>Terms</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow>
          <IonCol offset="1" size="10">
            <h3>Terms of Use</h3>
            <h5>Welcome to URP+!</h5>
            These Terms of Use (“Terms”) govern your access and use of URP+’s Software (“Software”),
            the URP+ website located at https://noboplus.com (the “Website”), including any content,
            functionality, and services offered on or through the Software and/or Website (both
            collectively referred to as the “Service”) on the Internet or in cellular media whether
            as a guest or registered user. These Terms constitute a fully binding agreement between
            URP+ Inc. (“URP+”) the proprietor of all rights in and to the Service, and you. It is
            therefore recommended that you carefully read these Terms. When you create a URP+
            account or use, visit, or access the URP+ Service you agree to these terms. These Terms
            include the URP+ Privacy Policy [https://www.noboplus.com/privacy-policy the terms and
            conditions of which are incorporated herein by this reference. If you do not agree to
            these Terms or any of its parts, please immediately discontinue your use of the Service.
            <h5>PRIVACY</h5>
            Your privacy is important to us. While using the Service, personal information may be
            provided by You or collected by URP+ as detailed in our Privacy Policy. The Privacy
            Policy explains our practices pertaining to the use of your personal information and we
            ask that you read such Privacy Deleted: link] Policy carefully. By accepting these
            Terms, you hereby acknowledge and agree to the collection, storage and use of your
            personal information by URP+, subject to this section, the Privacy Policy and any
            applicable laws and regulation. Our updated privacy policy pertaining to the Software
            and the Service is readily accessible at our Privacy Policy and is an integral part of
            these Terms. Since the privacy policy is subject to periodic updates, it is recommended
            that you periodically review the policy for updates.
            <h5>WHAT IS THE SERVICE</h5>
            The URP+ Service includes all of the products, features, applications, services,
            technologies, and software that we provide to advance our mission to allow athletes,
            coaches, recruiters, and schools to connect and communicate through a social media
            platform. The Service is provided mainly through the Software and the Website.
            <h5>THE LICENSE</h5>
            URP+ hereby grants you a non-exclusive, time-limited, non-transferable,
            non-sub-licensable, revocable license to use the Service (including the Software) for
            non-commercial pnobooses, subject to these Terms.
            <h5>USING THE SERVICE</h5>
            You may use the Service solely for private and personal pnobooses. You may not use the
            Service commercially. For example, you may not: (i) offer to third parties a service of
            your own that uses the Service; (ii) resell the Service; (iii) offer to rent or lease
            the Service; or (iv) offer the Service to the public via communication or integrate it
            within a service of your own, without the prior written consent of URP+. For clarity,
            the examples listed are made for illustrative pnobooses only; they do not constitute an
            exhaustive list of restricted activities involving the Service. You may not copy, print,
            save or otherwise use data from the Site or the Service’s database. This clause does not
            limit the use of the database as intended by the Software and for the pnobooses of
            private and personal use of the Service. When using the Service you may not engage in
            scraping, data mining, harvesting, screen scraping, data aggregating, and indexing. You
            agree that you will not use any robot, spider, scraper or other automated means to
            access the Website or the Service’s database for any pnoboose without the express prior
            written permission of URP+. The Software may not be used in any way that is not
            expressly permitted by these Terms.
            <h5>USE PERMISSIONS AND RESTRICTIONS</h5>
            There are certain types of conduct that are strictly prohibited on the Service. Please
            read the following restrictions carefully. Your failure to comply with the provisions
            set forth below may result (at URP+’s sole discretion) in the termination of your access
            to the Service and may also expose you to civil and/or criminal liability. To use our
            Service you must be at least 13 years of age; however, children of all ages may use the
            Service if enabled by a parent or legal guardian. • If you are under 18, you represent
            that you have your parent or guardian’s permission to use the Service. Please have them
            read this Agreement with you. If you are a parent or legal guardian of a user under the
            age of 18, by allowing your child to use the Service, you are subject to the terms of
            this Agreement and responsible for your child’s activity on the Service. • We must not
            have previously disabled your account for violation of law or any of our policies. • You
            must not be a convicted sex offender. • You can't impersonate others or provide
            inaccurate information. You may not impersonate someone or something you aren't, and you
            can't create an account for someone else unless you have their express permission. • You
            can't do anything unlawful, misleading, or fraudulent or for an illegal or unauthorized
            pnoboose. • You can't violate (or help or encourage others to violate) these Terms or
            our policies. • You can't attempt to create accounts or access or collect information in
            unauthorized ways. This includes creating accounts or collecting information in an
            automated way without our express permission. • You can’t sell, license, or purchase any
            account or data obtained from us or our Service. • You can't post someone else’s private
            or confidential information without permission or do anything that violates someone
            else's rights, including intellectual property rights (e.g., copyright infringement,
            trademark infringement, counterfeit, or pirated goods). • You may use someone else's
            works under exceptions or limitations to copyright and related rights under applicable
            law. You represent you own or have obtained all necessary rights to the content you post
            or share. • You can’t interfere with or violate any third party or other user’s right to
            privacy or other rights, including copyrights and any other intellectual property rights
            of others, or harvest or collect personal information about visitors or users of the
            Service and/or Site without their express consent, including using any robot, spider,
            site search or retrieval application, or other manual or automatic device or process to
            retrieve, index, or data-mine; • You can’t copy, modify, adapt, translate, create
            derivative works of, or reverse engineer our products included in the Service or their
            components, or in any way or publicly display, perform, or distribute them. • You agree
            that we can download and install updates to the Service on your device.
            <h5>USER SUBMISSIONS</h5>
            As a URP+ account holder, you may submit video, graphic and textual content (each a
            “User Submission”) in the manner provided by the Service. You retain sole and exclusive
            ownership of each User Submission and shall be solely responsible for the nature of its
            content and the consequences of posting or publishing it. Users Submissions shall be
            deemed public information and not subject to any confidentiality obligation on the part
            of URP+. By making User Submissions, you affirm, represent and warrant that you own or
            have the necessary licenses, rights, consents and permissions (including without
            limitation, the permission of each and every individual person identifiable in any User
            Submission), to use and authorize URP+ to use all copyright, patent, trademark, trade
            secret or other proprietary rights (including the name, voice and/or likeness rights of
            each identifiable person), in and to your User Submissions, to enable inclusion and the
            use thereof in accordance with these Terms of Use. YOU FURTHER AGREE THAT YOU WILL NOT
            SUBMIT CONTENT THAT (I) IS DEFAMATORY, LIBELOUS, MISLEADING, OFFENSIVE, INDECENT OR
            OBJECTIONABLE, OR (II) OTHERWISE INFRINGES UPON ANOTHER’S INTELLECTUAL PROPERTY OR OTHER
            PROPRIETARY RIGHTS, INCLUDING, WITHOUT LIMITATION, ANY RIGHTS UNDER THE LAWS PERTAINING
            TO COPYRIGHT, TRADEMARK, PATENT, TRADE SECRET, PRIVACY AND/OR PUBLICITY. While you
            retain all ownership rights in and to your User Submissions, by using the Service, you
            grant URP+ a non-exclusive, universe-wide, perpetual, royalty-free, sublicensable, and
            transferrable license to use, distribute, reproduce, prepare derivative works of,
            display, and perform all User Submissions in any manner so desired by URP+, including
            without limitation for promoting and redistributing part or all of the Service (and
            derivative works thereof), in any media formats and through any media channels. You also
            hereby grant each user of the Service a non-exclusive license to access your User
            Submissions through the Service, and to use, reproduce, distribute, display and perform
            such User Submissions as permitted through the functionality of the Service and under
            these Terms of Service. URP+ is not responsible or liable to any third party for the
            content or accuracy of any User Submission posted by you or any other user of this
            Website.
            <h5>TERMINATION OF USE OF THE SERVICE</h5>
            You may terminate your use of the Service at any time and for whatever reason. You are
            not obligated to advise URP+ of such termination. URP+ retains the right to block your
            access to the Service and discontinue your use of the Service, at any time and for any
            reason URP+ deems appropriate, at its sole and absolute discretion.
            <h5>INTELLECTUAL PROPERTY</h5>
            All intellectual property rights in and to the Site, the Service and its database,
            including copyrights, trademarks, industrial designs, patents and trade secrets – are
            either the exclusive property of URP+ or its affiliates or are exclusively licensed to
            URP+. You acquire no rights or licenses to the Service and its database (including but
            not limited to all information, software, text, displays, images, video, and audio, and
            the design, selection, and arrangement thereof) other than the limited rights to use it
            in accordance with these Terms of Use, and you agree to abide by all posted copyright
            notices or restrictions relating to the Content. “URP+”, the URP+ logo, and other trade
            and/or service marks are the property of URP+ or its affiliates and you may not use such
            logos or marks for any pnoboose that is not expressly authorized in these Terms without
            the prior written consent of URP+. The design, trade dress, and the ‘look and feel’ of
            the website and the Service are protected works under applicable copyright laws and URP+
            and its affiliates retain all intellectual property rights in them. URP+ may protect the
            Service by technological means intended to prevent unauthorized use of the Service. You
            undertake not to circumvent these means. Without derogating from URP+’s rights under
            these Terms or under any applicable law, you are advised that any attempted or actual
            infringement of this provision will result in the termination of all your rights under
            these Terms. If you circumvent any of the means taken by URP+ to protect the Service
            from unauthorized use, you must immediately cease any and all use of the Service, and
            you undertake to do so.
            <h5>DMCA Notice and Takedown Provisions</h5>
            If you are a copyright owner or an agent thereof and believe that any content on the
            URP+ website or its Service infringes upon your copyright, you may submit a notification
            pursuant to the Digital Millennium Copyright Act (DMCA) by providing URP+’s Designated
            Copyright Agent with the following information in writing (see 17 U.S.C. § 512(c)(3) for
            further information): • A physical or electronic signature of a person authorized to act
            on behalf of the owner of an exclusive right that is allegedly infringed; •
            Identification of the copyrighted work claimed to have been infringed, or, if multiple
            copyrighted works at a single online site are covered by a single notification, a
            representative list of such works at that site; • Identification of the material that is
            claimed to be infringing or to be the subject of infringing activity and that is to be
            removed or access to which is to be disabled and information reasonably sufficient to
            permit the service provider to locate the material; • Information reasonably sufficient
            to permit the service provider to contact you, such as an address, telephone number,
            and, if available, an electronic mail; • A statement that you have a good faith belief
            that use of the material in the manner complained of is not authorized by the copyright
            owner, its agent, or the law; and • A statement that the information in the notification
            is accurate, and under penalty of perjury, that you are authorized to act on behalf of
            the owner of an exclusive right that is allegedly infringed. URP+’s designated Copyright
            Agent to receive notifications of claimed infringement is: Copyright Agent, Lutzker &
            Lutzker LLP 1233 20th St NW Suite 703 Washington, DC 20036 Phone: 202-408-7600 Email:
            dmca@lutzker.com Upon receipt of the Notice as described above, URP+ will take whatever
            action, in its sole discretion, it deems appropriate, including removal of the
            challenged material from the website or Service. For clarity, only DMCA notices should
            go to the Copyright Agent; any other feedback, comments, requests for technical support,
            and other communications should be directed to URP+ customer service through
            support@noboplus.com. You acknowledge that if you fail to comply with all of the
            requirements of this Section 5(A), your DMCA notice may not be valid.
            <h5>LIMITATION OF LIABILITY AND WARRANTY</h5>
            URP+ PROVIDES THE SERVICE AND CONTENT INCLUDED THEREIN FOR USE ON AN “AS IS” AND “AS
            AVAILABLE” BASIS. THEY CANNOT BE CUSTOMIZED TO FULFILL THE NEEDS OF EACH AND EVERY USER.
            WE HEREBY DISCLAIM ALL WARRANTIES AND REPRESENTATIONS, EITHER EXPRESS OR IMPLIED, WITH
            RESPECT TO THE SERVICE, INCLUDING, WITHOUT LIMITATION, ANY WARRANTIES OF
            MERCHANTABILITY, AND FITNESS FOR A PARTICULAR PURPOSE, FEATURES, QUALITY,
            NON-INFRINGEMENT, TITLE, COMPATIBILITY, PERFORMANCE, SECURITY OR ACCURACY. URP+ exerts
            efforts to provide you with a high quality and satisfactory service. However, we do not
            warrant that the Service will operate in an uninterrupted or error-free manner, or that
            it will always be available or free from all harmful components, or that it is safe,
            secured from unauthorized access to URP+ computers, immune from damages, free of
            malfunctions, bugs or failures, including, but not limited to hardware failures,
            Software failures and Software communication failures, originating either in URP+ or any
            of its providers. URP+, INCLUDING ITS OFFICERS, DIRECTORS, SHAREHOLDERS, EMPLOYEES,
            SUB-CONTRACTORS AND AGENTS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL OR
            CONSEQUENTIAL DAMAGE, OR ANY OTHER DAMAGE, AND LOSS (INCLUDING LOSS OF PROFIT AND LOSS
            OF DATA), COSTS, EXPENSES AND PAYMENTS, EITHER IN TORT, CONTRACTUAL, OR IN ANY OTHER
            FORM OF LIABILITY, ARISING FROM, OR IN CONNECTION WITH THE USE OF, OR THE INABILITY TO
            USE THE SERVICE, OR FROM ANY FAILURE, ERROR, OR BREAKDOWN IN THE FUNCTION OF THE
            SERVICE, OR FROM ANY FAULT, OR ERROR MADE BY OUR STAFF OR ANYONE ACTING ON ITS BEHALF,
            OR FROM YOUR RELIANCE ON THE CONTENT OF THE SERVICE, INCLUDING, WITHOUT LIMITATION,
            CONTENT ORIGINATING FROM THIRD PARTIES, OR FROM ANY COMMUNICATION WITH THE SERVICE, OR
            WITH OTHER USERS ON OR THROUGH THE SERVICE, OR FROM ANY DENIAL OR CANCELLATION OF YOUR
            USER ACCOUNT, OR FROM RETENTION, DELETION, DISCLOSURE AND ANY OTHER USE OR LOSS OF YOUR
            CONTENT ON THE SERVICE. IN ANY EVENT, YOUR SOLE REMEDY WILL BE LIMITED TO CORRECTING
            SUCH ERRORS, OR MALFUNCTIONS, AND IN LIGHT OF THE RELEVANT CIRCUMSTANCES.
            <h5>BREACH AND INDEMNITY</h5>
            You agree to indemnify and hold harmless URP+ and its employees, officers, directors and
            agents, as well as all third party advertisers of Ads from and against all claims,
            damages, expenses, losses and liabilities that arise as a result of your violation of
            these Terms. In view of the fact that the Service is provided to you free-of-charge,
            this indemnity is intended to cover all expenses, payments, loss, loss of profits or any
            other damage, direct or indirect, monetary or non-monetary, incurred by URP+, its
            employees, officers, directors or agents as a result of your violation of the Terms,
            including but not limited to legal expenses and attorney fees. This indemnification
            obligation will survive these Terms of Use and your use of the Service.
            <h5>MODIFICATIONS TO THE SERVICE AND SOFTWARE</h5>
            URP+ may, either partially or in its entirety and without being obligated to provide
            prior notice – modify, adapt or change the Software, the Service’s features, the user
            interface and design, the extent and availability of the contents in the Service and any
            other aspect related to the Service. You will have no claim, complaint or demand against
            URP+ for applying such changes or for failures incidental to such changes.
            <h5>TERMINATION OF SERVICE</h5>
            URP+ may, at any time, terminate the provision of the Service in its entirety or any
            part thereof, temporarily or permanently, at its sole discretion.
            <h5>MODIFICATIONS OF THESE TERMS</h5>
            URP+ may modify these Terms from time to time. If fundamental changes are introduced, a
            notice will be posted in the updated version of the Software as well as on the Service’s
            home page on the Site. Your continued use of the Service after the Terms have been
            modified signifies your assent to the updated Terms. If you dissent to the updated Terms
            or to any term within them, you must discontinue all further use of the Software.
            <h5>GOVERNING LAW AND JURISDICTION</h5>
            These Terms, the Software and the Service will be governed solely by the laws of the
            United States of America, without giving effect to any conflicts of law principles. Any
            dispute, claim or controversy arising out of, connected with or relating to these Terms,
            the Software and the Service, will be under the exclusive jurisdiction of the competent
            court in the state of California in the United States of America.
            <h5>LIMITATIONS</h5>
            Should you desire to file any cause of action against URP+, arising out of or related to
            the URP+ Software or Service, you must do so within one (1) year of the day you become
            aware of the cause of action. Failure to file a lawsuit within the aforementioned
            timeframe will bring about the permanent barring of the cause of action, and will
            constitute your complete and final waiving of the lawsuit.
            <h5>ASSIGNMENT OF RIGHTS</h5>
            You may not assign or transfer your rights in and to the Service, without the prior
            written consent of URP+. URP+ may assign its rights in and to the Service to a third
            party at its sole and absolute discretion, provided that the third party undertakes
            URP+’s obligations to you under these Terms.
            <h5>COMPLETE TERMS</h5>
            These Terms, together with the policies that are an integral part of these Terms, namely
            the Privacy Policy, shall all constitute the entire and complete agreement between you
            and URP+ concerning the URP+ Service. In the event of an inconsistency between these
            Terms and the synopsis of terms presented to the user during Software installation,
            these Terms shall prevail.
            <h5>NO LEGAL RELATIONSHIP</h5>
            These Terms of Use and your use of the Service, including the submission of Content onto
            the Service, do not, and shall not be construed as creating any relationship,
            partnership, joint venture, employer-employee, agency, or franchisor-franchisee
            relationship in any way and of any kind between the parties hereto. Your use of the
            Service is intended for your enjoyment and benefit and the provision of the Service to
            you (subject to your compliance with these Terms) constitutes the sole and sufficient
            consideration that you are entitled to receive for any Content or other contributions
            you have made to the URP+ Service.
            <h5>UPDATING THESE TERMS</h5>
            We may change our Service and policies, and we may need to make changes to these Terms
            so that they accurately reflect our Service and policies. Unless otherwise required by
            law, we will notify you (for example, through our Service) before we make changes to
            these Terms and give you an opportunity to review them before they go into effect. Then,
            if you continue to use the Service, you will be bound by the updated Terms. If you do
            not want to agree to these or any updated Terms, you can delete your account, here.
            <p>Revised: 30 November 2022</p>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default TermsAndConditions;
