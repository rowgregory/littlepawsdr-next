const addToExistingCartItem = (item: any, state: any, existingItem: any) => {
  if (item?.from === 'cart') existingItem.quantity += 1;
  else existingItem.quantity = item?.quantity;

  const updatedCartItems = state.cartItems.map((x: any) =>
    (x.productId === item?.productId && x.size === item?.size) ||
    (x.productId === item?.productId && item?.isEcard)
      ? existingItem
      : x
  );

  const { shippingPrice, totalItems, subtotal } = updatedCartItems?.reduce(
    (acc: any, item: any) => {
      return {
        shippingPrice: acc.shippingPrice + Number(item?.shippingPrice) * Number(item?.quantity),
        totalItems: (acc.totalItems += Number(item?.quantity)),
        subtotal: acc.subtotal + Number(item?.price) * Number(item?.quantity),
      };
    },
    { shippingPrice: 0, totalItems: 0, subtotal: 0 }
  );

  const isPhysicalProduct = updatedCartItems?.some((item: any) => item?.isPhysicalProduct);

  const processingFee = 0.035 * subtotal;

  state.loading = false;
  state.cartItem = item;
  state.cartItems = updatedCartItems;
  state.cartItemsAmount = totalItems;
  state.subtotal = subtotal;
  state.processingFee = processingFee;
  state.shippingPrice = shippingPrice;
  state.isPhysicalProduct = isPhysicalProduct;
  state.totalPrice = shippingPrice + subtotal + processingFee;
};

const addNewCartItem = (item: any, state: any) => {
  const newProductCartItem = [...state.cartItems, { ...item, quantity: item?.quantity || 1 }];

  const { shippingPrice, totalItems, subtotal } = newProductCartItem?.reduce(
    (acc, item) => {
      return {
        shippingPrice: acc.shippingPrice + Number(item.shippingPrice) * Number(item.quantity),
        totalItems: (acc.totalItems += Number(item.quantity)),
        subtotal: acc.subtotal + Number(item.price) * Number(item.quantity),
      };
    },
    { shippingPrice: 0, totalItems: 0, subtotal: 0 }
  );

  const isPhysicalProduct = newProductCartItem?.some((item: any) => item.isPhysicalProduct);

  const processingFee = 0.035 * subtotal;

  state.loading = false;
  state.cartItem = item;
  state.cartItems = newProductCartItem;
  state.cartItemsAmount = totalItems;
  state.subtotal = subtotal;
  state.processingFee = processingFee;
  state.shippingPrice = shippingPrice;
  state.isPhysicalProduct = isPhysicalProduct;
  state.totalPrice = shippingPrice + subtotal + processingFee;
};

const cartRemoveItem = (item: any, state: any) => {
  const cartItems = state.cartItems.filter(
    (x: any) =>
      x.size !== item.size || x.productId !== item.productId || x.dachshundId !== item.dachshundId
  );

  const { shippingPrice, cartItemsAmount, subtotal } = cartItems?.reduce(
    (acc: any, item: any) => {
      return {
        shippingPrice: acc.shippingPrice + Number(item.shippingPrice) * Number(item.quantity),
        cartItemsAmount: (acc.cartItemsAmount += Number(item.quantity)),
        subtotal: acc.subtotal + Number(item.price) * Number(item.quantity),
      };
    },
    { shippingPrice: 0, cartItemsAmount: 0, subtotal: 0 }
  );

  const isPhysicalProduct = cartItems?.some((item: any) => item.isPhysicalProduct);

  const processingFee = 0.035 * subtotal;

  state.loading = false;
  state.cartItem = item;
  state.cartItems = cartItems;
  state.cartItemsAmount = cartItemsAmount;
  state.subtotal = subtotal;
  state.processingFee = processingFee;
  state.shippingPrice = shippingPrice;
  state.isPhysicalProduct = isPhysicalProduct;
  state.totalPrice = shippingPrice + subtotal + processingFee;
};

const cartDeleteItemSuccess = (item: any, state: any) => {
  const cartItems = state.cartItems.map((cartItem: any) => {
    if (cartItem.productId === item.productId && cartItem.size === item.size) {
      const exist = JSON.parse(JSON.stringify(cartItem));
      exist.quantity -= 1;
      return exist;
    } else {
      return cartItem;
    }
  });

  const { shippingPrice, cartItemsAmount, subtotal } = cartItems?.reduce(
    (acc: any, item: any) => {
      return {
        shippingPrice: acc.shippingPrice + Number(item.shippingPrice) * Number(item.quantity),
        cartItemsAmount: (acc.cartItemsAmount += Number(item.quantity)),
        subtotal: acc.subtotal + Number(item.price) * Number(item.quantity),
      };
    },
    { shippingPrice: 0, cartItemsAmount: 0, subtotal: 0 }
  );

  const isPhysicalProduct = cartItems?.some((item: any) => item.isPhysicalProduct);

  const processingFee = 0.035 * subtotal;

  state.loading = false;
  state.cartItem = item;
  state.cartItems = cartItems;
  state.cartItemsAmount = cartItemsAmount;
  state.subtotal = subtotal;
  state.processingFee = processingFee;
  state.shippingPrice = shippingPrice;
  state.isPhysicalProduct = isPhysicalProduct;
  state.totalPrice = shippingPrice + subtotal + processingFee;
};

export { addToExistingCartItem, addNewCartItem, cartRemoveItem, cartDeleteItemSuccess };
