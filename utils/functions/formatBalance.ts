import BigNumber from "bignumber.js";
import { numberWithCommas, preventExponetialNotation } from "./numbers";

export const formatBalance = (
  token: { balance: string | number; decimals?: number; withDots?: boolean },
  retrunNumber = false,
  customPrecision?: number
) => {
  if (token) {
    const strBalance = token.balance;
    const intBalance = Number(strBalance);
    const formatedBalance = getRealBalance(intBalance, token.decimals);

    const finalBinance = formatPrecision(Number(formatedBalance), customPrecision);

    if (retrunNumber) {
      return finalBinance;
    }

    const withoutExponential = preventExponetialNotation(finalBinance);

    if (token.withDots) {
      return numberWithCommas(withoutExponential, true);
    } else {
      return numberWithCommas(withoutExponential);
    }
  }
  // if (token?.balance === 0) {
  //   return 0;
  // }
  return null;
};

export const getRealBalance = (
  balance1: number | string = 0,
  decimal?: number,
  returnBigNumber: boolean = false
) => {
  const divider = Math.pow(10, decimal ?? 18);
  const balance = new BigNumber(balance1);
  const real = balance.dividedBy(divider, 10);

  if (returnBigNumber) {
    return real;
  }
  return real.toNumber();
};

export const formatPrecision = (num: number, customPrecision?: number) => {
  if (!num) {
    return 0;
  }
  let precision = customPrecision ?? 2;
  if (!customPrecision && customPrecision !== 0) {
    if (num < 1) {
      if (num < 0.009) {
        if (num < 0.0000001) {
          if (num < 0.000000001) {
            if (num < 0.00000000001) {
              precision = 18;
            } else {
              precision = 16;
            }
          } else {
            precision = 11;
          }
        } else {
          precision = 6;
        }
      } else {
        precision = 4;
      }
    }
    if (num === 1) {
      precision = 1;
    }
    if (num > 1) {
      precision = 2;
    }
  }

  return Number(new BigNumber(num).toFixed(precision));
};
