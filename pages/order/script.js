let start = () => {
  document.getElementById('button-submit').addEventListener('click', submitForm);
  document.querySelectorAll("input").forEach((e) => e.addEventListener("blur", validate));
  document.getElementById('button-submit').disabled = true;
};

let canSubmit = false;
const correctInputs = [];

let navMainPage = () => {
  return window.location.href='../../index.html';
}

const submitForm = (e) => {
  e.preventDefault();
  e.stopPropagation();

  let fragment = document.createDocumentFragment();
  const summary = document.createElement('div');
  summary.className = 'summary';
  fragment.append(summary);

  let title = document.createElement('h2');
  title.textContent = 'Summary';
  let table = document.createElement('table');
  let button = document.createElement('button');
  button.textContent = 'Go back';
  button.onclick = navMainPage;
  summary.append(title, table, button);

  const form = document.getElementById('form-order');
  const formData = new FormData(form);

  for ( const [key, value] of formData ) {
    let tr = document.createElement('tr');
    let inputName = document.createElement('th');
    let inputValue = document.createElement('td');

    inputName.textContent = key.slice(5).split('-').join(' ').replace('num', 'number');
    inputValue.textContent = value;

    table.append(tr);
    tr.append(inputName, inputValue);
  }
  form.replaceWith(fragment);
};

let getOptions = (element) => {
  let options = {
    'input-name': { msg: 'Name should be at least 4 letters long', pattern: /^[A-Za-z]{4,}$/ },
    'input-surname': { msg: 'Surname should be at least 5 letters long', pattern: /^[A-Za-z]{5,}$/ },
    'input-street': { msg: 'Street should be at least 5 letters long', pattern: /[A-Za-z0-9 ]{5,}/ },
    'input-house-num': { msg: 'Fill with at least one number', pattern: /^[1-9]+[0-9]*$/ },
    'input-flat-num': { msg: 'Fill with at least one number, only numbers and - allowed', pattern: /^[1-9]+[0-9]*[-]?[0-9]*$/ },
    'radio-payment-cash': { msg: '' },
    'radio-payment-card': { msg: '' },
    'date-delivery': { msg: 'Delivery date must be in present' },
    'checkbox-pack': { msg: 'Select max 2 options' },
    'checkbox-postcard': { msg: 'Select max 2 options' },
    'checkbox-discount': { msg: 'Select max 2 options' },
    'checkbox-pen-or-pencil': { msg: 'Select max 2 options' },
  }
  return options[element];
}

let isValid = () => {
  canSubmit = correctInputs.length === 8 ? true : false;
  document.getElementById('button-submit').disabled = !canSubmit;
};

const validate = (e) => {
  let elementId = e.target.id;
  let elementValue = e.target.value;
  let parentElement = e.target.parentElement;

  let parentError = () => [...parentElement.classList].indexOf('error') !== -1;
  let isPresent = (field) => correctInputs.indexOf(field) !== -1;

  let { msg } = getOptions(elementId);

  let setError = (message, field) => {
    if(!parentError()) {
      let errorMsg = document.createElement('p');
      errorMsg.textContent = message;
      errorMsg.className = 'error-msg';
      parentElement.append(errorMsg);
      parentElement.classList.add('error');
    }
    parentElement.classList.remove('valid');

    if(isPresent(field)) {
      correctInputs.splice(correctInputs.indexOf(field), 1);
    }
  };

  let setValid = (field) => {
    if(parentError()) {
      parentElement.lastChild.remove();
      parentElement.classList.remove('error');
    }
    
    if(!isPresent(field)) {
      correctInputs.push(field);
    }
    parentElement.classList.add('valid');
  };

  if(/input/.test(elementId)) {
    let { pattern } = getOptions(elementId);
    pattern.test(elementValue) ? setValid(elementId) : setError(msg, elementId);
  }

  if(/radio/.test(elementId)) {
    let radioList = document.getElementsByName('input-payment');
    let field = 'payments';
    parentElement = document.getElementById(field);
    [...radioList].findIndex(e => e.checked === true) !== -1 ? setValid(field) : setError(msg, field);
  }

  if(/checkbox/.test(elementId)) {
    let checkboxList = document.getElementsByName('input-gifts');
    let field = 'gifts';
    let count = 0;
    parentElement = document.getElementById(field);

    [...checkboxList].map(e => {
      if(e.checked) {
        count++;
      }
    });
    count < 3 ? setValid(field) : setError(msg, field);
  }

  if(/date/.test(elementId)) {
    let currentDate = new Date().setHours(0, 0, 0, 0);
    let deliveryDate = new Date(elementValue).setHours(0, 0, 0, 0);
    deliveryDate > currentDate ? setValid(elementId) : setError(msg, elementId);
  }
  isValid();
}

document.addEventListener('DOMContentLoaded', start)