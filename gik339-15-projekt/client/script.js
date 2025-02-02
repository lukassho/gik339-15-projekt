const url = 'http://localhost:3000/groceries';

window.addEventListener('load', fetchData);

function fetchData() {
    fetch(url)
  .then(result => result.json())
  .then(groceries => {
    if (groceries.length > 0) {
    let html = `<ul class="p-0">`;
    groceries.forEach(grocery => {
      html += `<section>
                <div class="mb-3 p-4 rounded-3 col-8 offset-2 col-xl-5 offset-xl-6 shadow-sm" style="background-color: ${grocery.groceryCategory};">
                  <ul class="row justify-content-center p-0">
                    <h3 class="col-6 pt-2 fs-2">${grocery.groceryType}</h3>
                    <p class="col-6 pt-2 text-end">${grocery.brand}</p>
                    <div class="row bg-light p-2 rounded-2 col-12">
                    <p class="col-2 col-sm-2 pt-1">${grocery.amount} st</p>
                    <div class="col-3 pt-1">
                              <input class="form-check-input col-sm-6" type="checkbox" role="switch">
          <label class="form-check-label col-sm-6" for="flexSwitchCheckDefault">Inhandlat</label>
        </div>
        <p class="border rounded-2 border-secondary p-1 col-6">${grocery.note}</p>
        <div class="justify-content-center d-flex">
        <button class="btn btn-secondary col-sm-3 col-4 offset-4 mt-3 m-1" onclick="setCurrentGrocery(${grocery.id})">Ändra</button>
                    
                    <button class="btn btn-secondary mt-3 col-sm-3 col-4 m-1" onclick="deleteGrocery(${grocery.id})">Ta Bort</button>
          </ul>
          </div>
        </section>`;
    });
    html += `</ul>`;

    const listContainer = document.getElementById('listContainer');
    listContainer.innerHTML = '';
    listContainer.insertAdjacentHTML('beforeend', html);
  }
  });
}

function setCurrentGrocery(id) {
  console.log('current', id);

  fetch(`${url}/${id}`)
  .then((result) => result.json())
  .then((grocery) => {
    console.log(grocery);
    groceryForm.groceryType.value = grocery.groceryType;
    groceryForm.amount.value = grocery.amount;
    groceryForm.brand.value = grocery.brand;
    groceryForm.groceryCategory.value = grocery.groceryCategory;
    groceryForm.note.value = grocery.note;

    localStorage.setItem('currentId', grocery.id);
  });

}

function deleteGrocery(id) {
  console.log('delete', id);

  fetch(`${url}/${id}`, { method: 'DELETE' }).then((result) => fetchData());

  openModal();
}

groceryForm.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  const serverGroceryObject = {
    groceryType: '',
    amount: '',
    brand: '',
    groceryCategory: '',
    note: ''
  };
  serverGroceryObject.groceryType = groceryForm.groceryType.value;
  serverGroceryObject.amount = groceryForm.amount.value;
  serverGroceryObject.brand = groceryForm.brand.value;
  serverGroceryObject.groceryCategory = groceryForm.groceryCategory.value;
  serverGroceryObject.note = groceryForm.note.value;

  const id = localStorage.getItem('currentId');
  if (id) {
    serverGroceryObject.id = id;
  }

  openModal();

const request = new Request(url, {
  method: serverGroceryObject.id ? 'PUT' : 'POST',
  headers: {
    'content-type': 'application/json'
  },
  body: JSON.stringify(serverGroceryObject)
});

fetch(request).then((response) => {
  console.log(response);
  fetchData();

  localStorage.removeItem('currentId');
  groceryForm.reset();
})

}

function openModal(id) {
  const main = document.querySelector('main');
  let html = `<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Listan har uppdaterats!
      </div>
      </div>
    </div>
  </div>`;

  main.insertAdjacentHTML('beforeend', html);

  const modalElement = document.getElementById('exampleModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();

  setTimeout(() => {
    if (modalElement) {
      modalInstance.hide();
      modalElement.remove();
      console.log('Modalen har tagits bort.');
    }
  }, 3000);
}
