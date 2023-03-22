
export function getImageUrl(url: string) {
  if (!url) {
    return '';
  }

  if (!url.startsWith('http')) {
    url = 'https://thenobo.codepilot.com' + url;
  }

  return `url(${url})`;
}

export function formatPrice(val: number, includeDecimals: boolean = true): string {
  if (val === null || val === undefined) {
    return val;
  }

  let ret = '$';
  ret += val.toFixed(includeDecimals ? 2 : 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (includeDecimals) {
    if(!ret.includes('.')) {
      ret += '.00';
    }
    while (ret[ret.length - 3] !== '.') {
      ret += '0';
    }
  }
  return ret;
}

export function getCardImage(brand: string): string {
  switch (brand) {
    case 'MasterCard':
    case 'mastercard':
    case 'mc':
      return 'assets/images/cc-mastercard.svg';
    case 'Discover':
    case 'discover':
      return 'assets/images/cc-discover.svg';
    case 'American Express':
    case 'AMEX':
    case 'amex':
      return 'assets/images/cc-amex.svg';
    case 'Visa':
    case 'visa':
    default:
      return 'assets/images/cc-visa.svg';
  }
}

export function getMinTradeValue(price: number): number {
  return price * 0.8;
}

export function getMaxTradeValue(price: number): number {
  return price * 1.2;
}

export function getTradeFeePercentage(subtotal: number): number {
  if (subtotal < 20000) {
    return 0.12;
  }
  if (subtotal < 50000) {
    return 0.08;
  }
  return 0.04;
}

export function getTradeFee(price1: number, price2: number): number {
  const sum = price1 + price2;
  const feePercentage = getTradeFeePercentage(sum);
  return sum / 2 * feePercentage;
}

export function getMinTradeFee(price: number): number {
  return getTradeFee(price, getMinTradeValue(price));
}

export function getMaxTradeFee(price: number): number {
  return getTradeFee(price, getMaxTradeValue(price));
}
