import BigNumber from "bignumber.js";

export function numberWithCommas(x: any, decimals = false) {
  const number = Number(x);
  if (number < 1) {
    return x;
  }

  if (decimals) {
    return parseFloat(number.toString()).toLocaleString("el-GR");
  } else {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

export function preventExponetialNotation(x: any) {
  return ("" + +x).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/, function(
    a,
    b,
    c,
    d,
    e
  ) {
    return e < 0
      ? b + "0." + Array(1 - e - c.length).join("0") + c + d
      : b + c + d + Array(e - d.length + 1).join("0");
  });
}

// function to cut a number with a lot zeros after decimal point and ... and show last part of the number
export function shortenNumber(
  numString: string,
  decimalPlaces: number,
  lastDigits: number
): string {
  const num = new BigNumber(numString);
  const factor = new BigNumber(10).pow(-decimalPlaces);
  const shortened = num
    .times(factor)
    .decimalPlaces(0, BigNumber.ROUND_HALF_UP)
    .div(factor);
  const str = shortened.toString();
  const parts = str.split(".");
  let result = parts[0];
  if (parts[1]) {
    result += "." + parts[1].slice(0, lastDigits);
    if (parts[1].length > lastDigits) {
      result += "...";
    }
  }
  return numString;
}
