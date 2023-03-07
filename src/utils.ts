
export function getImageUrl(url: string) {
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
  ret += val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
