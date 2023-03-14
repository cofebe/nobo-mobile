import { BaseService } from './BaseService';
import { SuccessResponse } from '../models';

export class OfferService extends BaseService {
  async createBuyOffer(productId: string, price: number): Promise<boolean> {
    const res = await super.fetch('POST', '/api/offers/create-offer', {
      productId: productId,
      price: price,
    });
    const json = await res.json();
    return json;
  }
}
