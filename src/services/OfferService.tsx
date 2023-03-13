import { BaseService } from './BaseService';
import { SuccessResponse } from '../models';

export class OfferService extends BaseService {
  async createBuyOffer(productId: string, price: number): Promise<boolean> {
    const res = await super.fetch('POST', '/api/orders/cart', {
      productId: productId,
      price: price,
    });
    const json: SuccessResponse = await res.json();
    return json.success;
  }
}
