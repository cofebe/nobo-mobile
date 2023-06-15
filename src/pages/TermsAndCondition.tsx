import { IonButton, IonCol, IonContent, IonPage, IonRow, IonTextarea } from '@ionic/react'
import './TermsAndCondition.scss'
import { useHistory } from 'react-router'

const TermsAndCondition = () => {
  const history = useHistory()



  return (
    <IonPage className='terms-condition-main-container'>
      <IonRow >
        <IonCol style={{ height: '118px' }} size='12'>
          <div
            className='terms-condition-back-btn'
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

          <IonCol className='terms-condition-title-text-container'>TERMS & CONDITIONS</IonCol>
        </IonCol>
      </IonRow>
      <IonContent className='terms-condition-ion-content'>
        <IonRow >
          <IonCol className='terms-header-title'>TERMS & CONDITIONS</IonCol>
        </IonRow>
        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            1. Who May Engage in Transactions
          </IonCol>
          <IonCol size='12' className='terms-info'>
            TheNOBO accepts users (“User” or “Users”) who are at least 18
            years old with a valid form of payment on file to engage in
            buying, selling, and trading of products (“Product” or “Products”)
            on the site. TheNOBO currently only accepts transactions from Users
            that reside in the United States of America. By using TheNOBO website,
            you agree to agree to the following Terms and Conditions.
          </IonCol>
        </IonRow>

        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            2. Company
          </IonCol>
          <IonCol size='12' className='terms-info'>
            The owner of TheNOBO website is The Nobo Inc., a Corporation,
            with mailing address at 90 New Montgomery Street, Suite 408,
            San Francisco, CA 94105 (referred to herein as “Company” or “TheNOBO”).
          </IonCol>
        </IonRow>

        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            3. Requirements for Photographs
          </IonCol>
          <IonCol size='12' className='terms-info'>
            All users who wish to engage in a sales transaction must upload a photo
            in order to create a listing (“Sales Listing”). Photographs must conform
            to the following:
            Photographs must be in digital format, taken by a digital camera or smartphone.
            All digital files must be 20 megabytes or smaller, must be in JPEG or JPG format,
            and must be at least 1,600 pixels wide (if a horizontal image) or 1,600 pixels
            tall (if a vertical image).
            Only minor burning, dodging and/or color correction is acceptable.
            Cropping is acceptable. Any changes to the original photograph not
            itemized here are unacceptable and will render the photograph ineligible for a prize.
          </IonCol>
        </IonRow>

        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            4. Requirements for Traded Products
          </IonCol>
          <IonCol size='12' className='terms-info'>
            All trade listings (“Trade Listings”) require submission of the Product
            to Company for authentication, photograph, and approval of the Trade Listing
            information. TheNOBO provides an online shipping form that can be printed and
            applied to the Product packaging for shipment to Company.
          </IonCol>
        </IonRow>

        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            5. Required Releases from Users
          </IonCol>
          <IonCol size='12' className='terms-info'>
            If the Product contains any material or elements that are not owned by
            the User and/or which are subject to the rights of third parties,
            the User is responsible for obtaining, prior to submission of the
            Sales Listing or Trade Listing, any and all releases and consents
            necessary to permit the exhibition and use of the Sales Listing
            or Trade Listing in the manner set forth in these Terms and Conditions.
            Upon Company’s request, each User must be prepared to provide (within seven calendar
            days of receipt of Company’s request) a signed written license from the third
            party owner, if any, of any private property included in the Sales Listing
            or Trade Listing, authorizing User to distribute, display, and sell
            the Product via TheNOBO. Failure to provide such releases upon request
            may result in termination of User account.
            For the purposes of these Terms and Conditions, the User will be deemed
            to be in receipt of Company’s request or notification, (a) in the event
            that Company sends the request by postal mail, five business days after
            the request was sent by Company, or (b) in the event that Company sends
            the request by email, on the day that the email was sent by Company.
          </IonCol>
        </IonRow>

        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            6. Determination of User
          </IonCol>
          <IonCol size='12' className='terms-info'>
            The person uploading the Sales Listing or Trade Listing will be deemed the User.
            The User is the one person who is the authorized account holder of the email
            address and payment information used to register at the Company. Should multiple
            persons access the same email account and a dispute arises regarding the identity
            of the User, the authorized account holder of said e-mail account at the time
            of any transaction will be considered the User. “Authorized Account Holder”
            is defined as the natural person who is assigned an e-mail address by an
            Internet access provider, on-line service provider or other organization
            which is responsible for assigning e-mail addresses or the domain associated
            with the submitted e-mail address. If any group elects to collaborate
            on a Listing, they are required to designate one (1) person as the
            agent of the group in order to engage in transactions, and jointly
            agree to these Terms and Conditions.
          </IonCol>
        </IonRow>

        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            7. License
          </IonCol>
          <IonCol size='12' className='terms-info'>
            By submitting Sales Listings or Trade Listings, all Users grant an irrevocable,
            perpetual, worldwide non-exclusive license to the Company to reproduce, distribute,
            and display images of the Sales Listing or Trade Listing in connection with
            the promotion, sale and/or trade of the Product. Users consent to the Company
            doing or omitting to do any act that would otherwise infringe the User’s “moral
            rights” in their Sales Listings or Trade Listings. Display or publication
            of any Sales Listing or Trade Listing on TheNOBO website does not constitute
            a guarantee of sale or trade.

          </IonCol>
        </IonRow>

        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            8. Limitation of Liability
          </IonCol>
          <IonCol size='12' className='terms-info'>
            By entering TheNOBO website and using the Services,
            all Users agree to release, discharge, defend and hold harmless Company
            and its partners, affiliates, subsidiaries, advertising agencies,
            agents and their employees, officers, directors, agents and representatives
            from any claims, losses, and damages arising out of or relating to their
            participation in the Sales Listings or Trade Listings and TheNOBO website.
            Company assumes no responsibility for any error, omission, interruption,
            deletion, defect, or delay in operation or transmission; communications
            line failure; theft or destruction of or unauthorized access to Sales
            Listings, Trade Listings or Product forms; or alteration of Product,
            Sales Listing or Trade Listing images or forms. Company is not responsible
            for any problems with or technical malfunction of any telephone network
            or lines, computer online systems, servers or providers, computer equipment,
            software, failure of any Sales Listing or Trade Listing to be received on
            account of technical problems or traffic congestion on the Internet or
            at any website, human errors of any kind, or any combination of these,
            including any injury or damage to Users’ or any other persons’
            computers related to or resulting from participation, uploading
            or downloading of any materials related to a Sales Listing or Trade Listing.
            The services provided on TheNOBO website (“Services”) and the content,
            information, documents, graphics and images (together, “Materials”)
            published at TheNOBO website may include inaccuracies, typographical
            errors or other errors. Company makes no commitment to correct or update
            what is contained in this website. However, Company reserves the right to modify,
            alter, discontinue or delete the Services and Materials at any time without prior notice.
            TO THE FULL EXTENT PERMITTED BY LAW, THE SERVICES, GOODS AND INFORMATION
            ON THENOBO WEBSITE ARE PROVIDED “AS IS” AND WITHOUT WARRANTY; ALL WARRANTIES
            OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE
            IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
            ARE HEREBY DISCLAIMED; YOU HEREBY WAIVE ALL SUCH WARRANTIES.
            TO THE EXTENT PERMITTED BY LAW, IN NO EVENT WILL COMPANY – OR ITS OFFICERS,
            EMPLOYEES, CONTRACTORS, SUBCONTRACTORS, SUPPLIERS, AGENTS, AFFILIATES,
            SUBSIDIARIES, SUCCESSORS OR ASSIGNS – BE LIABLE TO ANY USER OR TO ANY
            PARTY USING COMPANY’S WEBSITE FOR ANY INDIRECT, CONSEQUENTIAL, INCIDENTAL,
            SPECIAL OR OTHER INDIRECT DAMAGES (INCLUDING WITHOUT LIMITATION, COST OF COVER)
            ARISING OUT OF OR RELATING TO THIS AGREEMENT OR ANY SERVICES, GOODS, CONTENT
            OR OTHER MATERIALS PROVIDED OR MADE AVAILABLE, OR USE OF ANY OTHER LINKS
            OR LINKED WEBSITE. THIS LIMITATION APPLIES EVEN IF COMPANY IS EXPRESSLY
            ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, AND REGARDLESS OF WHETHER SUCH
            DAMAGES AROSE IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY
            OR OTHER LEGAL BASIS. THE TERM “DAMAGES” INCLUDES, WITHOUT LIMITATION,
            ATTORNEY FEES, COSTS, ANY LOST PROFITS, BUSINESS INTERRUPTION AND LOSS
            OF PROGRAMS OR DATA. THE USER ACKNOWLEDGES THAT THESE TERMS AND CONDITIONS
            AND THE ECONOMIC TERMS OF OUR AGREEMENT REFLECT AN ALLOCATION OF RISK
            AND SUCH ALLOCATION OF RISK IS A SIGNIFICANT INDUCEMENT FOR COMPANY TO
            PROVIDE THE SERVICES, WEBSITE AND OTHER CONTENT AND MATERIALS.
          </IonCol>
        </IonRow>

        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            9. Right to Terminate User Privileges and Access
          </IonCol>
          <IonCol size='12' className='terms-info'>
            Company shall have the right to terminate User’s access to the TheNOBO website
            and Services for any of the following actions or omissions by the User.
            Uploading offensive or pornographic images or videos.
            Repeated uploading of Products that do not conform to the Company’s guidelines.
            Failure to maintain a valid form of payment as part of the User profile.
            Repeated submission of false information related to Products,
            Sales Listings or Trade Listings.
            Sending Products as part of a Sale or Trade transaction that
            do not match the description uploaded for said Products.
            Sales Listings or Trade Listings of Products that are proven
            to be stolen or unauthorized for sale or trade.

          </IonCol>
        </IonRow>

        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            10. Data Privacy
          </IonCol>
          <IonCol size='12' className='terms-info'>
            Users agree that personal data, especially name and address, may be processed,
            shared, and otherwise used for the purposes and within the context of the
            transactions contemplated in the Services. The data may also be used by
            the Company in order to verify the participant’s identity, postal address,
            form of payment. Participants have the right to access, review, rectify,
            or cancel any personal data held by Company by writing to The Nobo Inc,
            90 New Montgomery Street, Suite 408, San Francisco, CA 94105. Personal
            data will be used by Company and its affiliates exclusively for the
            purposes stated here and is further governed by the Company’s privacy policy.

          </IonCol>
        </IonRow>

        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            11. Digital Millennium Copyright Act Policy
          </IonCol>
          <IonCol size='12' className='terms-info'>
            The agent to receive notifications of claimed infringement pursuant
            to the Digital Millennium Copyright Act (“DMCA”) is as follows:
            Name: Noelle Bonner, CEO
            Address: The Nobo, 90 New Montgomery Street, Suite 408, San Francisco, CA 94105
            E-mail: customerservice@TheNobo.com
            Upon receiving a notice that substantially complies with the DMCA
            requirements and provides us with actual knowledge of infringement
            or facts or circumstances from which infringing activity is apparent,
            Company will expeditiously remove or disable access to the material
            in accordance with the DMCA. Note that the DMCA provides that any
            person who knowingly misrepresents that material or activity is
            infringing is liable for damages, including costs and attorneys’ fees.
            Company reserves the right to terminate access to Company’s Services by repeat infringers.

          </IonCol>
        </IonRow>

        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            12. Amendments to These Rules
          </IonCol>
          <IonCol size='12' className='terms-info'>
            Company reserves the right to review and revise these rules and its
            privacy policy from time to time without prior notice. If we revise
            the rules or privacy policy, we will prominently display a notice
            on our website saying there have been changes, include a link to them
            and state that continued use of TheNOBO website binds the User to them.
            By using our website subsequent to any revision of these rules or the
            privacy policy, you agree to be bound by such changes.
            If you find the changes to be unacceptable, you must immediately
            terminate your use of TheNOBO website.

          </IonCol>
        </IonRow>

        <IonRow className='terms-container'>
          <IonCol size='12' className='terms-title'>
            13. General Provisions
          </IonCol>
          <IonCol size='12' className='terms-info'>
            Any litigation or arbitration arising out of or in connection with these
            rules or your use of Company’s services must be commenced within
            one (1) year after the cause of action arose, or it will be permanently barred.
            Any provision of these Terms and Conditions which is determined by a court of competent
            jurisdiction to be unenforceable in any jurisdiction shall be removed
            to the minimum extent required in that jurisdiction without in any way
            invalidating the remaining provisions of these Terms and Conditions.
            In that event the court is hereby directed by the parties to replace
            the legally invalid provisions with legally valid provisions which will,
            from an economic viewpoint, most nearly and fairly approach the eliminated
            provisions. The unenforceability of any provision in a given jurisdiction
            shall not make that provision unenforceable in any other jurisdiction.
            Users agree that the Company has the sole right to decide all matters and
            disputes arising from these Terms and Conditions and that all decisions
            of Company shall be final and binding and not subject to challenge or appeal.

          </IonCol>
        </IonRow>



      </IonContent>
    </IonPage>
  )
}

export default TermsAndCondition
