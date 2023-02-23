export function getNoboFee(tradeTransactionValue: any) {
  let noboFee = 12;
  if (tradeTransactionValue > 20000) {
    noboFee = 8;
  }
  if (tradeTransactionValue > 50000) {
    noboFee = 4;
  }
  return noboFee;
}

/**
 * TheNOBO fees for trading:
 * both users split the cost of the trade transaction fee
 */
export function calculateFee(tradeTransactionValue: any) {
  let noboFee = getNoboFee(tradeTransactionValue);
  return (tradeTransactionValue * noboFee) / 100 / 2;
}

/**
 * Product Card (TRADE):
 * display estimated fee for current user, i.e. "Your Est. Price: $200.00 - $300.00"
 */
export function calculateEstPrice(productPrice: any) {
  let tradeTransactionValue;
  // second product is estimated to have 20% lower price
  tradeTransactionValue = productPrice * 1.834;
  let noboFeeMin =
    (getNoboFee(tradeTransactionValue) * tradeTransactionValue) / 100 / 2;
  // second product is estimated to have 20% higher price
  tradeTransactionValue = productPrice * 2.166;
  let noboFeeMax =
    (getNoboFee(tradeTransactionValue) * tradeTransactionValue) / 100 / 2;
  return `$${noboFeeMin.toFixed(2)} - $${noboFeeMax.toFixed(2)}`;
}
