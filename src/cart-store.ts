import { Subject } from 'rxjs';
import { Product, ShoppingCart } from './models';

const shoppingCartSubject = new Subject<ShoppingCart>();

const shoppingCartInitialState: ShoppingCart = {
  _id: '',
  products: [],
};

let shoppingCartState = shoppingCartInitialState;

export const shoppingCartStore  = {
  subscribe: (setShoppingCartState: any) => {
    return shoppingCartSubject.subscribe(setShoppingCartState);
  },
  setProducts: (products: Product[]) => {
    shoppingCartState = {
      ...shoppingCartState,
      products,
    };
    shoppingCartSubject.next(shoppingCartState);
  },
  addProduct: (product: Product) => {
    if (product) {
      shoppingCartState = {
        ...shoppingCartState,
        products: [
          ...shoppingCartState.products,
          product,
        ],
      };
      shoppingCartSubject.next(shoppingCartState);
    }
  },
  removeProduct: (productId: string) => {
    if (productId) {
      shoppingCartState = {
        ...shoppingCartState,
        products: shoppingCartState.products.filter(p => p._id !== productId),
      };
      shoppingCartSubject.next(shoppingCartState);
    }
  },
  initialState: shoppingCartInitialState,
};

