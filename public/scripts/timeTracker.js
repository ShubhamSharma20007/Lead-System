
  
    function outputTime(totalTime){
        const totlaTime_cnt =  document.querySelector('.output_timer')
        let t_hour =totlaTime_cnt .querySelector('.hour')
        let t_minute =totlaTime_cnt .querySelector('.minute')
        let t_second =totlaTime_cnt .querySelector('.second')
          let sum =  totalTime?.data.reduce((acc,curr)=>{
                return acc + parseInt(curr.totalTime)
          },0)

        t_second.textContent = sum < 10 || sum % 60 == 0 ? `0${Math.floor(sum % 60)}` : Math.floor(sum % 60);   
        t_minute.textContent = sum < 10 || sum % 60 == 0 ? `0${Math.floor(sum / 60) % 60}` : Math.floor(sum / 60) % 60;
        t_hour.textContent = sum < 10 || sum % 60 == 0 ? `0${Math.floor(sum / 3600) % 60}` : Math.floor(sum / 3600) % 60;
    }


    async function fetchAndDisplayData() {
        try {
            const response = await fetch('/timetrackerGet');
            const data = await response.json();
            outputTime(data)
            if (data.success) {
                const dataholder = document.querySelector(".data_holder");

                // Clear existing content
                dataholder.innerHTML = '';

                // Iterate over fetched data and create HTML elements
                data.data.forEach((item) => {
                    const newTaskElement = document.createElement('div');
                    newTaskElement.classList.add('inner_dets', 'p-3', 'bg-white');

                    newTaskElement.innerHTML = `
          <div class="dets d-flex justify-content-between align-items-center">
              <div class="input-container2 d-flex gap-3 align-items-center">
                  <input type="text"  placeholder="Enter your name" id="text_${item.id}" value="${item.taskName}" name="text" id="text" class="input-field input-taskName_field" autocomplete="name" readonly>
                   <i class="ri-edit-line" onclick="updateField('${item.id}')"></i>    
                   <i class="ri-close-line" onclick="deleteField('${item.id}')"></i> 
              </div>
              <div class="row_time">
                  <div class="timer d-flex justify-content-center align-items-center" style="gap: 15px">
                      
                <p class="workhour m-0">${item.startTime.split(':')[0]}</p>
                      :
                <p class="workminute m-0">${item.startTime.split(':')[1]}</p>
                      :
                <p class="worksecond m-0">${item.startTime.split(':')[2]}</p>
                  </div>
              </div>
          </div>
        `;
                    dataholder.appendChild(newTaskElement);
                });
            } else {
                console.log('No data found');
            }
        } catch (error) {
            console.error('Error fetching and displaying data:', error);
        }
    }
    fetchAndDisplayData();

    async function updateField(e) {
      
        const inputTask = document.getElementById(`text_${e}`);
        inputTask.removeAttribute('readonly')

        inputTask.focus()


        inputTask.addEventListener('blur', async function () {
            const resp = await fetch(`/timetracker/${e}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'taskName': inputTask.value
                })
            })
            const data = await resp.json();
            if (data.success) {
                inputTask.setAttribute('readonly', '')
                fetchAndDisplayData()
            }
        })
    }







    async function showData() {

        const userId = document.getElementById('useremp_id')?.value;
        document.addEventListener('DOMContentLoaded', () => {
            const startbtn = document.querySelector('.startbtn');
            const taskhour = document.querySelector('.starthour');
            const taskminute = document.querySelector('.startminute');
            const tasksecond = document.querySelector('.startsecond');
            const resultInput = document.querySelector(".input-container2 .input-field")
            // working
            const dataholder = document.querySelector(".data_holder");
            const workhour = document.querySelector('.workhour');
            const workminute = document.querySelector('.workminute');
            const worksecond = document.querySelector('.worksecond');
            let intervalId;
            let count = 0;

            startbtn.addEventListener('click', async () => {
                const tasknameInput = document.querySelector('#taskname').value;
                if (!tasknameInput) {
                    alert('Fill the input first');
                    return;
                }

                if (startbtn.classList.contains('stopbtn')) {
                    clearInterval(intervalId);
                    startbtn.classList.remove('stopbtn');
                    startbtn.classList.add('startbtn');
                    startbtn.style.backgroundColor = 'green';
                    startbtn.textContent = 'Start';


                    const newTaskElement = document.createElement('div');
                    newTaskElement.classList.add('inner_dets', 'p-3', 'bg-white');
                    newTaskElement.innerHTML = `
                        <div class="dets d-flex justify-content-between align-items-center">
                            <div class="input-container2">
                                <input type="text" placeholder="Enter your name" value="${tasknameInput}" name="text" id="text" class="input-field" autocomplete="name" readonly>
                            </div>
                            <div class="row_time">
                                <div class="timer d-flex justify-content-center align-items-center" style="gap: 15px">
                                    
                                    <p class="workhour m-0">${taskhour.textContent}</p>
                                    :
                                    <p class="workminute m-0">${taskminute.textContent}</p>
                                    :
                                    <p class="worksecond m-0">${tasksecond.textContent}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    dataholder.appendChild(newTaskElement);


                    const timerElement = newTaskElement.querySelector('.timer');
                    if (timerElement) {
                        const wHour = timerElement.children[0].textContent;
                        const wMinute = timerElement.children[1].textContent;
                        const wSecond = timerElement.children[2].textContent;


                        // post request for store data

                        const response = await fetch('/timetracker', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                'userId': userId,
                                'taskname': tasknameInput,
                                'startTime': `${taskhour?.textContent}:${taskminute?.textContent}:${tasksecond?.textContent}`,
                                'endTime': `${wHour}:${wMinute}:${wSecond}`,
                                'totalTime': parseInt(wHour + wMinute + wSecond)

                            })
                        })
                        const responseData = await response.json();
                        if (responseData.success) {
                            // Reset the timer
                            count = 0;
                            taskhour.textContent = '00';
                            taskminute.textContent = '00';
                            tasksecond.textContent = '00';
                            fetchAndDisplayData()

                            return;
                        }


                    }
                }

                startbtn.classList.add('stopbtn');
                startbtn.classList.remove('startbtn');
                startbtn.style.backgroundColor = 'red';
                startbtn.textContent = 'Stop';

                clearInterval(intervalId); // Clear any existing interval
                intervalId = setInterval(() => {
                    count++;
                    tasksecond.textContent = count % 60 < 10 ? `0${count % 60}` : count % 60;
                    if (count % 60 === 0) {
                        taskminute.textContent = count / 60 < 10 ? `0${count / 60}` : count / 60;
                        count = 0;
                    }
                    if (count % 3600 === 0) {
                        taskhour.textContent = count / 3600 < 10 ? `0${count / 3600}` : count / 3600;
                        count = 0;
                    }
                }, 1000);
            });
        });
    }
    showData();


 

 
 async  function deleteField(removeid){
      const prompt = confirm("Are you sure you want to delete this task?");
    if(prompt){
          const res = await fetch(`/timetracker/${removeid}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json'
            }
        })
        const data = await res.json()
        if(data.success){
            fetchAndDisplayData()
        }
    }

    }
