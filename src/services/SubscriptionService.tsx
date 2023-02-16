import {
  InAppPurchase2,
  IAPProduct,
  IAPProducts,
} from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { isPlatform } from '@ionic/react';
import { AuthService } from './AuthService';
import { environment } from '../environments/environment';

export class SubscriptionService {
  private products: IAPProducts | undefined;
  private subscriptions: IAPProduct[] | undefined;
  authService: AuthService;

  constructor(private store: InAppPurchase2) {
    // this.subscriptions: IAPProducts;
    this.authService = new AuthService();

    this.store.verbosity = this.store.DEBUG;

    if (isPlatform('ios') && this.store && !environment.disableBrowser) {
      this.store.validator =
        'https://validator.fovea.cc/v1/validate?appName=com.noboplus&apiKey=b01dea13-1b81-4165-a6ea-ad0eac7b59d6';
      // this.store.register([
      //   {
      //     id: 'com.nobo.athlete.1month',
      //     type: this.store.PAID_SUBSCRIPTION,
      //   },
      //   {
      //     id: 'com.nobo.promotedpost.1day',
      //     type: this.store.CONSUMABLE,
      //   },
      //   {
      //     id: 'com.nobo.promotedpost.2day',
      //     type: this.store.CONSUMABLE,
      //   },
      //   {
      //     id: 'com.nobo.promotedpost.3day',
      //     type: this.store.CONSUMABLE,
      //   },
      //   {
      //     id: 'com.nobo.promotedpost.4day',
      //     type: this.store.CONSUMABLE,
      //   },
      //   {
      //     id: 'com.nobo.promotedpost.5day',
      //     type: this.store.CONSUMABLE,
      //   },
      //   {
      //     id: 'com.nobo.promotedpost.6day',
      //     type: this.store.CONSUMABLE,
      //   },
      //   {
      //     id: 'com.nobo.promotedpost.1week',
      //     type: this.store.CONSUMABLE,
      //   },
      // ]);

      // this.store.when('com.nobo.athlete.1month').approved((product: any) => {
      //   console.log('Approved');
      //   product.verify();
      // });

      // this.store.when('com.nobo.athlete.1month').verified((product: any) => {
      //   console.log('Verified');
      //   product.finish();
      // });

      // this.store
      //   .when('subscription')
      //   .approved((p: any) => {
      //     p.verify();
      //   })
      //   .verified((p: any) => {
      //     p.finish();
      //   });

      this.store.ready(() => {
        console.log('Store Ready');
        this.products = this.store.products;
      });

      // this.store.when('com.nobo.athlete.1month').updated((product: any) => {
      //   console.log('Updated');
      //   product.finish();
      // });

      // this.store.when('product').approved((product: any) => {
      //   console.log('Approved');
      //   product.verify();
      // });

      // this.store.when('product').verified((product: any) => {
      //   console.log('Verified');
      //   product.finish();
      // });

      this.store.when('com.nobo.athlete.1month').error((err: any) => {
        console.log('Error');
        console.log(err);
      });
      this.store.when('com.nobo.coachrecruiter.1month').error((err: any) => {
        console.log('Error');
        console.log(err);
      });
      this.store.when('com.nobo.trainer.1month').error((err: any) => {
        console.log('Error');
        console.log(err);
      });

      //   this.store
      //     .when('com.nobo.coachrecruiter.1month')
      //     .approved((product: any) => {
      //       console.log('Approved');
      //       product.verify();
      //     });

      //   this.store
      //     .when('com.nobo.coachrecruiter.1month')
      //     .verified((product: any) => {
      //       console.log('Verified');
      //       product.finish();
      //     });

      //   this.store
      //     .when('com.nobo.coachrecruiter.1month')
      //     .updated((product: any) => {
      //       console.log('Updated');
      //       product.finish();
      //     });

      //   this.store.when('com.nobo.coachrecruiter.1month').error((err: any) => {
      //     console.log('Error');
      //     console.log(err);
      //   });

      //   this.store.when('com.nobo.trainer.1month').approved((product: any) => {
      //     console.log('Approved');
      //     product.verify();
      //   });

      //   this.store.when('com.nobo.trainer.1month').verified((product: any) => {
      //     console.log('Verified');
      //     product.finish();
      //   });

      //   this.store.when('com.nobo.trainer.1month').updated((product: any) => {
      //     console.log('Updated');
      //     product.finish();
      //   });

      //   this.store.when('com.nobo.trainer.1month').error((err: any) => {
      //     console.log('Error');
      //     console.log(err);
      //   });

      // this.store.error((err: any) => {
      //   console.log('Error: ', JSON.stringify(err));
      // });

      //   this.store.when('subscription').updated(() => {
      //     console.log('subscription updated');
      //     console.log(this.store.products);
      //     this.subscriptions = this.store.products.filter(
      //       (sub) => sub.canPurchase
      //     );
      //   });

      const myUserId = this.authService.getUserID();
      console.log('User ID: ', myUserId);

      this.store.applicationUsername = myUserId;
      // this.store.refresh();
    }
  }

  register() {
    this.store.register([
      {
        id: 'com.nobo.athlete.1month',
        type: this.store.PAID_SUBSCRIPTION,
      },
      {
        id: 'com.nobo.coachrecruiter.1month',
        type: this.store.PAID_SUBSCRIPTION,
      },
      {
        id: 'com.nobo.trainer.1month',
        type: this.store.PAID_SUBSCRIPTION,
      },
      {
        id: 'com.nobo.promotedpost.1day',
        type: this.store.CONSUMABLE,
      },
      {
        id: 'com.nobo.promotedpost.2day',
        type: this.store.CONSUMABLE,
      },
      {
        id: 'com.nobo.promotedpost.3day',
        type: this.store.CONSUMABLE,
      },
      {
        id: 'com.nobo.promotedpost.4day',
        type: this.store.CONSUMABLE,
      },
      {
        id: 'com.nobo.promotedpost.5day',
        type: this.store.CONSUMABLE,
      },
      {
        id: 'com.nobo.promotedpost.6day',
        type: this.store.CONSUMABLE,
      },
      {
        id: 'com.nobo.promotedpost.1week',
        type: this.store.CONSUMABLE,
      },
    ]);
    this.store.refresh();
  }

  async subscribe(productId: string) {
    // this.store.refresh();
    //  TODO: do check to see if athlete, coach, or trainer
    //  currently defaults to athlete
    const response = await this.store.order(productId);
    return response;
  }

  getProductPrice(productId: string) {
    let p = this.store.get(productId).price;
    p = p.slice(1)
    return parseFloat(p);
  }

  getProductPriceString(productId: string) {
    return this.store.get(productId).price;
  }

  async purchasePromotedPost(productId: string) {
    const response = await this.store.order(productId);
    return response;
  }

  isPromotedPostOwned(productId: string) {
    return this.store.get(productId).owned;
  }

  refreshStore() {
    this.store.refresh();
  }

  isSubscribed(productId: string) {
    this.store.refresh();
    console.log('isSubscribed');
    console.log('This is the product ', this.store.get(productId));
    return this.store.get(productId).owned;
  }
}
