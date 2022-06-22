const formElm = document.querySelector('form');
const nameInputElm = document.querySelector('.product-name');
const priceInputElm = document.querySelector('.product-price');
const listGroupElm = document.querySelector('.list-group');

formElm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    // Recieving Inputs
    const {nameInput, priceInput} =  receiveInputs();
    // Validate Inputs
    const error = validateInput(nameInput, priceInput);
    if(!error) {
        // add item to UI
        addItemToUi(nameInput,priceInput);
    }
});

function addItemToUi(name, price) {
    const listElm = `<li class="list-group-item collection-item">
    <strong>${name}</strong>- <span class="price">${price}</span>
    <i class="fa fa-trash float-right"></i></li>`;
    listGroupElm.insertAdjacentHTML('afterbegin', listElm);
}

function validateInput(name, price) {
    let isError = false;
    if(!name || name.length < 4) {
        isError = true;
    }
    if(!price || Number(price) <= 0) {
        isError = true;
    }
    return isError;
}

function receiveInputs() {
    const nameInput = nameInputElm.value;
    const priceInput = priceInputElm.value;
    return {
        nameInput,
        priceInput
    }
}