import { isInteger } from 'lodash';

export function div2(n: number) {
  const i = Math.floor(Math.abs(n / 2));
  return n >= 0 ? i : -i;
}

export function ulog2(n: number): number {
  if (n === 0 ) return 0;
  const x = n < 0 ? Math.abs(n) : n;
  const xprime = Math.log2(x);
  const xprimeprime = isInteger(n) ? Math.floor(xprime) : xprime;
  return n < 0 ? -xprimeprime : xprimeprime;
}