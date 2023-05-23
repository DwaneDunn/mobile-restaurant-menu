'use strict';

// Menu Data
import { menuArray } from './data';

// DOM has loaded
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

const cart = [];

// FUNCTION -- DOM Loaded
function ready() {
  renderMenuFromData();

  // EVENT Listener -- ADD to cart button
  const addToCartButtons = document.querySelectorAll('.add-item');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', addToCart);
  });
}

// FUNCTION -- RENDER item menu
function renderMenuFromData() {
  let menuHTML = '';
  menuArray.forEach(({ name, ingredients, id, price, emoji }) => {
    menuHTML += `
    <div class="item">
      <p class="item-emoji">${emoji}</p>

      <div class="item-details">
        <h2 class="item-name">${name}</h2>
        <p class="item-ingredients">${ingredients}</p>
        <p class="item-price">${price}</p>
      </div>

      <img
        class="add-item"
        id="add-${name}"
        data-add-item-id=${id}
        src="/assets/images/add-btn.png"
        alt=""
      />
    </div>
    `;
  });

  document.querySelector('#menu').innerHTML = menuHTML;
}

// FUNCTION -- ADD to cart
function addToCart(e) {
  const addItemById = Number(e.target.dataset.addItemId);
  const indexInCart = Number(cart.findIndex((item) => item.id === addItemById));

  if (indexInCart === -1) {
    let AddQtyToObject = Object.assign(menuArray[addItemById], {
      qty: 1,
    });

    cart.push(AddQtyToObject);
  } else {
    cart[indexInCart].qty++;
  }

  showCartItems();
  updateCartTotal();

  document.querySelector('#order').style.display = 'block';
}

// FUNCTION -- SHOW items in cart
function showCartItems() {
  const orderItems = document.querySelector('#display-order-items');

  let itemsHTML = ``;

  cart.forEach((item) => {
    itemsHTML += `
    <div class="order-row">
      <p class="order-item-name">
        ${item.name} <span class="remove" data-remove-id=${
      item.id
    }>remove</span>
      </p>
      <p class="item-price">${item.price * item.qty}</p>
    </div>
    `;
  });

  orderItems.innerHTML = itemsHTML;
}

// FUNCTION -- UPDATE total
function updateCartTotal() {
  let orderTotal = 0;

  cart && cart.length
    ? cart.forEach((item) => {
        orderTotal = orderTotal + item.qty * item.price;
      })
    : (orderTotal = 0);

  orderTotal = Math.round(orderTotal * 100) / 100;

  document.querySelector('#order-total').innerText = orderTotal.toFixed(0);

  orderTotal === 0
    ? (document.querySelector('#btn-order').style.display = 'none')
    : (document.querySelector('#btn-order').style.display = '');
}

// EVENT Listener -- REMOVE Button
const removeItems = document.querySelector('.order-items');
removeItems.addEventListener('click', removeCartItem);

// FUNCTION -- REMOVE Item
function removeCartItem(e) {
  const removeItemId = Number(e.target.dataset.removeId);
  const deleteIndexItem = Number(
    cart.findIndex((item) => item.id === removeItemId)
  );

  if (Number(cart[deleteIndexItem].qty) >= 2) {
    cart[deleteIndexItem].qty--;
  } else {
    cart.splice(deleteIndexItem, 1);
    e.target.parentElement.parentElement.remove();
  }

  showCartItems();
  updateCartTotal();
}

// EVENT Listener -- COMPLETE order button
const orderButton = document.querySelector('#btn-order');
orderButton.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#modal-container').classList.add('show-modal');
});

// EVENT listener -- MODAL - payment form
const paymentForm = document.querySelector('#credit-card-form');
paymentForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const form = document.querySelector('#credit-card-form');
  const payment = new FormData(form);

  document.querySelector('.receipt-name').innerText = payment.get('card-name');
  paymentComplete();

  cart.splice(0, cart.length);
});

// FUNCTION - PAYMENT complete
// Close Modal, Hide Order & Show Receipt Area
function paymentComplete() {
  document.querySelector('#modal-container').classList.remove('show-modal');
  document.querySelector('#modal-container').classList.add('hide-modal');
  document.querySelector('#order').style.display = 'none';
  document.querySelector('#receipt').style.display = 'block';
}
