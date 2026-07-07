export function getProductPrice(product) {
  if (product === "Headphones") {
    return 80;
  }

  if (product === "Keyboard") {
    return 120;
  }

  if (product === "Mouse") {
    return 50;
  }

  return 0;
}

export function calculateDiscountedTotal({ price, quantity, couponCode }) {
  let total = price * quantity;

  if (couponCode === "STUDENT20") {
    total = total * 0.8;
  }

  if (couponCode === "VIP10") {
    total = total * 0.9;
  }

  return total;
}

export function calculateShippingCost(total) {
  if (total >= 100) {
    return 0;
  }

  return 10;
}

export function calculateFinalTotal({ product, quantity, couponCode }) {
  const price = getProductPrice(product);
  const discountedTotal = calculateDiscountedTotal({
    price,
    quantity,
    couponCode,
  });
  const shippingCost = calculateShippingCost(discountedTotal);

  return discountedTotal + shippingCost;
}
