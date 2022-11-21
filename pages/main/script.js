
let storage = [];
let orderItems = [];

function Item(author, title, price, count) {
  this.author = author;
  this.title = title;
  this.price = price;
  this.count = count || 1;
};

const openReadMore = (e) => e.target.nextSibling.classList.add('visible');
const closeReadMore = (e) => e.target.parentNode.classList.remove('visible');
const toggleCart = (e) => e.target.nextSibling.classList.toggle('visible');
const closeCart = (e) => e.target.parentNode.classList.remove('visible');
const addToCart = (e) => {
  let data = e.dataset ? e.dataset : e.target.dataset;
  let index = orderItems.findIndex(e => e.title === data.title);
  index === -1 ? orderItems.push(new Item(data.author, data.title, data.price)) : orderItems[index].count++;
  createCart();
};
const removeItem = (e) => {
  orderItems.splice(e.target.dataset.index, 1);
  createCart();
};
const clearCart = () => {
  orderItems = [];
  createCart();
};
const submitOrder = () => window.location.href='./pages/order/index.html';
const dragStart = (e) => {
  e.dataTransfer.setData('Text', e.target.id);
  e.dataTransfer.effectAllowed = "move";
  console.log(e.dataTransfer);
};
const dragOverEvent = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = "move";
}
const dropEvent = (e) => {
  e.preventDefault();
  let id = e.dataTransfer.getData('Text');
  let element = document.querySelector(`#btn-${id}`);
  console.log(element)
  addToCart(element);
};

const createCart = () => {
  let cartCard = document.querySelector('.cart-card');

  const createCloseCartBtn = () => {
    const newCloseBtn = document.createElement('span');
    newCloseBtn.className = 'fa fa-times-circle-o fa-2x';
    newCloseBtn.onclick = closeCart;
    return newCloseBtn;
  }
  const setEmptyCart = () => {
    let message = document.createElement('p');
    message.textContent = 'Cart is empty';
    cartCard.replaceChildren(closeCartBtn, message);
  }
  const createOrderTable = () => {
    let table = document.createElement('table');
    table.className = 'cart-item';

    let createHeading = () => {
      let rowHeading = document.createElement('tr');
      Object.keys(orderItems[0]).map(e => {
        let th = document.createElement('th');
        th.textContent = e;
        rowHeading.append(th);
      })
      let action = document.createElement('th');
      action.textContent = 'action';
      rowHeading.append(action);
      return rowHeading;
    }

    const createOrderList = () => {
      let orderList = document.createDocumentFragment();
      orderItems.map((item, index) => {
        let row = document.createElement('tr');
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
        orderList.append(row);
      });
      return orderList;
    }

    const createSummary = () => {
      let summary = document.createElement('tr');
      let td = document.createElement('td');
      td.textContent = 'Summary';
      td.colSpan = 2;

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
      summary.append(td, priceSum, countSum, clear);
      return summary;
    };

    const createOrderBtn = () => {
      let orderButton = document.createElement('button');
      orderButton.textContent = 'Order';
      orderButton.onclick = submitOrder;
      return orderButton;
    };

    const updateCard = () => {
      let heading = createHeading();
      let orderList = createOrderList();
      let summary = createSummary();
      let orderButton = createOrderBtn();
      table.append(heading, orderList, summary);
      let updatedCard = document.createDocumentFragment();
      updatedCard.append(closeCartBtn, table, orderButton);
      return updatedCard;
    }
    cartCard.replaceChildren(updateCard());
  }

  let closeCartBtn = createCloseCartBtn();
  (orderItems.length === 0) ? setEmptyCart() : createOrderTable();
}

const createSite = () => {
  let site = document.createDocumentFragment();

  const createHeader = () => {
    let header = document.createElement('header');
    let h1 = document.createElement('h1');
    h1.textContent = 'Book Store';
    let navLink = document.createElement('a');
    navLink.href = '#';

    let nav = document.createElement('nav');
    let navList = document.createElement('ul');

    let cart = document.createElement('li');
    cart.ondrop = dropEvent;
    cart.ondragover = dragOverEvent;
    let cartIcon = document.createElement('i');
    cartIcon.className = 'fa fa-shopping-cart fa-2x';
    cartIcon.onclick = toggleCart;
    let cartCard = document.createElement('div');
    cartCard.className = 'cart-card';

    navLink.append(h1);
    header.append(navLink, nav);
    nav.append(navList);
    navList.append(cart);
    cart.append(cartIcon, cartCard);

    return header;
  }
  const createContainer = () => {
    let container = document.createElement('div');
    container.className = 'container';
    return container;
  }
  site.append(createHeader(), createContainer())
  document.body.append(site);
}

const createBookCard = (author, image, title, price, description, index) => {
  const newCard = document.createElement('div');
  newCard.id = index;
  newCard.className = 'book-card';
  newCard.setAttribute('draggable', 'true');
  newCard.ondragstart = dragStart;

  const newImageContainer = document.createElement('div');
  newImageContainer.className = 'img-container';
  newCard.appendChild(newImageContainer);

  const newImage = document.createElement('img');
  newImage.src = `./assets/images/${image}`;
  newImageContainer.appendChild(newImage);

  const newDetails = document.createElement('div');
  newDetails.className = 'details';
  newCard.appendChild(newDetails);

  const newTitle = document.createElement('h2');
  newTitle.textContent = title;

  const newAuthor = document.createElement('h3');
  newAuthor.textContent = author;

  const newPrice = document.createElement('h3');
  newPrice.textContent = `Price: $${price}`

  const newReadMore = document.createElement('a');
  newReadMore.textContent = 'read more';
  newReadMore.onclick = openReadMore;

  const newModal = document.createElement('div');
  newModal.className = 'modal';

  const newAddToCart = document.createElement('button');
  newAddToCart.id = `btn-${index}`;
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

  let container = document.querySelector('.container');
  container.append(newCard);
}

const createBooks = () => {
  for(const [index, book] of storage.entries()) {
    let { author, imageLink, title, price, description } = book;
    createBookCard(author, imageLink, title, price, description, index);
  }
  createCart();
}

const start = () => {
  createSite();
  fetch('./assets/data/books.json')
  .then(response => response.json())
  .then(data => {
    storage = data;
    createBooks();
  })
  .catch(err => console.log(err));
};

document.addEventListener('DOMContentLoaded', start)