
// const getCookie = (name) => {
//   const cookies = document.cookie.split(';');
//   for (let cookie of cookies) {
//     const [cookieName, cookieValue] = cookie.split('=');
//     if (cookieName.trim() === name) {
//       return cookieValue;
//     }
//   }
//   return null;
// };



function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleDateString(undefined, options);
}

function showDateTimePicker(element) {
  const existingDateTimePicker = element.parentElement.querySelector('input[type="datetime-local"]');
  if (existingDateTimePicker) {
    return;
  }

  const dateTimePicker = document.createElement('input');
  dateTimePicker.type = 'datetime-local';
  dateTimePicker.classList.add('form-control');
  dateTimePicker.style.width = '40%';
  dateTimePicker.addEventListener('change', function () {
    element.textContent = formatDate(this.value);
    this.remove();
  });
  element.parentElement.appendChild(dateTimePicker);
  dateTimePicker.focus();
}

function updateActivity(activityId, status) {
  const activityData = {
    activity: document.querySelector(`[data-activity-id="${activityId}"] textarea`).value,
    dateTime: document.querySelector(`[data-activity-id="${activityId}"] #showDateTime`).textContent,
    activityStatus: status
  };

  fetch(`/activitiesforLeads/${activityId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(activityData)
  })
    .then(res => res.json())
    .then(data => {
      console.log('Activity updated successfully:', data);
    })
    .catch(error => console.error('Error updating activity:', error));
}


function showLeadData(element) {
  const resumeTag = document.getElementById('resumeTag')
  let totalPriceProduct = 0
  const id = element?.getAttribute('data-lead-id');
  const productItemDataUpdate = document.querySelector('.product-item-data-update');
  fetch(`/lead-store-data/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log(data, 121212)
      // add the resume id into href tag
      if (data.storeval.resume) {
        resumeTag.style.display = 'block'
        resumeTag.href = `/uploads/${data.storeval.resume}`;
        resumeTag.download = data.storeval.resume?.replace(/\s+/g, '');
        resumeTag.target = "_blank";
      }
      else {
        resumeTag.style.display = "none"
      }


      const dateComponents = data.storeval.EndDate.split('T')[0].split('-');
      const year = dateComponents[0];
      const month = dateComponents[1];
      const day = dateComponents[2];
      const formattedDate = `${year}-${month}-${day}`;
      document.getElementById('end-date-update').value = formattedDate;
      const remindDate = data.storeval.remind_days ? data.storeval.remind_days.split("T")[0].split('-') : ""
      const remind_year = remindDate[0];
      const remind_month = remindDate[1];
      const remind_day = remindDate[2];

      document.getElementById('remind_date_remind_date_update').value = `${remind_year || "YYYY"}-${remind_month || "MM"}-${remind_day || "DD"}`;
      document.getElementById('Id').value = data.storeval.Id;
      document.getElementById('IdActivity').value = data.storeval.Id;
      document.getElementById('companyName').value = data.storeval.companyName;
      document.getElementById('Amount-update').value = Number(data.storeval.Amount)
      // .toLocaleString('en-IN',{
      //   currency :'INR',
      //   style : 'currency',
      //   minimumFractionDigits : 0
      // });
      document.getElementById('contact_input-update').value = data.storeval.ContactNumber;

      document.querySelector("#clientName").value = data?.userIdDetail?.name ?? 'username not filled';
      document.querySelector('#clientEmail').value = data?.userIdDetail?.email ?? 'email not filled';
      document.querySelector("#clientLocation").value = data?.userIdDetail?.address ?? 'address not filled';

      // document.getElementById('deal-type-update').value = data.storeval.DealType;
      document.getElementById('Source-update').value = data.storeval.Source;
      document.getElementById('responsible_person-update').value = data.storeval.responsible_person;
      // append data into product in update form
      if (data.productDetails.length > 0) {
        productItemDataUpdate.innerHTML = "";
        data.productDetails.forEach((item) => {

          totalPriceProduct += item.product_total_price;
          const spanTotal = document.querySelector('.product-price-section').lastElementChild;
          spanTotal.textContent = totalPriceProduct.toLocaleString('en-IN', {
            currency: 'INR',
            style: 'currency',
            minimumFractionDigits: 0
          });
          productItemDataUpdate.innerHTML += `
      <figure class="fir-image-figure mt-2 position-relative" data-item-id="${item.id}">
        <div class="position-absolute d-flex align-items-center gap-1" style="top:-3px;right:1px;font-size:16px">
         
          <i class="ri-close-line  cursor-pointer" onclick="removeProductsItems(this.closest('.fir-image-figure'))"></i>
        </div>
        <figcaption class="d-flex justify-content-between align-items-center p-2 w-100">
          <div>
            <small class="fig-author-figure-title d-block text-capitalize">${item.product_name}</small>
            <small class="fig-author-figure-title d-block">Qty: ${Number(item.product_quantity)}</small>
          </div>
          <small class="fig-author-figure-title">${Number(item.product_price).toLocaleString('en-IN', {
            currency: 'INR',
            style: 'currency',
            minimumFractionDigits: 0
          })}</small>
        </figcaption>
      </figure>`;
        });
      } else {
        productItemDataUpdate.innerHTML = "";
        document.querySelector('.product-price-section').lastElementChild.textContent = 0
        productItemDataUpdate.innerHTML += `
    <figure class="fir-image-figure mt-2">
      <figcaption class="d-flex justify-content-center align-items-center p-2 w-100">
        <div>
        <h6 class="m-0 text-center w-100 py-1">No product available</h6>
        <button type="button" class="btn btn-link" onclick="document.querySelector('#lead_update_product_form').showModal()"> 
        <i class="ri-edit-box-line"></i>
        Add to product</button>
        </div>
      </figcaption>
    </figure>`;
      }



      const stageSelect = document.getElementById('Stage-update');
      const options = stageSelect.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].value === data.storeval.Stage) {
          options[i].selected = true;
          break;
        }
      }
      //  handling the create activity and  render activity
      handleAcitivityRender(id)
      createActivity(id)
    })
    .catch(err => console.log(err))
}


function handleAcitivityRender(id) {

  fetch(`/activity/${id}`)
    .then(res => res.json())
    .then(activities => {
      console.log(activities)
      const activityDetailsSection = document.getElementById('activity-details-section');
      activityDetailsSection.innerHTML = '';
      activities.reverse().forEach(activity => {
        const existingActivityContainer = document.querySelector(`.activity-dets-section[data-activity-id="${activity.id}"]`);
        if (existingActivityContainer) {
          return;
        }
        const activityCard = `
        <div class="activity-dets-section rounded-2 position-relative" data-activity-id="${activity.id}">
          <input type="text" name="id" value="${activity.id}" hidden />
          <i class="ri-checkbox-circle-fill positions" style="font-size: 34px;" ></i>
          <div class="p-2 px-3">
            <div class="times_sec d-flex justify-content-between align-items-center mt-2">
              <div class="d-flex align-items-center gap-3">
                <p class="m-0">Activity ${activity.activityStatus}</p>
              </div>
              <i class="ri-account-circle-fill" style="font-size: 28px;"></i>
            </div>
            <div class="deadline_part d-flex align-items-center gap-4">
              <small>Deadline</small>
              <small id="showDateTime" onclick="showDateTimePicker(this)">${formatDate(activity.dateTime)}</small>
            </div>
            <div class="mb-3 mt-2">
              <textarea class="form-control" id="showActivity" rows="3" cols="4" style="min-height: 100px;">${activity.activity}</textarea>
            </div>
            <div class="btns_sec-2">
              ${activity.activityStatus !== 'Completed' ? `<button class="sub_btn-2 px-2 text-capitalize" onclick="updateActivity(${activity.id}, 'Completed')">Completed</button>
              <button type="reset" class="cen_btn-2 text-capitalize px-2" onclick="updateActivity(${activity.id}, 'Postpone')">Postpone</button>` : ''}
            </div>
          </div>
        </div>
      `;
        activityDetailsSection.insertAdjacentHTML('beforeend', activityCard);
      });
    })
    .catch(err => console.log(err));
}




// function updateProductsItems(e) {
//   const itemIdnum = e.dataset?.itemId;
//   const itemId = itemIdnum.toString();
//   const itemName = document.querySelector(`[data-item-id="${itemId}"]`).querySelector('.fig-author-figure-title').textContent;
//   const itemQuantity = document.querySelector(`[data-item-id="${itemId}"]`).querySelector('.fig-author-figure-title').nextElementSibling.textContent;


// }




async function removeProductsItems(element) {
  const itemId = element.dataset.itemId;
  const itemRemove = await fetch(`/lead-product-delete/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: itemId
    })
  });
  const productjson = await itemRemove.json();
  if (itemRemove.ok) {
    element.remove();

    /*  const targetDivPrice = document.querySelector('.product-item-data-update .fir-image-figure figcaption').children[1].textContent;
      const totalPrice = document.querySelector('.product-price-section small:nth-child(2)').textContent;
      
      const targetPrice = Number(targetDivPrice.replace(/[^0-9.-]+/g, ""));
      const currentTotalPrice = Number(totalPrice.replace(/[^0-9.-]+/g, ""));
      const totalPriceProduct = currentTotalPrice - targetPrice;
      
      console.warn(totalPriceProduct);
      */
  }
}











/* pagination btn script*/
const paginationBtn = document.querySelectorAll(".paginationBtn")
const first_cnt = document.querySelector(".first_cnt")
const second_cnt = document.querySelector(".second_cnt")
paginationBtn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (e.target.tagName === "H6") {
      const index = Array.from(e.target.parentElement.children).indexOf(e.target)
      first_cnt.classList.toggle("d-none", index === 1)
      second_cnt.classList.toggle("d-none", index === 0)
    }
  })
})


document.addEventListener('DOMContentLoaded', function () {
  const addButton = document.querySelector('.add-participant');
  const clientContainer = document.getElementById('client');

  // Event listener for adding participant
  addButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    const clone = clientContainer.querySelector('.client-details').cloneNode(true);
    const closeIcon = clone.querySelector('.ri-close-line');
    closeIcon.style.opacity = '1'; // Display close icon
    clientContainer.insertBefore(clone, document.getElementById('add'));
  });

  // Event listener for removing participant
  clientContainer.addEventListener('click', function (event) {
    const target = event.target;
    if (target && target.classList.contains('ri-close-line')) {
      const participantToRemove = target.closest('.client-details');
      participantToRemove.remove();
    }
  });
});


const contact_input = document.querySelector('#contact_input')

contact_input.addEventListener('input', async (e) => {
  const storevalue = e.target.value;
  if (!storevalue.trim()) { // Check if input value is empty or only contains whitespace
    const lead_contact = document.querySelector('.lead_contact')
    lead_contact.innerHTML = ` `;
    return;
  }
  await appendingData(storevalue)
})


function getcontactnum(mobile, id) {

  document.querySelector('#contact_input').value = mobile;
  document.querySelector('#contactId').value = id;

  const lead_contact = document.querySelector('.lead_contact');
  if (lead_contact) {
    lead_contact.innerHTML = '';
  }
}

async function appendingData(value) {

  try {
    const pipelineId = localStorage.getItem('pipeline_select_value')
    const res = await fetch('/filter-contact', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact: value,
        pipelineId
      })
    });
    const data = await res.json();
    const lead_contact = document.querySelector('.lead_contact')

    lead_contact.innerHTML = '';
    if (data.success) {
      if (data.contactdata.length === 0) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <button type="button" class="c-button border-0 add-contact-btn">
              <span class="c-main">
                <span class="c-ico"><span class="c-blur"></span> <span class="ico-text">+</span></span>
                Add to contact
              </span>
            </button>
          `;
        lead_contact.appendChild(card);

        // Add event listener to handle click on "Add to contact" button
        const addContactBtn = card.querySelector('.add-contact-btn');
        addContactBtn.addEventListener('click', () => {
          // Create the form
          const form = document.createElement('form');
          form.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'flex-column', 'gap-3')
          form.innerHTML = `
             
              <input type="text" name="name" class="addLead-name" placeholder="Name" onvalid="this.setCustomValidity('')"   oninvalid="this.setCustomValidity('Name is required')" required="required">
              <input type="email" class="addLead-email" name="email" placeholder="Email">
              <input type="tel" name="mobile" class="addLead-mobile" placeholder="Mobile" onvalid="this.setCustomValidity('')"   oninvalid="this.setCustomValidity('Name is required')" required="required">
              <input  type="text" name="address" class="addLead-address" placeholder="address">
              <div style="display: flex; width: 88%;gap:5px">
                   <button  class=" text-white addLead-btn btn btn-lg rounded-0 bg-primary" type="submit">Submit</button>
                      <button class=" text-white addLead-btn btn btn-lg rounded-0 bg-primary" type="submit" onclick="document.querySelector('.lead_contact').innerHTML = ''">Close</button>
              </div>
           
            `;

          // Append the form to the card
          card.innerHTML = '';
          card.appendChild(form);


          // Add event listener to handle form submission
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pipelineId = localStorage.getItem('pipeline_select_value')
            const formData = new FormData(form);
            formData.append('pipelineId', pipelineId);
            const formDataObj = Object.fromEntries(formData.entries());
            try {
              const res = await fetch('/contactData', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataObj),
              });
              const data = await res.json();
              if (data.success) {

                form.reset();
                toastr.success('Contact created successfully');
                getcontactnum(data.data.mobile, data.data.id)

              }


              // setTimeout(() => {
              //   document.querySelector('.lead_contact').innerHTML = ''
              // })

              // You can update the UI or perform any other actions based on the server response
            } catch (err) {
              console.error(err);
              // Handle any errors that occur during the fetch request
              toastr.error('Failed to create contact data');

            }
          });
        });
      } else {

        data.contactdata.forEach(ele => {

          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
        <div class="wrapper d-flex gap-3 px-3 py-2 mx-auto my-1 border rounded-2 align-items-center" style="width: 80%;" onclick='getcontactnum("${ele.mobile}", "${ele.id}")'>
                <div class="img-no">
                  <img class="rounded-circle" style="background-color: lightgray;"
                    src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt=""
                    width="40" height="40">
                </div>
                <div class="div">
                  <small class="m-0 d-block">${ele.name}</small>
                  <small class="m-0 d-block">${ele.mobile}</small>
                </div>
              </div>
            `;
          lead_contact.appendChild(card);
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}








document.getElementById('myFormUpdate').addEventListener('submit', async function (event) {
  event.preventDefault();
  const formData = new FormData(this);
  const obj = Object.fromEntries(formData);
  const leadId = obj.id;
  const resumeFile = document.getElementById('update-resume').files[0];
  formData.append('resume', resumeFile);

  try {
    const response = await fetch(`/leads/${leadId}`, {
      method: 'PUT',
      body: formData
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(errorMessage.error || 'Failed to update lead data');
    }

    const updatedLead = await response.json();
    toastr.success('Lead updated successfully');
    setTimeout(() => {
      location.reload();
    }, "1000");
  } catch (error) {
    console.error('Error while updating lead data:', error.message);
    toastr.success('Error while updating lead');
    // Handle error, e.g., display an error message to the user
  }
});




function createActivity(id) {
  document.getElementById('myFormActivity').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const obj = Object.fromEntries(formData);
    const lead = obj['activity']
    if (lead === "") {
      alert('fill the field')
      return
    }

    try {
      const response = await fetch('/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      });

      if (response.ok) {
        const data = await response.json();
        this.reset()
        toastr.success('Activity created successfully');
        handleAcitivityRender(id)

      } else {
        console.error('Failed to create activity');
        toastr.error('Failed to create activity');
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      toastr.error('Error creating activity');
    }
  });

}


document.getElementById('submit_btn').addEventListener('click', function () {
  document.querySelector('.right-form').classList.remove('blur');
});


async function fetchLeadsData() {

  try {
    const response = await fetch('/leadsDataForListView');
    if (!response.ok) {
      throw new Error('Failed to fetch leads data');
    }
    const leads = await response.json();

    return leads;
  } catch (error) {
    console.error('Error fetching leads data:', error);
    return [];
  }
}

async function displayLeadsData() {
  const leads = await fetchLeadsData();
  const tbody = document.getElementById('leads-table-body');

  leads.forEach(lead => {
    const row = document.createElement('tr');
    row.innerHTML = `
                    <td  class="text-center">${lead.companyName}</td>
                    <td class="text-center">${lead.ContactNumber}</td>
                    <td class="text-center">${lead.Stage}</td>
                    <td class="text-center">${lead.Amount}</td>
                    <td class="text-center">${lead.responsible_person}</td>
                    <td class="text-center">${lead.target_status}</td>
                `;
    tbody.appendChild(row);
  });

  // Initialize DataTable
  $('#myTable1').DataTable({
    language: {
      aria: {
        paginate: {
          first: 'First',
          last: 'Last',
          next: 'Next',
          previous: 'Previous'
        }
      },
      search: 'Search:',
      lengthMenu: 'Show _MENU_ Entries',
      info: 'Showing _START_ to _END_ of _TOTAL_ entries',
      infoEmpty: 'Showing 0 to 0 of 0 entries',
      infoFiltered: '(filtered from _MAX_ total entries)',
      infoPostFix: '',
      loadingRecords: 'Loading...',
      zeroRecords: 'No matching records found',
      emptyTable: 'No data available in table',
      thousands: ',',
      decimal: '.',
      aria: {
        sortAscending: ': activate to sort column ascending',
        sortDescending: ': activate to sort column descending'
      },
      select: {
        rows: {
          _: '%d rows selected',
          0: 'Click to select',
          1: '1 row selected'
        }
      }
    }
  });
}

window.onload = displayLeadsData;


const responsible_person_update = document.querySelector('#responsible_person-update');
const responsible_person_container = document.querySelector('.responsible_person_container');

responsible_person_update.addEventListener('input', async (e) => {
  const storevalue = e.target.value.trim(); // Trim whitespace
  if (!storevalue) {
    responsible_person_container.innerHTML = ''; // Clear container
    return;
  }
  await appendingDataForResponsiblePerson(storevalue);
});

async function appendingDataForResponsiblePerson(value) {
  try {
    const pipelineId = localStorage.getItem('pipeline_select_value');
    const res = await fetch('/filter-responsible-person', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact: value,
        pipeline_id: pipelineId
      })
    });
    const data = await res.json();

    responsible_person_container.innerHTML = '';

    if (data.success) {
      const uniqueUsers = data.uniqueUsers;
      if (Object.keys(uniqueUsers).length === 0) {
        // No data found message
        responsible_person_container.innerHTML = `
            <div class="card">
              <button type="button" class="c-button border-0 add-contact-btn">
                <span class="c-main">
                  <span class="c-ico"><span class="c-blur"></span> <span class="ico-text">+</span></span>
                  Add to contact
                </span>
              </button>
            </div>
          `;
      } else {
        // Append data to container
        const cardsHTML = Object.entries(uniqueUsers).map(([responsiblePerson, loginEmail]) => `
            <div class="card">
              <div class="wrapper d-flex gap-3 px-3 py-2 mx-auto my-1 border rounded-2 align-items-center" style="width: 80%" onclick='getResponsiblePerson("${responsiblePerson}", "${loginEmail}")'>
                <div class="img-no">
                  <img class="rounded-circle" style="background-color: lightgray;" src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" width="40" height="40">
                </div>
                <div class="div">
                  <small class="m-0 d-block">${responsiblePerson}</small>
                  <small class="m-0 d-block">${loginEmail}</small>
                </div>
              </div>
            </div>
          `).join('');
        responsible_person_container.innerHTML = cardsHTML;
      }
    }
  } catch (err) {
    console.error(err);
    // Handle error: Provide user feedback if needed
  }
}


function getResponsiblePerson(username, email) {
  document.querySelector('#responsible_person-update').value = username;
  const responsible_person_container = document.querySelector('.responsible_person_container');
  if (responsible_person_container) {
    responsible_person_container.innerHTML = '';
  }

  const loginEmailElement = document.querySelector('#loginEmail');
  if (loginEmailElement) {
    loginEmailElement.value = email;
  }
}









window.onload = function () {
  var now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.querySelectorAll("#datetime-local")[0].value = now.toISOString().slice(0, 16);
  document.querySelectorAll("#datetime-local")[1].value = now.toISOString().slice(0, 16);

}












// remove the underscore from the

const info = document.querySelectorAll('.info');
info.forEach(element => {
  element.innerHTML = element.innerHTML.replace("_", " ");
})

function allowDrop(ev) {

  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  ev.dataTransfer.setData("containerId", ev.target.parentElement.id);
}

async function drop(ev) {
  ev.preventDefault();

  var data = ev.dataTransfer.getData("text");
  var draggedElement = document.getElementById(data);
  var target = ev.target.closest('.board-item');
  var container = ev.target.closest('.board-column-content');

  if (target) {
    var rect = target.getBoundingClientRect();
    var mouseY = ev.clientY;
    var isBelow = mouseY > rect.top + rect.height / 2;

    if (isBelow) {
      container.insertBefore(draggedElement, target.nextElementSibling);
    } else {
      container.insertBefore(draggedElement, target);
    }
  } else {
    container.appendChild(draggedElement);
  }

  var leadId = draggedElement.getAttribute('data-lead-id');
  var field_name = ev.target.closest('.board-column').querySelector('.board-column-header').getAttribute('data-target-status');

  var xhr = new XMLHttpRequest();
  xhr.open('PUT', `/updateLeadStatus/${leadId}`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {

      } else {
        console.error('Error updating lead status:', xhr.statusText);
      }
    }
  };

  xhr.send(JSON.stringify({ fieldName: field_name }));
}




function findContainerId(element) {
  // Traverse up the DOM tree until finding an element with an ID
  while (element && !element.id) {
    element = element.parentNode;
  }
  return element ? element.id : null;
}

async function fetchContainers() {
  const pipeline_select = document.querySelector('.pipeline_select')
  const fetchData = async (pipeline_select_value) => {

    try {
      const res = await fetch(`/pipeline-select-data/${pipeline_select_value}`);
      const data = await res.json();

      renderContainers(data.pipelineSelectData);
      // Store selected value in a cookie
      // document.cookie = `pipeline_select_value=${pipeline_select_value}; expires=${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
    } catch (error) {
      console.error('Error fetching pipeline data:', error);
    }
  };



  // Trigger fetch on window load
  window.addEventListener('load', async () => {
    const selectedValueFromCookie = localStorage.getItem('pipeline_select_value');
    let selectedValue;

    if (selectedValueFromCookie) {
      selectedValue = selectedValueFromCookie;
    } else {
      // If cookie value is not present, get value from .product-select class
      const productSelectElement = document.querySelector('.pipeline_select');
      if (productSelectElement) {
        selectedValue = productSelectElement.value;
      }
    }

    if (selectedValue) {
      await fetchData(selectedValue);
    }
  });

  // Trigger fetch on pipeline_select value change
  pipeline_select.addEventListener('change', async (e) => {
    const selectedValueFromCookie = localStorage.getItem('pipeline_select_value');
    if (selectedValueFromCookie) {
      fetchData(selectedValueFromCookie);
      window.location.reload()
    }
  });
}


fetchContainers();


async function removeField(containerId) {
  const confirmDelete = window.confirm("Are you sure you want to delete this container?");
  if (!confirmDelete) {
    return; // If user cancels, exit the function
  }

  try {
    const response = await fetch(`/pipeline-custom-fields/${containerId}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      toastr.success('Fields deleted successfully');
      setTimeout(() => {
        location.reload();
      }, 1000)
    } else {
      toastr.error('Failed to delete container');
    }
  } catch (error) {
    console.error('Error deleting container:', error);
  }
}

// Function to handle confirmation
const confirmField = async () => {
  const pipeline_id = localStorage.getItem('pipeline_select_value')
  const newfield_name = document.getElementById('fieldInput').value.trim();
  if (newfield_name !== '') {
    try {
      const response = await fetch('/pipeline-custom-fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: newfield_name, select_data_Id: pipeline_id })
      });
      const data = await response.json();
      if (response.ok) {
        toastr.success('Fields created  successfully');
        setTimeout(() => {
          location.reload();
        }, 1000)
      }
      else {
        toastr.error('Failed to create field');
      }

    } catch (error) {
      console.error('Error adding field:', error);
    }
  }
  // Remove dialog box after confirmation
  document.body.removeChild(dialogContainer);
};

// Event listener for confirm button
document.getElementById('confirmButton').addEventListener('click', confirmField);


let allActivityContainer;
async function renderContainers(containers) {
  const container = document.querySelector('.slide-container');
  const pipelineId = localStorage.getItem('pipeline_select_value')
  container.innerHTML = '';
  containers && containers.forEach(containerData => {
    const newColumn = document.createElement('div');
    newColumn.classList.add('board-column', 'todo');
    newColumn.id = containerData.id;
    newColumn.dataset.id = containerData.id;
    newColumn.setAttribute('ondrop', 'drop(event)');
    newColumn.setAttribute('ondragover', 'allowDrop(event)');
    newColumn.innerHTML = `
       <div class="board-column-container">
    <div class="d-flex align-items-center position-relative" style="background:#8080803d;border-radius: 10px 10px 0px 0px;">
        <div class="board-column-header" data-target-status="${containerData.field_name}" data-container-id="${containerData.id}" style="background:none">
            ${containerData.field_name}
        </div>
        ${localStorage.getItem('user_group') === 'admin' ? `
        <div class="icon-container" style="position: absolute; right: 0; display: flex; gap: 5px;padding: 0 17px;">
            <i class="ri-add-circle-line h5 addFieldBtn m-0" data-toggle="modal" data-target="#exampleModal" style="cursor: pointer;"></i>
            <i class="ri-delete-bin-6-line" style="cursor: pointer; "onclick="removeField('${containerData.id}')"></i>
            <i class="ri-pencil-line" style="cursor: pointer;"></i>
        </div>
        ` : `
        <div class="icon-container d-none" style="position: absolute; right: 0; display: flex; gap: 5px;">
            <i class="ri-add-circle-line h5 addFieldBtn m-0" style="cursor: pointer;"></i>
            <i class="ri-delete-bin-6-line" style="cursor: pointer;"></i>
            <i class="ri-pencil-line" style="cursor: pointer;"></i>
        </div>
        `}
    </div>
    <div class="board-column-content-wrapper">
        <div class="board-column-content">
            <div class="board-item" data-lead-id=""></div>
        </div>
    </div>
</div>

        `;
    container.appendChild(newColumn);

    // Counter for the number of cards in this container
    let cardCount = 0;









    newColumn.querySelector('.ri-pencil-line').addEventListener('click', function () {
      const header = this.closest('.d-flex').querySelector('.board-column-header');
      const containerId = header.getAttribute('data-container-id');
      let oldValue = header.textContent.trim();
      const regex = /\(\d+\)$/;
      oldValue = oldValue.replace(regex, '').trim();

      const inputField = document.createElement('input');
      inputField.classList.add('form-control');
      inputField.value = oldValue;
      inputField.addEventListener('blur', async function () {
        const newValue = this.value.trim();
        if (newValue !== oldValue) {
          try {
            const response = await fetch(`/customfields/${containerId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ field_name: newValue })
            });
            if (response.ok) {
              header.textContent = newValue;
              toastr.success('Field name updated successfully');
            } else {
              toastr.error('Failed to update field name');
            }
          } catch (error) {
            console.error('Error updating field name:', error);
          }
        }
        else {
          header.textContent = oldValue;
        }
      });

      header.innerHTML = '';
      header.appendChild(inputField);
      inputField.focus();
    });



    // Event listener for the "Add Field" button
    newColumn.querySelector('.addFieldBtn').addEventListener('click', function () {
      const field_name = this.dataset.field_name;
      const previousField = this.closest('.board-column').querySelector('.board-column-header').dataset.targetStatus; // Get the previous field name
      // addField(field_name, previousField);
    });

    // console.log(decodeURIComponent(containerData.field_name),1212)
    // Fetch data for the current containerData.field_name from the server

    document.getElementById('loaderNew').style.display = 'block'

    fetch(`/fetchDataForContainer/${encodeURIComponent(containerData.field_name)}/${pipelineId}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('loaderNew').style.display = 'none'

        if (data && Array.isArray(data)) {
          const boardItem = newColumn.querySelector('.board-item'); // Select the board-item div
          data.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('cookie-card');
            card.style.backgroundColor = item.isReminderDue ? '#ffcccc' : '#fff';
            card.draggable = true;
            card.setAttribute('ondragstart', 'drag(event)');
            card.id = `card_${item.Id}`;
            card.dataset.leadId = item.Id;

            card.innerHTML = `
                        <div class="activity_sec  bg-white mt-1 border">
                        <div class="coolinput">
                    
                        <input type="text" value='${item.Id}' hidden name='lead_id'>
                        <input type="text" placeholder="Write here..." name="activity" class=" activity input" style="width: 100%;">
                        </div>
                        <div class="btns_sec">
                          <button class="sub_btn ">  
                              Submit         
                          </button>
                           <button type="reset" class="cen_btn" onclick="hideActivity(this.closest('.activity_sec'))" >
                              Cancel                                  
                          </button>
                        </div>
                      </div>    

                      <div class="activity_data" >
                     
                      
                    </div>
                        `

            // Fetch activities for this lead ID and update the card
            fetch(`/activity/${item.Id}`)
              .then(response => response.json())
              .then(activities => {
                if (activities && activities.length > 0) {
                  activities.forEach(activity => {
                    const activityData = document.createElement('div');
                    activityData.classList.add('activity-data');
                    activityData.style.padding = '6px';
                    activityData.innerHTML = `
                    <input type="text" value='${item.Id}' hidden class='fetchDataByLeadId' data-lead-id='${item.Id}'>
                    <small class="created-at">${new Date(activity.dateTime).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}</small>
                    <div class="acti-name">
                        <small class="activity">${activity.activity}</small>
                    </div>
                    <div class='line'></div>
                `;
                    card.querySelector('.activity_data').appendChild(activityData);


                  });


                } else {
                  const noActivityMessage = document.createElement('div');
                  noActivityMessage.classList.add('p-4');
                  noActivityMessage.textContent = 'No activity for this lead';
                  card.querySelector('.activity_data').appendChild(noActivityMessage);
                }
              })
              .catch(error => console.error(`Error fetching activities for lead ID ${item.Id}:`, error));


            allActivityContainer = document.querySelectorAll('.activity_data')


            // Create card content

            const title = document.createElement('span');
            const newspan = document.createElement('span');
            const deleteSpan = document.createElement('span');
            const newdiv = document.createElement('div')

            title.classList.add('d-block', 'title', 'company_heading', 'text-capitalize');
            title.textContent = item.companyName.length > 22 ? item.companyName.substring(0, 18) + "..." : item.companyName;
            title.setAttribute('onclick', 'showLeadData(this.closest(".cookie-card"))');
            newspan.innerHTML = `<i class="ri-information-2-fill float-end cursor-pointer"  style="font-size:18px"></i>`;
            deleteSpan.setAttribute('data-delete-id', item.Id);
            deleteSpan.innerHTML = `<i class="ri-close-circle-fill float-end cursor-pointer" style="font-size:18px"></i>`;
            // Event listener for delete span
            deleteSpan.addEventListener('click', async function () {
              // Show confirmation dialog
              const confirmDelete = confirm('Are you sure you want to delete this lead data?');

              // If user confirms deletion

              if (confirmDelete) {
                const leadIdToDelete = this.getAttribute('data-delete-id');
                try {
                  const response = await fetch(`/leads/${leadIdToDelete}`, {
                    method: 'DELETE'
                  });
                  if (response.ok) {

                    location.reload(); // Reload the page after successful deletion
                  } else {
                    console.error('Failed to delete lead data');
                  }
                } catch (error) {
                  console.error('Error deleting lead data:', error);
                }
              } else {
                // Do nothing if user cancels deletion
                console.log('Deletion canceled by user');
              }
            });


            newspan.onclick = function () {
              openActivityData(card)
            }
            title.appendChild(newspan);
            title.appendChild(deleteSpan);


            // const companyName = document.createElement('small');
            // companyName.textContent = item.companyName;

            const leadStatus = document.createElement('small');
            leadStatus.className = "card_lead_price"
            leadStatus.textContent = Number(item.Amount).toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 1,

            });

            const actions = document.createElement('div');

            actions.classList.add('actions');

            const activityButton = document.createElement('button');

            activityButton.classList.add('pref');
            activityButton.textContent = 'Activity';
            activityButton.onclick = function () {
              openActivity(card);
            };

            const icons = document.createElement('div');
            icons.innerHTML = `
                            <button class="accept">
                            <a style="text-decoration: noen; color:white" href="mailto:">
                            <i class="ri-mail-line"></i>
                        </a>
                                </button>
                            <button class="accept">
                            <a style="text-decoration: noen; color:white"  href="tel:${item.ContactNumber}">
                            <i class="ri-phone-line"></i>
                        </a>
                                </button>
                            <button class="accept call_icon">
                            <a style="text-decoration: none; color:white" href="https://wa.me/${item.ContactNumber}" >
                            <i class="ri-chat-3-fill"></i>
                        </a>                            </button>
                        `;


            actions.appendChild(activityButton);
            actions.appendChild(icons);


            card.appendChild(title);

            card.appendChild(leadStatus);
            card.appendChild(actions);



            boardItem.appendChild(card); // Append card to the board-item


            const createdAt = document.createElement('small');
            const createdAtDate = new Date(item.createdAt);
            const now = new Date();

            const diffMs = now - createdAtDate;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
              createdAt.textContent = "Today";
            }
            else if (diffDays === 1) {
              createdAt.textContent = "Yesterday";
            }
            else {
              createdAt.textContent = createdAtDate.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                // hour: '2-digit',
                // minute: '2-digit',
                // second: '2-digit'
              });
            }


            createdAt.style.fontSize = '70%'
            // createdAt.appendChild()
            card.appendChild(createdAt);

            // const responsible_name =  document.createElement('small')
            // responsible_name.textContent = `${item.responsible_person}`
            // responsible_name.className ='responsible_person float-end text-capitalize'
            // responsible_name.style.marginTop ='6px'
            // card.appendChild(responsible_name)



            // Increment the card count for this container
            cardCount++;
          });
          // Update the column header with the card count
          newColumn.querySelector('.board-column-header').textContent = `${containerData.field_name}(${cardCount})`;

          // Set data-lead-id attribute of board-item to the first card's lead ID
          if (data.length > 0) {
            boardItem.dataset.leadId = data[0].Id;
          }

          // Add contact card
          const contactCard = document.createElement('div');
          contactCard.classList.add('contact-cards');
          contactCard.innerHTML = `
                        <div class="d-flex justify-content-center align-items-center gap-2 h-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                            </svg>
                            <small>${containerData.number}</small>
                        </div>
                    `;
          newColumn.querySelector('.board-column-content').appendChild(contactCard);

        } else {
          console.error(`Data for ${containerData.field_name} is not valid.`);
        }
      })






      .catch(error => console.error(`Error fetching data for ${containerData.field_name}:`, error));



  });





}





let currentlyOpenActivity = null;
function openActivity(value) {
  const activity_data = value.querySelector(".activity_sec");

  if (currentlyOpenActivity && currentlyOpenActivity !== activity_data) {
    currentlyOpenActivity.classList.remove("d-block");
  }

  activity_data.classList.toggle("d-block");
  currentlyOpenActivity = activity_data;

}


let currentlyOpenActivityData = null;

function openActivityData(value) {
  const activity_data = value.querySelector('.activity_data');

  if (currentlyOpenActivityData && currentlyOpenActivityData !== activity_data) {
    currentlyOpenActivityData.classList.remove("d-block");
  }

  activity_data.classList.toggle("d-block");
  currentlyOpenActivityData = activity_data;
}


function hideActivity(container) {
  container.classList.toggle("d-block")
}


// Add event listener to submit button
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('sub_btn')) {
    const cardElement = event.target.closest('.cookie-card');
    const leadId = cardElement.dataset.leadId;
    const activityInput = cardElement.querySelector('.activity');
    const activity = activityInput.value.trim();

    // Get current date and time
    const currentDateTime = new Date().toISOString();

    // Send AJAX request to server
    fetch('/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lead_id: leadId,
        activity: activity,
        dateTime: currentDateTime
      })
    })
      .then(response => response.json())
      .then(data => {
        // Handle response as needed

        // Show alert
        alert('Data posted successfully!');
        // Clear activity field
        activityInput.value = '';
      })
      .catch(error => {
        console.error('Error sending data to server:', error);
        // Handle error
      });
  }
});





const fetchingCreateLeadField = async (value) => {

  try {
    const res = await fetch(`/pipeline-select-data/${value}`);
    const data = await res.json();

    if (data.success) {
      appendDataInDropdown(data);
      appendDataInDropdownUpdate(data);
    }
  } catch (error) {
    console.error('Error fetching pipeline data:', error.message);
  }
}

async function fetchCustomfield_name() {
  const pipeline_select = document.querySelector('.pipeline_select');

  if (!pipeline_select) {
    console.error('Pipeline select element not found');
    return;
  }

  pipeline_select.addEventListener('change', async (e) => {
    const value = e.target.value;
    localStorage.setItem('pipeline_select_value', value); // Save the value in local storage

    await fetchingCreateLeadField(value);
    await fetchContainers()
  });

  let pipelineSelectValue = localStorage.getItem('pipeline_select_value');

  // If no value in local storage, get the value from the select tag
  if (!pipelineSelectValue) {
    pipelineSelectValue = pipeline_select.value;
  }

  // If still no value, default to 1
  if (!pipelineSelectValue || pipelineSelectValue.trim() === '') {
    console.error('Selected value from "pipeline_select" element is blank or invalid.');
    pipelineSelectValue = 1;
  }

  // Save the value to local storage
  localStorage.setItem('pipeline_select_value', pipelineSelectValue);
  append_Schedule_Followup_Lead(localStorage.getItem('pipeline_select_value'))
  // Fetch data based on the selected value
  await fetchingCreateLeadField(pipelineSelectValue);
}

window.addEventListener('DOMContentLoaded', fetchCustomfield_name);

function append_Schedule_Followup_Lead(localvalue) {
  fetch('/get-reminder-lead', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pipelineId: localvalue
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const scheduleLeads = document.querySelector('.schedule-leads');
        const red_dot = document.querySelector('.red-dot');
        scheduleLeads.innerHTML = '';
        if (data.leads.length > 0) {
          red_dot.classList.remove('d-none');
          data.leads.forEach(lead => {
            console.log(lead)
            scheduleLeads.innerHTML += `
        <li style="margin:5px" data-lead-id='${lead.Id}' onclick="showLeadData(this)">
          <figure class="fir-image-figure p-2" style="cursor:pointer" onclick='handle_update_lead_form()'>
            <img class="fir-author-image fir-clickcircle"
              src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg" alt="User Profile Image">
            <div class="fir-imageover-color"></div>
            <figcaption>
              <div class="fig-author-figure-title" style="font-weight: 700;">${(lead.companyName).toUpperCase()}</div>
              <div class="fig-author-figure-title">${lead.ContactNumber}</div>
              <div class="fig-author-figure-title">Res :${lead.responsible_person}</div>
            </figcaption>
          </figure>
        </li>
      `;
          })
        } else {
          red_dot.classList.add('d-none');
          scheduleLeads.innerHTML = `
      <div style="padding:10px">
      <li style="text-align:center">No Leads Scheduled for Followup 📅</li>
      </div>
      `;
        }



      }

    })
    .catch(error => console.error('Error fetching reminder leads:', error));
}





function appendDataInDropdown(data) {

  const Stage = document.getElementById('Stage');
  Stage.innerHTML = '';
  data.pipelineSelectData.forEach(item => {
    const option = document.createElement('option');
    option.value = item?.field_name;
    option.textContent = item?.field_name;
    Stage.appendChild(option);
  });
}

function appendDataInDropdownUpdate(data) {
  const Stage = document.getElementById('Stage-update');
  Stage.innerHTML = '';
  data.pipelineSelectData.forEach(item => {
    const option = document.createElement('option');
    option.value = item?.field_name;
    option.textContent = item?.field_name;
    Stage.appendChild(option);
  });
}



// add product in new lead form

let storeproductname = [];
function productAppending() {
  const productdataholder = document.querySelector('.product-data-holder');
  const addproductsbutton = document.querySelector('.add-products-button');
  const saveBtn = document.querySelector('.button-4');
  let previousVal = ''
  let pricetotal = []


  addproductsbutton.addEventListener('click', () => {

    if (productdataholder.children.length > 0) {
      const lastInput = productdataholder.lastElementChild.querySelector('[name="product_name"]');
      if (!lastInput || lastInput.value.trim() === "") {
        alert('Please fill in the previous field before adding a new one.');
        return;
      }
    }
    const newProduct = `
        <div class="product-dialog-data d-flex justify-content-between position-relative align-items-center   gap-2 mt-3" data-incre="${storeproductname.length + 1}">
            <input type="text" onInput="handleInputVal(this)" list="product-item-name" name="product_name" class="border" autocomplete="off" style="width: 60%;" placeholder="Find or create new product">
            <input type="number" name="product_quantity" class="border" style="width: 12%">
            <input type="number" name="product_price" class="border" style="width: 12%">
            <datalist id="product-item-name">
                
            </datalist>
            <i class="d-none fs-4 ri-add-circle-line produt-data-add-icon position-absolute " onclick="addProduct(this.closest('.product-dialog-data'))" style="top:4px;left:57%"></i>

        </div>

        `;


    if (previousVal === '' && previousVal.length === 0) {
      productdataholder.innerHTML = newProduct;
      previousVal = newProduct;
    }
    else {
      productdataholder.insertAdjacentHTML('beforeend', newProduct);
    }

    const inputs = document.querySelectorAll('.product-dialog-data input');
    inputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const parent = e.target.parentElement;
        const name = parent.querySelector('[name="product_name"]').value;
        const quantity = parent.querySelector('[name="product_quantity"]').value;
        const price = parent.querySelector('[name="product_price"]').value;
        Number(price).toLocaleString("en-US", { style: "currency", currency: "USD" });
        const incre = parent.getAttribute('data-incre');
        storeproductname[incre - 1] = { name, quantity, price };
        pricetotal[incre - 1] = Number(price)
        if (pricetotal.length > 0) {
          const totalsum = pricetotal.reduce((acc, cur) => {
            return acc + cur
          }, 0)
          const values = document.querySelector('.total-amount-container').lastElementChild;
          values.textContent = totalsum.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
          });
        }

      });


    });
  });

  saveBtn.addEventListener('click', () => {

    if (storeproductname.length > 0) {
      const productitemdata = document.querySelector('.product-item-data')
      productitemdata.innerHTML = ''
      storeproductname.forEach((item, index) => {
        productitemdata.innerHTML += `
                <figure class="fir-image-figure mt-2">
                          <figcaption class="d-flex justify-content-between align-items-center p-2 w-100">
                            <div>
                              <small class="fig-author-figure-title d-block text-capitalize">${item.name}</small>
                              <small class="fig-author-figure-title d-block">Qty: ${Number(item.quantity)}</small>
                            </div>
                            <small class="fig-author-figure-title">${Number(item.price).toLocaleString('en-IN', {
          currency: 'INR',
          style: 'currency',
          minimumFractionDigits: 0

        })}</small>
                          </figcaption>
                        </figure>       
                
                `
      })

    }
    const product_dialog = document.querySelector('.product-dialog ')
    product_dialog.close()
  });
}

productAppending();






let updatestoreproductname = [];
function updateproductAppending() {
  const productdataholder = document.querySelector('.update-product-data-holder');
  const updateaddproductsbutton = document.querySelector('.add-product-products-button');
  const saveBtn = document.querySelector('.update-product-btn');
  let previousVal = '';
  let pricetotal = [];

  updateaddproductsbutton.addEventListener('click', () => {
    if (productdataholder.children.length > 0) {
      const lastInput = productdataholder.lastElementChild.querySelector('[name="update_product_name"]');
      if (!lastInput || lastInput.value.trim() === "") {
        alert('Please fill in the previous field before adding a new one.');
        return;
      }
    }
    const newProduct = `
      <div class="update-product-dialog-data d-flex justify-content-between position-relative align-items-center gap-2 mt-3" update-data-incre="${updatestoreproductname.length + 1}">
        <input type="text" list="product-item-name" name="update_product_name" class="border" autocomplete="off" style="width: 60%;" placeholder="Find or create new product">
        <input type="number" name="update-product_quantity" class="border" style="width: 12%">
        <input type="number" name="update-product_price" class="border" style="width: 12%">
        <datalist id="product-item-name"></datalist>
        <i class="d-none fs-4 ri-add-circle-line produt-data-add-icon position-absolute" onclick="addProduct(this.closest('.update-product-dialog-data'))" style="top:4px;left:57%"></i>
      </div>
    `;

    if (previousVal === '' && previousVal.length === 0) {
      productdataholder.innerHTML = newProduct;
      previousVal = newProduct;
    } else {
      productdataholder.insertAdjacentHTML('beforeend', newProduct);
    }

    addInputListeners();
  });

  function addInputListeners() {
    const inputs = productdataholder.querySelectorAll('.update-product-dialog-data input');
    inputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const parent = e.target.closest('.update-product-dialog-data');
        const name = parent.querySelector('[name="update_product_name"]').value;
        const quantity = parent.querySelector('[name="update-product_quantity"]').value;
        const price = parent.querySelector('[name="update-product_price"]').value;
        const incre = parent.getAttribute('update-data-incre');
        
        updatestoreproductname[incre - 1] = { name, quantity, price: Number(price) };
        pricetotal[incre - 1] = Number(price);
        
        if (pricetotal.length > 0) {
          const totalsum = pricetotal.reduce((acc, cur) => acc + cur, 0);
          const values = document.querySelector('.update-total-amount-container').lastElementChild;
          values.textContent = totalsum.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
          });
        }
      });
    });
  }

  saveBtn.addEventListener('click', () => {
    console.log(updatestoreproductname);

    if (updatestoreproductname.length > 0) {
      const productitemdata = document.querySelector('.product-item-data-update');
      productitemdata.innerHTML = '';
      updatestoreproductname.forEach(item => {
        productitemdata.innerHTML += `
          <figure class="fir-image-figure mt-2">
            <figcaption class="d-flex justify-content-between align-items-center p-2 w-100">
              <div>
                <small class="fig-author-figure-title d-block text-capitalize">${item.name}</small>
                <small class="fig-author-figure-title d-block">Qty: ${Number(item.quantity)}</small>
              </div>
              <small class="fig-author-figure-title">${Number(item.price).toLocaleString('en-IN', {
                currency: 'INR',
                style: 'currency',
                minimumFractionDigits: 0
              })}</small>
            </figcaption>
          </figure>
        `;
      });
    }
    
    const product_dialog = document.querySelector('#lead_update_product_form');
    product_dialog.close();
  });
}

updateproductAppending();






const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  // Get pipeline Id from cookie
  const pipeline_Id = localStorage.getItem('pipeline_select_value');

  // Create FormData object
  const formData = new FormData(this);

  // Append pipeline_Id to formData
  formData.append('pipeline_Id', pipeline_Id);

  // Append storeproductname array (assuming it's defined somewhere in your code)
  formData.append('storeproductname', JSON.stringify(storeproductname));

  // Append file data
  const resumeFile = document.getElementById('resume').files[0];
  formData.append('resume', resumeFile);

  try {
    const response = await fetch('/leadsDataPost', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (data.success) {
        myForm.reset();
        toastr.success('Lead added successfully');
        setTimeout(() => {
          location.reload();
        }, 500);
      } else {
        throw new Error('Failed to add lead data');
      }
    } else {
      const text = await response.text();
      throw new Error(`Unexpected response type: ${text}`);
    }
  } catch (error) {
    console.error('Error:', error);
    toastr.error('Failed to add lead data');
  }

});







async function addProduct(e) {
  const pipelineId = localStorage.getItem('pipeline_select_value')
  const firstInput = e.closest('.product-dialog-data').querySelector('[name="product_name"]').value;
  if (firstInput.length > 0) {
    try {
      const postProduct = await fetch('/product-add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: firstInput,
          pipelineId

        })
      })
      const productstorevalue = await postProduct.json();
      if (productstorevalue.success) {
        Toastify({
          text: productstorevalue.message,
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,

        }).showToast();

      }

    } catch (error) {
      Toastify({
        text: productstorevalue.message,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,

      }).showToast();
    }
  }
}

async function handleInputVal(e) {
  const pipelineId = localStorage.getItem('pipeline_select_value')
  const datalist = document.querySelector('#product-item-name');
  const addproducticon = e.closest('.product-dialog-data').querySelector('.produt-data-add-icon')
  const value = e.value;
  try {
    const res = await fetch(`/product-get/${value}/${pipelineId}`);
    const data = await res.json();
    if (data.success) {
      if (value.trim() === "" || data.data.length <= 0) {
        addproducticon.classList.remove('d-none');
        datalist.innerHTML = '';
      } else {
        addproducticon.classList.add('d-none');
        datalist.innerHTML = '';
        data.data.forEach((item) => {
          datalist.innerHTML += `<option value="${item.productName}">${item.productName}</option>`;
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}




// data picker 
function openDatePickerCreateLead(input) {
  if (input.type === 'date') {
    flatpickr(input, {
      dateFormat: "Y-m-d",
      onClose: function (selectedDates, dateStr, instance) {
        instance.close();
      }
    }).open();
  }
}

/*side container 2 */
const sideopenbtn = document.querySelector('.cssbuttons-io-button');

let flags = false;

const handle_update_lead_form = () => {
  const details_container = document.querySelector('.details_container');
  if (flags) {
    details_container.style.transform = 'translateX(75%)';
    flags = false;
  } else {
    details_container.style.transform = 'translateX(0%)';
    flags = true;
  }
}

const handle_new_lead_form = () => {
  const details_container = document.querySelector('.details_container-2');
  if (flags) {
    details_container.style.transform = 'translateX(75%)';
    flags = false;
  } else {
    details_container.style.transform = 'translateX(0%)';
    flags = true;
  }
}

sideopenbtn.addEventListener('click', handle_new_lead_form)


document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.matches('.cookie-card span')) {
    const details_container = document.querySelector('.details_container');
    if (flags) {
      details_container.style.transform = 'translateX(75%)';
      flags = false;
    } else {
      details_container.style.transform = 'translateX(0%)';
      flags = true;
    }
  }
});

const close_large_btn = document.querySelector('.ri-close-large-line-1');
if (close_large_btn) {
  close_large_btn.addEventListener('click', () => {
    const details_container = document.querySelector('.details_container');
    details_container.style.transform = 'translateX(100%)';
    flags = false;
  });
}


const close_large_btn2 = document.querySelector('.ri-close-large-line-2');
close_large_btn2.addEventListener('click', () => {
  const details_container2 = document.querySelector('.details_container-2');
  details_container2.style.transform = 'translateX(100%)';
  flags = false; // Reset flags when closing
});


// when i click outside of lead create container then i will be close
// const lead_create_container = document.querySelectorAll('.lead-create-container')
// const CreateBtn = document.querySelector('.cssbuttons-io-button')
//   document.addEventListener('click',function(e){
//     if(!lead_create_container.contains(e.target) && !CreateBtn.contains(e.target)){
//      document.querySelector('.ri-close-large-line').click()
//     }
//   })





