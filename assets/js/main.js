(function() {

const formElm = document.querySelector('form');
const nameInputElm = document.querySelector('.product-name');
const priceInputElm = document.querySelector('.product-price');
const listGroupElm = document.querySelector('.list-group');
const filterElm = document.querySelector('#filter');
const addProductElm = document.querySelector('.add-product');

// tracking item
let products = [];


function showAllItemsToUI(items) {
    listGroupElm.innerHTML = '';
    items.forEach((item) => {
        const listElm = `<li class="list-group-item item-${item.id} collection-item">
    <strong>${item.name}</strong>- <span class="price">${item.price}</span>
    <i class="fa fa-pencil-alt edit-item float-right"></i>
    <i class="fa fa-trash delete-item float-right"></i></li>`;
    listGroupElm.insertAdjacentHTML('afterbegin', listElm);
    })
}

function removeItemfromUi(id) {
    document.querySelector(`.item-${id}`).remove();
}

function updateAfterRemove(products, id) {
    return products.filter(product => product.id !== id);
}

function removeItemfromDataStore(id) {
    const productAfterDelete = updateAfterRemove(products, id);
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
    <i class="fa fa-pencil-alt edit-item float-right">
    <i class="fa fa-trash delete-item float-right"></i></li>`;
    listGroupElm.insertAdjacentHTML('afterbegin', listElm);
}

function validateInput(name, price) {
    let isError = false;
    if(!name || name.length < 4) {
        isError = true;
    }
    if(!price || isNaN(price) || Number(price) <= 0) {
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

function addItemToStorage(product) {
    let products;
    if(localStorage.getItem('storeProducts')) {
        products = JSON.parse(localStorage.getItem('storeProducts'));
        products.push(product);
        // update to localstorage
        localStorage.setItem('storeProducts', JSON.stringify(products));
    }else {
        products = [];
        products.push(product);
        // update to local storage
        localStorage.setItem('storeProducts', JSON.stringify(products));
    }
}

function removeProductFromStorage(id) {
    // pick from local storage
    const products = JSON.parse(localStorage.getItem('storeProducts'));
    // filter
    const productsAfterRemove = updateAfterRemove(products, id);
    // save data to local storage
    localStorage.setItem('storeProducts', JSON.stringify(productsAfterRemove));
}

function populateUIInEditState(product) {
    nameInputElm.value = product.name;
    priceInputElm.value = product.price;
}

function showUpdateBtn() {
    const elm = `<button type='button' class="btn mt-3 btn-block btn-secondary update-product">Update</button>`;
    // hide the submit button
    addProductElm.style.display = 'none';
    formElm.insertAdjacentHTML('beforeend', elm);
}

function init() {
    let updatedItemId;

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
        
            // generate item
            const id = products.length;
            const product = {
                id: id,
                name: nameInput,
                price: Number(priceInput)
            }

            // add item to data store
            products.push(product);

            // add item to UI
            addItemToUi(id,nameInput,priceInput);

            // add item to local storage
            addItemToStorage(product);

            // reset input
            resetInput();
        
    });

    // filter item
    filterElm.addEventListener('keyup', (evt) => {
        const filterValue = evt.target.value;
        const filteredArr = products.filter((product) => product.name.includes(filterValue));
        // show filtered item to UI
        showAllItemsToUI(filteredArr);
    });

    // deleting item (event delegation)
    listGroupElm.addEventListener('click', (evt) => {
        if(evt.target.classList.contains('delete-item')) {
            const id = getItemId(evt.target);
            // delete item from ui
            removeItemfromUi(id);
            // delete item from data store
            removeItemfromDataStore(id); 
            // delete item from storage
            removeProductFromStorage(id);
        }else if(evt.target.classList.contains('edit-item')) {
            // pick the item id
            updatedItemId = getItemId(evt.target);

            // find the item
            const foundProduct = products.find(product => product.id === updatedItemId);
           
            // populate item data to UI
            populateUIInEditState(foundProduct);

            // show updated button
            showUpdateBtn();
            
        }
    });

    formElm.addEventListener('click', (evt) => {
        if(evt.target.classList.contains('update-product')) {
            // pick the data from field
           const {name, price} = receiveInputs();
            // validate the item
            const isError = validateInput(name, price);   
            if(isError) {
                alert('Please Provide Valid Input');
                return;
            }
            // Updated data should be updated to data store
           const updatedProductsArr = products.map(product => {
                if(product.id === updatedItemId) {
                    // item should be updated
                    return {
                        id: product.id,
                        name,
                        price,
                    }
                }else {
                    // no update
                    return product;
                }
            });
            console.log(updatedProductsArr);
            // Updated data should be updated to UI
            // Updated data should be updated to local storage
        }
    });

    document.addEventListener('DOMContentLoaded', (e) => {
        // checking item into local storage
        if(localStorage.getItem('storeProducts')) {
            products = JSON.parse(localStorage.getItem('storeProducts'));
            showAllItemsToUI(products);
        }
    });

}

init();

})()