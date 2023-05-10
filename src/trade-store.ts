import { BehaviorSubject } from 'rxjs';
import { Product, PaymentMethod, Address } from './models';
import { getTradeFee, getTradeFeePercentage } from './utils';

export interface TradeState {
  //id: string;
  productWanted: Product | null | undefined;
  productOffered: Product | null | undefined;
  shippingAddress: Address | null | undefined;
  paymentMethod: PaymentMethod | null | undefined;
  tradeFee: number;
  tradeFeePercentage: number;
  shipping: number;
  tax: number;
  total: number;
  isInitial: boolean;
}

const tradeInitialState: TradeState = {
  //id: '',
  productWanted: null,
  productOffered: null,
  shippingAddress: null,
  paymentMethod: null,
  tradeFee: 0,
  tradeFeePercentage: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  isInitial: true,
};

let tradeState = tradeInitialState;
let tradeStateUpdating = false;

const tradeSubject = new BehaviorSubject<TradeState>(tradeInitialState);

function recalculateState(state: TradeState): TradeState {
  if (state.productOffered && state.productWanted) {
    state.tradeFee = getTradeFee(state.productWanted.price, state.productOffered.price);
    state.tradeFeePercentage = getTradeFeePercentage(
      state.productWanted.price + state.productOffered.price
    );
  } else {
    state.tradeFee = 0;
    state.tradeFeePercentage = getTradeFeePercentage(0);
  }
  state.total = state.tradeFee + state.tax + state.shipping;
  return state;
}

export const tradeStore = {
  // get the initial/empty state
  initialState: tradeInitialState,
  reset: () => {
    tradeState = tradeInitialState;
    tradeSubject.next(tradeState);
  },

  // get the current state
  getCurrent: () => {
    return tradeState;
  },

  // to be used we updating a number of properties, kind of like a transaction
  beginUpdate: () => {
    tradeStateUpdating = true;
  },
  endUpdate: () => {
    tradeStateUpdating = false;
    tradeSubject.next(tradeState);
  },

  // subscribe for changes
  subscribe: (setTradeState: any) => {
    return tradeSubject.subscribe(setTradeState);
  },

  // set properties
  setProductWanted: (product: Product) => {
    tradeState = recalculateState({
      ...tradeState,
      productWanted: product,
      isInitial: false,
    });
    if (!tradeStateUpdating) {
      tradeSubject.next(tradeState);
    }
  },
  setProductOffered: (product: Product) => {
    tradeState = recalculateState({
      ...tradeState,
      productOffered: product,
      isInitial: false,
    });
    if (!tradeStateUpdating) {
      tradeSubject.next(tradeState);
    }
  },
  setShipping: (shipping: number) => {
    if (shipping !== tradeState.shipping) {
      tradeState = recalculateState({
        ...tradeState,
        shipping,
        isInitial: false,
      });
      if (!tradeStateUpdating) {
        tradeSubject.next(tradeState);
      }
    }
  },
  setTax: (tax: number) => {
    if (tax !== tradeState.tax) {
      tradeState = recalculateState({
        ...tradeState,
        tax,
        isInitial: false,
      });
      if (!tradeStateUpdating) {
        tradeSubject.next(tradeState);
      }
    }
  },
  setShippingAddress: (addr: Address | null | undefined) => {
    // return if no changes
    if (!addr && !tradeState.shippingAddress) {
      return;
    }
    if (addr && tradeState.shippingAddress) {
      if (addr._id === tradeState.shippingAddress._id) {
        return;
      }
    }
    // something changed
    tradeState = {
      ...tradeState,
      shippingAddress: addr,
      isInitial: false,
    };
    if (!tradeStateUpdating) {
      tradeSubject.next(tradeState);
    }
  },
  setPaymentMethod: (pm: PaymentMethod | null | undefined, tradeStateUpdating = false) => {
    // return if no changes
    if (!pm && !tradeState.paymentMethod) {
      return;
    }
    if (pm && tradeState.paymentMethod) {
      if (pm.id === tradeState.paymentMethod.id) {
        return;
      }
    }
    // something changed
    tradeState = {
      ...tradeState,
      paymentMethod: pm,
      isInitial: false,
    };
    if (!tradeStateUpdating) {
      tradeSubject.next(tradeState);
    }
  },
};
