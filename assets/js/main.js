const formElm = document.querySelector('form');
const nameInputElm = document.querySelector('.product-name');
const priceInputElm = document.querySelector('.product-price');
const listGroupElm = document.querySelector('.list-group');

let products = [];

formElm.addEventListener('submit', (evt) => {
    // prevent defaults
    evt.preventDefault();
    // Recieving Inputs
    const {nameInput, priceInput} =  receiveInputs();
    // Validate Inputs
    const error = validateInput(nameInput, priceInput);
    if(error) {
        alert('Please Provide Valid Input');
        resetInput();
        return;
    }
        // add item to datasource
        // generate item
        const id = products.length;
        products.push({
            id: id,
            name: nameInput,
            price: Number(priceInput)
        });
        // add item to UI
        addItemToUi(id,nameInput,priceInput);
        // reset input
        resetInput();
    
});

// deleting item
listGroupElm.addEventListener('click', (evt) => {
    if(evt.target.classList.contains('delete-item')) {
        const id = getItemId(evt.target);
        // delete item from ui
        removeItemfromUi(id);
        removeItemfromDataStore(id);
        
    }
    
});

function removeItemfromUi(id) {
    document.querySelector(`.item-${id}`).remove();
}

function removeItemfromDataStore(id) {
    const productAfterDelete = products.filter(product => product.id !== id);
    products = productAfterDelete;
}

function getItemId(elm) {
    const liElm = elm.parentElement;
    return Number(liElm.classList[1].split('-')[1]);
}

function resetInput() {
    nameInputElm.value = '';
    priceInputElm.value = '';
}

function addItemToUi(id, name, price) {
    const listElm = `<li class="list-group-item item-${id} collection-item">
    <strong>${name}</strong>- <span class="price">${price}</span>
    <i class="fa fa-trash delete-item float-right"></i></li>`;
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