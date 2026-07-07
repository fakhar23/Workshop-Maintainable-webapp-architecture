# Order Form Refactoring Workshop

This project starts with one intentionally messy React component:

```txt
src/order/OrderForm.jsx
```

The component works, but it has too many responsibilities in one file:

- UI rendering
- React state
- form validation
- product pricing
- coupon discounts
- shipping calculation
- API request logic
- email message creation
- fake email sending

The goal is to reorganize the code without changing the behavior.

## Run The App

```bash
npm install
npm run dev
```

## Starting Point

Open:

```txt
src/order/OrderForm.jsx
```

Notice that the submit handler contains validation, pricing, API calls, and email message logic directly inside the component.

This is the code students will refactor.

## Target Structure

Refactor the code into this structure:

```txt
src/order/
  OrderForm.jsx
  OrderForm.css
  orderValidation.js
  orderPricing.js
  orderApi.js
  emailMessages.js
```

## Step 1: Move Validation

Create:

```txt
src/order/orderValidation.js
```

Move the form validation logic into:

```js
validateOrderForm()
```

`OrderForm.jsx` should call this function instead of keeping validation rules inside the component.

## Step 2: Move Pricing Logic

Create:

```txt
src/order/orderPricing.js
```

Move product prices, coupon discounts, shipping, and final total logic into:

```js
getProductPrice()
calculateDiscountedTotal()
calculateShippingCost()
calculateFinalTotal()
```

`OrderForm.jsx` should only ask for the final total.

## Step 3: Move API Logic

Create:

```txt
src/order/orderApi.js
```

Move the two fake network requests into:

```js
placeOrder()
sendOrderEmail()
```

The component should not contain `fetch(...)` calls anymore.

## Step 4: Move Email Message Creation

Create:

```txt
src/order/emailMessages.js
```

Move the email subject and body formatting into:

```js
createOrderEmail()
```

`OrderForm.jsx` should not build the email string directly.

## Final Goal

At the end, `OrderForm.jsx` should mostly contain:

- React state
- submit flow
- JSX markup
- calls to helper functions

The business rules and side effects should live in separate files.

## Principles Practiced

- DRY: avoid repeating business/API patterns
- KISS: keep each piece simple
- Encapsulation: hide internal details behind functions
- High cohesion: keep related logic together
- Low coupling: avoid making the React component know everything
- Pure functions: make business rules easy to reuse and test
