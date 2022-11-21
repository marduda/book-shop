
// Fetch books data from JSON
let storage = [];
let orderItems = [];

fetch('./assets/data/books.json')
  .then(response => response.json())
  .then(data => {
    storage = data;
    createBooks();
  })
  .catch(err => console.log(err));

// Constructor - new item
function Item(author, title, price, count) {
  this.author = author;
  this.title = title;
  this.price = price;
  this.count = count || 1;
}

// Cart functions
function addItem(data){
  let index = orderItems.findIndex(e => e.title === data.title);
  if( index === -1) {
    orderItems.push(new Item(data.author, data.title, data.price));
  } else {
    orderItems[index].count++;
  }
  createCart()
}

let orderFunction = () => {
  window.location.href='./pages/order/index.html';
}

function createCart() {
  const newCloseBtn = document.createElement('span');
  newCloseBtn.className = 'fa fa-times-circle-o fa-2x';
  newCloseBtn.onclick = closeCart;

  if (orderItems.length == 0) {
    let message = document.createElement('p');
    message.textContent = 'Cart is empty';
    cartCard.replaceChildren(newCloseBtn, message);
  } else {
    let table = document.createElement('table');
    table.className = 'cart-item';
    let rowHeading = document.createElement('tr');

    Object.keys(orderItems[0]).map(e => {
      let th = document.createElement('th');
      th.textContent = e;
      rowHeading.append(th);
    })
    table.append(rowHeading);

    orderItems.map((item, index) => {
      let row = document.createElement('tr');
      table.append(row);
      for(let element in item) {
        let td = document.createElement('td');
        td.textContent = item[element];
        row.append(td);
      }
      let td = document.createElement('td');
      let removeBtn = document.createElement('button');
      removeBtn.textContent = 'X';
      removeBtn.onclick = removeItem;
      removeBtn.dataset.index = index;

      td.append(removeBtn);
      row.append(td);

    });

    let row = document.createElement('tr');
    let summary = document.createElement('td');
    summary.textContent = 'Summary';
    summary.colSpan = 2;

    let finalPrice = 0;
    let finalAmmount = 0;
    let priceSum = document.createElement('td');
    let countSum = document.createElement('td');
    orderItems.map(e => {
      finalPrice += e.price * e.count
      finalAmmount += e.count;
    });
    priceSum.textContent = `$${finalPrice}`;
    countSum.textContent = finalAmmount;
    let clear = document.createElement('td');
    let clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear cart';
    clearBtn.onclick = clearCart;
    clear.append(clearBtn)
    row.append(summary, priceSum, countSum, clear);
    table.append(row);

    let orderButton = document.createElement('button');
    orderButton.textContent = 'Order';
    // orderButton.onclick = 'location.href = ./pages/order/index.html';
    orderButton.onclick = orderFunction;


    cartCard.replaceChildren(newCloseBtn, table, orderButton);
  }
}

// Events
let openReadMore = (e) => e.target.nextSibling.classList.add('visible');
let closeReadMore = (e) => e.target.parentNode.classList.remove('visible');
let toggleCart = (e) => e.target.nextSibling.classList.toggle('visible');
let closeCart = (e) => e.target.parentNode.classList.remove('visible');
let addToCart = (e) => {
  let data = e.target.dataset;
  addItem(data);
};
let removeItem = (e) => {
  orderItems.splice(e.target.dataset.index, 1);
  createCart();
}
let clearCart = () => {
  orderItems = [];
  createCart();
};
let submitOrder = (e) => {
  // e.preventDefault();
  console.log(e)
}


// Nav and cart
let nav = document.createElement('nav');
let navList = document.createElement('ul');
let cart = document.createElement('li');
let cartIcon = document.createElement('i');
cartIcon.className = 'fa fa-shopping-cart fa-2x';
cartIcon.onclick = toggleCart;
let cartCard = document.createElement('div');
cartCard.className = 'cart-card';

nav.append(navList);
navList.append(cart);
cart.append(cartIcon, cartCard);

// Header
let header = document.createElement('header');
let h1 = document.createElement('h1');
h1.textContent = 'Book Store';
let navLink = document.createElement('a');
navLink.href = '#';
navLink.append(h1);
header.appendChild(navLink);
header.append(nav);
document.body.append(header);

// Container
let container = document.createElement('div');
container.className = 'container';
document.body.append(container);

// Book card
function addBook(author, image, title, price, description) {
  const newCard = document.createElement('div');
  newCard.className = 'book-card';
  newCard.setAttribute('draggable', 'true');

  const newImageContainer = document.createElement('div');
  newImageContainer.className = 'img-container';
  newCard.appendChild(newImageContainer);

  const newImage = document.createElement('img');
  newImage.src = `../../assets/images/${image}`;
  newImageContainer.appendChild(newImage);

  const newDetails = document.createElement('div');
  newDetails.className = 'details';
  newCard.appendChild(newDetails);

  const newTitle = document.createElement('h2');
  newTitle.textContent = title;

  const newAuthor = document.createElement('h3');
  newAuthor.textContent = author;

  const newPrice = document.createElement('h2');
  newPrice.textContent = `Price: $${price}`

  const newReadMore = document.createElement('a');
  newReadMore.textContent = 'read more';
  newReadMore.onclick = openReadMore;

  const newModal = document.createElement('div');
  newModal.className = 'modal';

  const newAddToCart = document.createElement('button');
  newAddToCart.textContent = 'Add to cart';
  newAddToCart.dataset.author = author;
  newAddToCart.dataset.title = title;
  newAddToCart.dataset.price = price;
  newAddToCart.onclick = addToCart;

  newDetails.append(newTitle, newAuthor, newPrice, newReadMore ,newModal, newAddToCart);

  const newDescription = document.createElement('p');
  newDescription.textContent = description;

  const newCloseBtn = document.createElement('span');
  newCloseBtn.className = 'fa fa-times-circle-o fa-2x';
  newCloseBtn.onclick = closeReadMore;
  newModal.append(newDescription, newCloseBtn);

  container.append(newCard);
}

// Create books from JSON
function createBooks() {
  for( book of storage) {
    let { author, imageLink, title, price, description } = book;
    addBook(author, imageLink, title, price, description);
  }
  createCart();
}