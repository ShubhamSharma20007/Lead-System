


// Delete Icon functionlity 

const selectDropDown = document.getElementById("targetStatus");
const trashBtn = document.querySelector('.trash-btn');
let optionId = ""; // Changed variable name to optionId for clarity

selectDropDown.addEventListener('change', (e) => {
    optionId = e.target.options[e.target.selectedIndex].getAttribute('data_id');
});

trashBtn.addEventListener('click', async function () {
    if (!optionId) {
        console.error('No option selected.');
        return;
    }
    try {
        const res = await fetch(`/delete-option?id=${optionId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await res.json();
        if (result.success === true) {
            location.reload();
        }
    } catch (error) {
        console.error('Error:', error);
    }
});





const toggleBtn = document.querySelector('.plusSelectField')
const inputSection = document.querySelector('.input-section')

var flag = true;
toggleBtn.addEventListener('click', () => {
    if (flag) {
        inputSection.style.display = 'block';
        flag = false
    }
    else {
        inputSection.style.display = 'none';
        flag = true
    }
})
// appending the data from input
const dropdownAddBtn = document.querySelector('.dropdown-input-add-btn')
dropdownAddBtn.addEventListener('click', async () => {
    const dropdownInput = document.querySelector('.dropdown-input').value;
    const targetStatus = document.querySelector('#targetStatus');

    // Post API on Click :/selectoption
    const res = await fetch("/selectoption", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ dropdownInput })
    });
    const successData = await res.json()
    try {
        if (successData.success === true) {
            location.reload()
        }
        else {
            alert(successData.error)
        }
    }
    catch (err) {
        console.log(err)
    }

});



window.addEventListener('load', async function () {
    try {
        const response = await fetch('/selectoption');
        const data = await response.json();
        const targetStatus = document.querySelector('.target-status');

        // Check if data exists and both modal data exist
        if (data && data.selecteModalData && data.dashboardFieldData) {
            // Iterate over selecteModalData
            data.selecteModalData.forEach((item) => {
                const option = document.createElement('option');
                option.value = item.labelName;
                option.textContent = item.labelName;

                // Set custom attribute to store item.id
                option.setAttribute('data_id', item.id);

                targetStatus.appendChild(option);
            });

            // Iterate over dashboardFieldData
            data.dashboardFieldData.forEach((item) => {
                const option = document.createElement('option');
                option.value = item.fieldName; // Change to fieldName
                option.textContent = item.fieldName;

                // Set custom attribute to store item.id
                option.setAttribute('data_id', item.Id);

                targetStatus.appendChild(option);
            });
        }
    } catch (error) {
        console.error(error);
    }
});








const leadSubmitBtn = document.querySelector("#leadSubmitBtn");
leadSubmitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await getLeadData();
});

async function getLeadData() {
    const form = document.querySelector('.leadForm');
    const formData = new FormData(form);

    // Check if any field is null
    let fieldsAreValid = true;
    formData.forEach((value) => {
        if (!value) {
            fieldsAreValid = false;
        }
    });

    if (!fieldsAreValid) {
        // Show error message if any field is null
        Toastify({
            text: "Please fill in all fields",
            gravity: "top",
            duration: 3000,
            close: true,
            style: {
                width: '30%'
            },
            backgroundColor: "red",
            position: "center"
        }).showToast();
        return; // Stop further execution
    }

    const obj = Object.fromEntries(formData);

    try {
        const res = await fetch('/leads', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(obj)
        });
        const response = await res.json();

        if (response.success) {
            Toastify({
                text: "Data stored successfully",
                gravity: "top",
                duration: 3000,
                close: true,
                style: {
                    width: '30%'
                },
                position: "center"
            }).showToast();

            // Refresh the page after successful submission
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            throw new Error(response.error || 'Failed to store data');
        }
    } catch (error) {
        console.error(error);
        // Show error message
        Toastify({
            text: error.message || "Failed to store data",
            gravity: "top",
            duration: 3000,
            close: true,
            style: {
                width: '30%'
            },
            backgroundColor: "red",
            position: "center"
        }).showToast();
    }
}







const btn = document.querySelector(".addField")
const dialog = document.querySelector("dialog")
const closeBtn = document.querySelector(".closeBtn")
btn.addEventListener('click', () => {
    dialog.showModal()
    window.scrollTo({
        behavior: 'smooth',
        top: 0,
        left: 0

    })
})
closeBtn.addEventListener('click', function () {
    dialog.close()
})




window.onload = async function () {
    try {
        const res = await fetch('/sendCustomField', {
            method: 'GET',
        });
        const data = await res.json();
        inputFieldAppendData(data);
    } catch (err) {
        console.log(err);
    }
}

function inputFieldAppendData(data) {
    const useGroup = localStorage.getItem('userGroup');
    const form = document.querySelector('.mainForm');

    data.data.forEach(item => {

        const fieldHtml = `
    <div class="mb-2 col-12 col-md-5" style="position:relative">
        <i class="delete-icon ri-close-fill" style="position:absolute;right:20px;top:0px;font-size:17px"></i>
        <label for="${item.divId}" class="form-label new-class">${item.labelName}</label>
            <input type="${item.type}" class="form-control customGenrateRow" id="${item.divId}" name="${item.labelName.trim()}">
    </div>
`;
        form.insertAdjacentHTML('beforeend', fieldHtml);
    });

    // Attach event listeners to delete icons
    const deleteIcons = document.querySelectorAll('.delete-icon');
    deleteIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const inputElement = this.parentElement.querySelector('input');

            if (inputElement) {
                const id = inputElement.getAttribute('id');
                deleteFromDatabase(id);
                this.parentElement.remove();
            } else {
                console.log("Input element not found.");
            }
        });
    });

}





const customForm = document.querySelector('.fieldBtn');
customForm.addEventListener('click', async (event) => {
    event.preventDefault();
    const radios = document.getElementsByName('fields');
    let radioVal;
    for (var radio of radios) {
        radio.checked ? radioVal = radio.value : null;
    }

    const labelVal = document.getElementById('lableName').value;
    const labelIdElement = document.querySelector('.customGenrateRow');
    const customId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const labelId = customId;

    try {
        const res = await fetch('/sendCustomField', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                labelName: labelVal,
                name: radioVal,
                divId: labelId,
                type: radioVal
            })
        });

        const data = await res.json();
        if (data.success) {
            alert('Field Added Successfully');
        }
        location.reload();
    } catch (error) {
        console.log(error);
    }
});





function deleteItem(id) {

    deleteFromDatabase(id);
}

function deleteFromDatabase(id) {
    fetch(`/sendCustomField/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // No need to stringify the body, as the id is already in the URL
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Item deleted successfully');
            // Optionally, you can perform further actions after successful deletion
        })
        .catch(error => {
            console.error('There was a problem deleting the item:', error);
        });
}




