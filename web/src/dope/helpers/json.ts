export function bigIntSerializer(_k: string, v: any): any {
  return typeof v === "bigint" ? v.toString() : v;
}
