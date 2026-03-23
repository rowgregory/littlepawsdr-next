export const serializeProduct = (p: any) => ({
  ...p,
  price: Number(p.price),
  shippingPrice: Number(p.shippingPrice)
})
