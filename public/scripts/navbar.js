const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return cookieValue;
      }
    }
    return null;
  };


  
// serach functionality
function navSearchFunctionality() {
    const fieldCard = document.querySelector('.field-card')
    const searchField = document.querySelector('.nav-search')
    const closeIcon =  document.querySelector('.field-card  i')
    searchField.addEventListener('click', () => {

        if (fieldCard) {
            if (fieldCard.classList.contains('d-none')) {
                fieldCard.classList.remove('d-none')
                fieldCard.classList.add('d-block')

            } else {
                fieldCard.classList.add('d-none')
                fieldCard.classList.remove('d-block')
            }
        }
    })
    searchField.addEventListener('input',(e)=>{
        const searchText = e.target.value;
        if(searchText.length > 0){
            closeIcon.click()
        }
       
  
})
}
navSearchFunctionality()


const navsearch = document.querySelector('.nav-search')
let pipelineSelectValue = localStorage.getItem('pipeline_select_value');

navsearch.addEventListener('input', async (e) => {
    const searchText = e.target.value;
    document.getElementById('loaderNew').style.display = 'block';

    try {
        const response = await fetch('/navbar-contact-filter-input', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                companyNameSearch: searchText,
                pipelineId: pipelineSelectValue
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            createCookieCard(result);
        } else {
            console.error('Error in response:', result);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        document.getElementById('loaderNew').style.display = 'none';
    }
});




//fetch data
function FetchingSearchData() {
    document.getElementById('filterForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the form from submitting normally      
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        if (data) {
            try {
                const response = await fetch('/navbar-contact-filter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    createCookieCard(result)

                }
            } catch (error) {
                console.error(error);
            }
        }
    });
}

FetchingSearchData();

let count = 0;

function createCookieCard(result) {
    const boardColumnContainer = document.querySelectorAll('.board-column-container');
    
    boardColumnContainer.forEach(element => {
        count = 0; 
        const boardColumnContent = element.querySelector('.board-column-content');
        const boardColumnHeader = element.querySelector('.board-column-header').getAttribute('data-target-status');
        // Clear existing content
        boardColumnContent.innerHTML = '';
        result?.totalLead.forEach(lead => {
            if (lead.target_status.toLowerCase() === boardColumnHeader.toLowerCase()) {
                count++; // Increment count for each matched lead
                const card = document.createElement('div');
                card.classList.add('cookie-card');
                card.draggable = true;
                card.style.backgroundColor = lead.isReminderDue ? '#ffcccc' : '#fff';
                card.setAttribute('ondragstart', 'drag(event)');
                card.id = `card_${lead.Id}`;
                card.dataset.leadId = lead.Id;
                
                const title = document.createElement('span');
                title.classList.add('d-block', 'title', 'company_heading', 'text-capitalize');
                title.textContent = lead.companyName.length > 22 ? lead.companyName.substring(0, 18) + "..." : lead.companyName;
                title.setAttribute('onclick', 'showLeadData(this.closest(".cookie-card"))');

                const newspan = document.createElement('span');
                newspan.innerHTML = `<i class="ri-information-2-fill float-end cursor-pointer" style="font-size:18px"></i>`;

                const deleteSpan = document.createElement('span');
                deleteSpan.setAttribute('data-delete-id', lead.Id);
                deleteSpan.innerHTML = `<i class="ri-close-circle-fill float-end cursor-pointer" style="font-size:18px"></i>`;
                deleteSpan.addEventListener('click', async function () {
                    const confirmDelete = confirm('Are you sure you want to delete this lead data?');
                    if (confirmDelete) {
                        const leadIdToDelete = this.getAttribute('data-delete-id');
                        try {
                            const response = await fetch(`/leads/${leadIdToDelete}`, {
                                method: 'DELETE'
                            });
                            if (response.ok) {
                                location.reload();
                            } else {
                                console.error('Failed to delete lead data');
                            }
                        } catch (error) {
                            console.error('Error deleting lead data:', error);
                        }
                    } else {
                        console.log('Deletion canceled by user');
                    }
                });

                newspan.onclick = function () {
                    openActivityData(card);
                };
                title.appendChild(newspan);
                title.appendChild(deleteSpan);

                const leadStatus = document.createElement('small');
                leadStatus.textContent = Number(lead.Amount).toLocaleString('en-IN', {
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
                        <a style="text-decoration: none; color:white" href="mailto:">
                            <i class="ri-mail-line"></i>
                        </a>
                    </button>
                    <button class="accept">
                        <a style="text-decoration: none; color:white" href="tel:${lead.ContactNumber}">
                            <i class="ri-phone-line"></i>
                        </a>
                    </button>
                    <button class="accept call_icon">
                        <a style="text-decoration: none; color:white" href="https://wa.me/${lead.ContactNumber}">
                            <i class="ri-chat-3-fill"></i>
                        </a>
                    </button>
                `;
                actions.appendChild(activityButton);
                actions.appendChild(icons);

                card.appendChild(title);
                card.appendChild(leadStatus);
                card.appendChild(actions);

                const createdAt = document.createElement('small');
                const createdAtDate = new Date(lead.createdAt);
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

                boardColumnContent.appendChild(card);
            }
        });

        element.querySelector('.board-column-header').textContent = `${boardColumnHeader} (${count})`;
    });
}






//  custom icon field js

function showCustomCheckBoxSelect() {
    const customfieldcontainer = document.querySelector('.custom-field-container')
    const checkboxfromclose = document.querySelector('.checkbox-from-close')
    const addcusbtn = document.querySelector('.add-cus-btn')
    addcusbtn.addEventListener('click', () => {
        // if (document.querySelector('.field-card').classList.contains('d-block'))  document.querySelector('.field-card').classList.add('d-none')
        if (customfieldcontainer.classList.contains('d-none')) {
            customfieldcontainer.classList.remove('d-none')
            customfieldcontainer.classList.add('d-block')

        }
    })

    checkboxfromclose.addEventListener('click', () => {
        if (customfieldcontainer.classList.contains('d-block')) {
            customfieldcontainer.classList.remove('d-block')
            customfieldcontainer.classList.add('d-none')

        }
    })
}


showCustomCheckBoxSelect()


// Columns Name Get Request

const getColumnsName = async () => {
    try {
        const response = await fetch('/get-all-lead-column');
        const data = await response.json();
        if (data.success) {
            const checkboxWrapper = document.querySelector('.checkbox-wrapper');
            data.keys.forEach((key, index) => {
                checkboxWrapper.innerHTML += `
                    <div class="checkbox-elem" style="width:23%; display: flex; justify-content: start;" >
                        <label class="cl-checkbox"  >
                            <input type="checkbox" data-type="${key.type}" >
                            <span>${key.name}</span>
                        </label>
                    </div>
                `;
            });
            checkboxWrapper.addEventListener('change', (e) => {
                sendcheckboxval(e);
            });
        }
    } catch (error) {
        console.error('Failed to fetch or process data:', error);
    }
};

getColumnsName();


async function sendcheckboxval(e) {
    const result = e.target.closest('input[type="checkbox"]');
    const innerTextValCheckbox = e.target.nextElementSibling.innerText;
    const type = result.dataset.type;

    let inputType = 'text';
    // Set custom placeholder for DATETIME type
    if (type === 'DATETIME') {
        inputType = 'date';
    }

    if (result.checked) {
        try {
            const newRes = await fetch('/checkbox-post', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    fieldName: innerTextValCheckbox,
                    type: inputType,
                    name: innerTextValCheckbox.trim() + "custom",
                    ischecked: true
                })
            });
            const getres = await newRes.json();
            if (getres.success) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            const newRes = await fetch('/checkbox-post', {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    fieldName: innerTextValCheckbox,
                    ischecked: false
                })
            });
            const putRes = await newRes.json();
            if (putRes.success) {
                // Remove the input if the update is successful
                const inputval = document.querySelector(`input[name="${innerTextValCheckbox.trim() + "custom"}"]`);
                inputval.parentElement.remove();
            }
        } catch (error) {
            console.log(error)
        }
    }
}
// append checked data
async function appendCheckInput() {
    try {
        const formwrapup = document.querySelector('.form-wrap-up');
        const getInputs = await fetch('/checkbox-post');
        const getInputsData = await getInputs.json();
        if (getInputsData.success) {
            getInputsData.allCheckData.forEach((item) => {
                if (item.ischecked === true) {
                    formwrapup.insertAdjacentHTML('beforeend', `
                    <div class="form-outline  my-2">
                    <label for="">${item.fieldName}</label>
                    <input type="${item.type}" class="form-control form-control-sm rounded-0 ${item.type === 'date' ? 'cursor-pointer' : 'cursor-default'}" name="${item.name}" id="${item.name}" placeholder="${item.type === 'date' ? 'YYYY-MM-DD' : ''}" onclick="openDatePicker(this)" />
                    </div>   
                `);
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}
appendCheckInput();

// item.lastElementChild.innerText
async function updateCheckbox() {
    const getInputs = await fetch('/checkbox-post');
    const getInputsData = await getInputs.json();
    if (getInputsData.success) {
        const clcheckbox = document.querySelectorAll('.cl-checkbox')
        clcheckbox.forEach((item) => {
            getInputsData.allCheckData.forEach((item2) => {
                if (item.lastElementChild.innerText == item2.fieldName && item2.ischecked === true) {
                    item.querySelector('input').checked = true
                }
            })

        })
    }

}
updateCheckbox()


function openDatePicker(input) {
    if (input.type === 'date') {
        flatpickr(input, {
            dateFormat: "Y-m-d",
            onClose: function (selectedDates, dateStr, instance) {
              
                instance.close();
            }
        }).open();
    }
}


//* pipeline functionality;
async function PipelineData() {
    const userId =  localStorage.getItem('userId')
    const res = await fetch(`/pipeline-permission-data/${userId}`)
    const data = await res.json()
    return data?.pipelineData;

}



async function PipelineField() {
    const pipeline_select = document.querySelector('.pipeline_select');
    // Clear existing options before adding new ones
    pipeline_select.innerHTML = '';
    const data = await PipelineData();
    if (data.length > 0) {
        pipeline_select.classList.remove('d-none');
        data.forEach((item, index) => {
            const option = document.createElement('option');
            option.value = item.id;
            option.innerText = item.field_name;
            option.selected = true
            pipeline_select.append(option);
        });
    } else {
    pipeline_select.classList.add('d-none');
    }
    
    // Get the stored value from cookie
    const selectedValueFromCookie = localStorage.getItem('pipeline_select_value');
    if (selectedValueFromCookie) {
        pipeline_select.value = selectedValueFromCookie;
    }
}

// Function to get cookie value by name
function get1Cookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}





// // show  options base on user 
// async function showSelectOptions(){
//     const pipeline_select = document.querySelector('.pipeline_select')
//     pipeline_select.innerHTML = ''
//     const allocateSeleceField = await pipelinePerission()
//     allocateSeleceField?.forEach((item,index) => {
//         const option = document.createElement('option')
//         option.value = item.id
//         option.innerText = item.field_name
//         pipeline_select.append(option)
//     })

   
// }
// showSelectOptions()












PipelineField()






// ? pipeline form

function PipelineForm() {
    const pip_form = document.querySelector('#pipeline_form')
    const closeModalButton = document.querySelector('#closeModal')

    pip_form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const newForm = new FormData(pip_form)
        const obj = Object.fromEntries(newForm.entries())
        const res = await fetch('/pipeline-model', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        const data = await res.json()
        if (data.success) {
            toastr.success('pipeline added successfully')
            closeModalButton.click()
            
            setTimeout(() =>{
                $('#modal-2').modal('show')
            },1000)
            const model2 = document.querySelector('#modal-2')
            model2.setAttribute('data-id', data?.pipeline?.id)
            const appending_pipeline_fields = document.querySelector('.appending-pipeline-fields ')
            const pipeline_field_button = document.querySelector('.pipeline_field_button')
            const pipeline_field_button_submit = document.querySelector('.pipeline_field_button_submit')
            const modal_of_pipeline = document.querySelector('.modal_of_pipeline')
            const selectfield_DataId = modal_of_pipeline.dataset.id
            pipeline_field_button.addEventListener('click', (e) => {
                const pipeline_field_name = document.querySelector('.pipeline_field_name')
                if (pipeline_field_name.value === "") {
                    alert("Please enter a field name")
                    return
                }
                appending_pipeline_fields.innerHTML += `
				<input class="form-control w-50 my-2 pipeline_form_inputs" type="text" placeholder="Default input" value="${pipeline_field_name.value}">
                `
                pipeline_field_name.value = ""
                if (appending_pipeline_fields.innerHTML !== "") {
                    pipeline_field_button_submit.classList.remove('d-none')
                }
            })
            pipeline_field_button_submit.addEventListener('click', async (e) => {
                postCustomFields(selectfield_DataId)

            })
        }
    })

}
PipelineForm()


function postCustomFields(selectfield_DataId) {
    const pipeline_field_inputs = document.querySelectorAll('.pipeline_form_inputs')
    const pipeline_field_inputs_array = Array.from(pipeline_field_inputs)
    pipeline_field_inputs_array.map(async (item) => {
        try {
            const res = await fetch('/pipeline-custom-fields', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value: item.value,
                    select_data_Id: selectfield_DataId
                })
            })
            const data = await res.json()
            if (data.success) {
                $('#modal-2').modal('hide')
                toastr.success('field added successfully')
                setTimeout(()=>{
                    window.location.reload()
                },1500)
            }
        } catch (error) {
            console.log(error)
        }
    })
}


// permission dropdown

document.addEventListener("DOMContentLoaded", function() {
    var userGroup = localStorage.getItem("user_group");
    var customPipelineLink = document.querySelectorAll(".custom_pip");
    customPipelineLink.forEach(function(item) {
        if (userGroup === "admin") {
            item.classList.remove("d-none");
        }else{
            item.classList.add("d-none");
        }
    });
});



//! Pipeline User Permissions

async function pipelineUserPermissions() {
    const searchInput = document.querySelector('#username_search');
    searchInput.addEventListener('input', async (e) => {
        const user_contact_div = document.querySelector('.user_contact_div');
        const searchValue = e.target.value.trim();
        if (searchValue === '') {
            user_contact_div.innerHTML = '';
            return;
        }

        try {
            const res = await fetch('/pipeline-user-permission', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ searchValue })
            });
            const res_data = await res.json();
            if (res_data.success) {
                user_contact_div.innerHTML = res_data.pipelineUserPermission.map((item, index) => {
                    return `
                        <div class="user_contact_div_inner d-flex align-items-center gap-4" onclick="setSearchUsername('${item.username}', '${item.id}')">
                            <p class="h6 m-0" style="min-width:20%;">${item.username}</p>
                            <p class="h6 m-0" style="min-width:50%">${item.email}</p>
                        </div>
                    `;
                }).join('');
            }
        } catch (error) {
            console.log(error);
        }
    });
}

pipelineUserPermissions();

function setSearchUsername(username, userId) {
    const searchInput = document.querySelector('#username_search');
    const user_contact_div = document.querySelector('.user_contact_div');
    searchInput.value = username;
    searchInput.setAttribute('data-id', userId);
    user_contact_div.innerHTML = '';
    handleCheckboxAppending(userId);
}

// * append the value in checkbox
async function appendCheckValueInCheckBox(userId) {    
    try {
        const res = await fetch(`/get-pipeline-user-permission/${userId}`);
        const data = await res.json();
        if (data.success) {
            const pip_checkbox_container = document.querySelectorAll('.pip_checkbox_container .form-check');
            pip_checkbox_container.forEach((item) => {
                const id = item.getAttribute('data-id');
                const checkbox = item.querySelector('.form-check-input');
                if (data.alluser.some(user => user.pipeline_id == id)) {
                    checkbox.checked = true;
                } else {
                    checkbox.checked = false;
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}

//! appending checkbox to the pipelines
async function handleCheckboxAppending(userId = null) {
    const pip_checkbox_container = document.querySelector('.pip_checkbox_container');
    pip_checkbox_container.innerHTML = ''; 
    try {
        const res = await fetch('/pipeline-data');
        const data = await res.json();
        
        if (data.success) {
            data.pipelineData.forEach((item, index) => {
                pip_checkbox_container.innerHTML += `
                    <div class="form-check" data-id=${item.id}>
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked${index}">
                        <label class="form-check-label" for="flexCheckChecked${index}">
                            ${item.field_name}
                        </label>
                    </div>
                `;
            });
            if (userId) {
                await appendCheckValueInCheckBox(userId);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    handleCheckboxAppending();
});





async function pipelinePermissionCheckbox() {
    const permission_modal = document.querySelector('.permission-modal');
    const username_search =  document.querySelector('#username_search')
    permission_modal.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(username_search.value === ''){
            alert('Please enter a username');
            return;
        }
        const userId = permission_modal.username_search.getAttribute('data-id');
        const allCheckboxes = document.querySelectorAll('.pip_checkbox_container input[type="checkbox"]:checked');
        
        const pipelineIds = Array.from(allCheckboxes).map(checkbox => {
            return checkbox.parentElement.getAttribute('data-id');
        });


        try {
            const res = await fetch('/pipeline-user-permission-save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    pipeline_ids: pipelineIds
                })
            });
            const data = await res.json();
    
            if(data.success){
                document.querySelector('.modal-header .close').click()
            }
        } catch (error) {
            console.log(error);
        }
    });
}

pipelinePermissionCheckbox();




// logout function 
function logout(){
    const btn =  document.querySelector('.logout-btn');
    btn.addEventListener('click', () => {
        localStorage.removeItem('pipeline_select_value')
    })
  
}
logout()



const pipeline_select = document.querySelector('.pipeline_select');
pipeline_select.addEventListener('change', async (e) => {
  const value = e.target.value;
  localStorage.setItem('pipeline_select_value', value)
  window.location.reload();

});

const custom_search_form =  document.querySelector('.field-card')
const navbar =  document.querySelector('.nav-search')
document.addEventListener('click',(e)=>{
    if(!custom_search_form.contains(e.target) && !navbar.contains(e.target)){
       document.querySelector('.field-card').classList.add('d-none')
    }
})



// loader script


// Show loader when the page starts loading
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.loader-wrapper').style.display = 'block';
});

// Hide loader when the page is fully loaded
window.addEventListener('load', function () {
  document.querySelector('.loader-wrapper').style.display = 'none';
});


