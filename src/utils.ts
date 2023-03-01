
export function formatPrice(val: number, includeDecimals: boolean = true): string {
  let ret = '$';
  ret += val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
