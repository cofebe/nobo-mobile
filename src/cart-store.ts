import { Subject } from 'rxjs';
import { Product, PaymentMethod, Address } from './models';

const shoppingCartSubject = new Subject<ShoppingCartState>();

export interface ShoppingCartState {
  //id: string;
  products: Product[];
  shippingAddress: Address|null|undefined;
  paymentMethod: PaymentMethod|null|undefined;
  shipping: number;
  tax: number;
  subtotal: number;
  total: number;
}

const shoppingCartInitialState: ShoppingCartState = {
  //id: '',
  products: [],
  shippingAddress: null,
  paymentMethod: null,
  shipping: 0,
  tax: 0,
  subtotal: 0,
  total: 0,
};

let shoppingCartState = shoppingCartInitialState;
let shoppingCartStateUpdating = false;

function recalculateState(state: ShoppingCartState): ShoppingCartState {
  state.subtotal = state.products.reduce((total, curr) => total + curr.price, 0);
  state.total = state.subtotal + state.tax + state.shipping;
  return state;
}

export const shoppingCartStore  = {
  // get the initial/empty state
  initialState: shoppingCartInitialState,

  // get the current state
  getCurrent: () => {
    return shoppingCartState;
  },

  // to be used we updating a number of properties, kind of like a transaction
  beginUpdate: () => {
    shoppingCartStateUpdating = true;
  },
  endUpdate: () => {
    shoppingCartStateUpdating = false;
    shoppingCartSubject.next(shoppingCartState);
  },

  // subscribe for changes
  subscribe: (setShoppingCartState: any) => {
    return shoppingCartSubject.subscribe(setShoppingCartState);
  },

  // set properties
  setProducts: (products: Product[]) => {
    shoppingCartState = recalculateState({
      ...shoppingCartState,
      products,
    });
    if (!shoppingCartStateUpdating) {
      shoppingCartSubject.next(shoppingCartState);
    }
  },
  setShipping: (shipping: number) => {
    if (shipping !== shoppingCartState.shipping) {
      shoppingCartState = recalculateState({
        ...shoppingCartState,
        shipping,
      });
      if (!shoppingCartStateUpdating) {
        shoppingCartSubject.next(shoppingCartState);
      }
    }
  },
  setTax: (tax: number) => {
    if (tax !== shoppingCartState.tax) {
      shoppingCartState = recalculateState({
        ...shoppingCartState,
        tax,
      });
      if (!shoppingCartStateUpdating) {
        shoppingCartSubject.next(shoppingCartState);
      }
    }
  },
  setShippingAddress: (addr: Address|null|undefined) => {
    // return if no changes
    if (!addr && !shoppingCartState.shippingAddress) {
      return;
    }
    if (addr && shoppingCartState.shippingAddress) {
      if (addr._id === shoppingCartState.shippingAddress._id) {
        return;
      }
    }
    // something changed
    shoppingCartState = {
      ...shoppingCartState,
      shippingAddress: addr,
    };
    if (!shoppingCartStateUpdating) {
      shoppingCartSubject.next(shoppingCartState);
    }
  },
  setPaymentMethod: (pm: PaymentMethod|null|undefined, shoppingCartStateUpdating = false) => {
    // return if no changes
    if (!pm && !shoppingCartState.paymentMethod) {
      return;
    }
    if (pm && shoppingCartState.paymentMethod) {
      if (pm.id === shoppingCartState.paymentMethod.id) {
        return;
      }
    }
    // something changed
    shoppingCartState = {
      ...shoppingCartState,
      paymentMethod: pm,
    };
    if (!shoppingCartStateUpdating) {
      shoppingCartSubject.next(shoppingCartState);
    }
  },

  // add/remove products
  addProduct: (product: Product) => {
    if (product) {
      if (!shoppingCartState.products.find(p => p._id === product._id)) {
        shoppingCartState = recalculateState({
          ...shoppingCartState,
          products: [
            ...shoppingCartState.products,
            product,
          ],
        });
        if (!shoppingCartStateUpdating) {
          shoppingCartSubject.next(shoppingCartState);
        }
      }
    }
  },
  removeProduct: (productId: string) => {
    if (productId) {
      if (shoppingCartState.products.find(p => p._id === productId)) {
        shoppingCartState = recalculateState({
          ...shoppingCartState,
          products: shoppingCartState.products.filter(p => p._id !== productId),
        });
        if (!shoppingCartStateUpdating) {
          shoppingCartSubject.next(shoppingCartState);
        }
      }
    }
  },
};

