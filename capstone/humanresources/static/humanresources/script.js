document.addEventListener('DOMContentLoaded', function() {

  // getting the account type
  const account = parseInt(document.querySelector('#profile').dataset.account);
  document.querySelector('#btn-worker-connect').style.display = 'none';

  // Employer account
  if (account === 3) {

    // use buttons to toggle between views
    const btnHome =  document.querySelector('#home');
    btnHome.addEventListener('click', e => load_view('created', e));
    document.querySelector('#requested').addEventListener('click', e => load_view('requested', e));
    document.querySelector('#work-arrange').addEventListener('click', e => load_view('work-arrange', e));
  
    // render home as default
    dataFetch('created');
  
    // disable home anchor on the nav when page is loaded as default
    // btnHome.removeAttribute('href');
    btnHome.classList.add('disabled');

  } else if (account === 2) {
    // Employee account

    console.log("this is a employee account");
 
  } else {
    // Main account
    document.querySelector('#dashboard').addEventListener('click', e => load_view_main('requestedWorker', e));

    load_view_main('requestedWorker');
    const taskContainer = document.querySelector('#view-dashboard');
    taskContainer.addEventListener('click', event => {
      if (event.target.matches('#btnArrange')) {
        console.log("clicked on arrange button");
        document.querySelector('#view-dashboard').style.display = 'none';
        document.querySelector('#view-workArrange').style.display = 'block';

        const parentElement = event.target.parentElement;
        const requestedTaskId = parentElement.querySelector('#requested-task-id').textContent;

        // const zone = parentElement.querySelector('#card-zone').textContent;
        // let employer = parentElement.querySelector('#card-employer').innerHTML;
        // employer = employer.substring(0, employer.indexOf('<')).trim();
        // const amount = parseInt(parentElement.querySelector('#task-amount').textContent.match(/\d+/)[0]);
        // const description = parentElement.querySelector('#card-description').textContent;
        // const date = parentElement.querySelector('#card-date').textContent;
        // const time = parentElement.querySelector('#card-time').textContent;
        // const startDate = date.substring(date.indexOf(':') + 1, date.indexOf('-')).trim();
        // const endDate = date.substring(date.indexOf('-') + 1, date.length).trim();
        // const startTime = time.substring(time.indexOf(':') + 1, time.indexOf('-')).trim();
        // const endTime = time.substring(time.indexOf('-') + 1, time.length).trim();
        // const createdDate = parentElement.querySelector('#card-created').textContent;

        // disable arrange button and insert the clicked parent element into page(left side)
        parentElement.querySelector('#btnArrange').style.display = 'none';
        const viewArrangeInfo = document.querySelector('#view-workArrange-info');
        viewArrangeInfo.append(parentElement);
        viewArrangeInfo.style.marginTop = '5%';
        const viewAvailableWorkers = document.querySelector('#view-available-workers');

        fetch(`/task/${requestedTaskId}`)
        .then(response => response.json())
        .then(workers => {
          console.log(workers);
          workers.forEach((worker, index) => {
            const viewEmployee = document.createElement('div');
            viewEmployee.innerHTML = `
            <ul class="list-group">
              <li class="list-group-item">
                <input class="form-check-input me-1 checkbox-values" type="checkbox" name="name-check-box" value="${worker.id}" id="Checkbox-${index}">
                <label class="form-check-label" for="Checkbox-${index}">${ worker.email }</label>
              </li>
              <div class="available-worker-view bg-secondary bg-opacity-10">
                <dl class="row text-capitalize">
                  <dt class="col-sm-3">Name</dt>
                  <dd class="col-sm-9">${worker.name}</dd>

                  <dt class="col-sm-3">Surname</dt>
                  <dd class="col-sm-9">${worker.surname}</dd>

                  <dt class="col-sm-3">City</dt>
                  <dd class="col-sm-9">${worker.city}</dd>

                  <dt class="col-sm-3">Zip</dt>
                  <dd class="col-sm-9">${worker.zip}</dd>

                  <dt class="col-sm-3">Address</dt>
                  <dd class="col-sm-9">${worker.address}</dd>

                  <dt class="col-sm-3">Phone</dt>
                  <dd class="col-sm-9">${worker.phone}</dd>

                </div>
            </ul>
            `;
            viewAvailableWorkers.append(viewEmployee);
          });
          document.querySelector('#btn-worker-connect').style.display = 'block';
        })

        
        // save data via fetch
        viewAvailableWorkers.addEventListener('submit', e => {
          e.preventDefault();

          // storing checked values(worker ids) into an array
          let workerIds = [];
          const checkboxValues = document.querySelectorAll('.checkbox-values:checked');
          checkboxValues.forEach(checked => {
            if (checked.value) {
              workerIds.push(parseInt(checked.value));
            }
          });

          console.log("this is task id", requestedTaskId);
          console.log("this is checkbox value", workerIds);

          fetch(`workers/${requestedTaskId}`, {
            method: 'POST',
            body: JSON.stringify({
              workers: workerIds
            })
          })
          .then(response => response.json())
          .then(result => {
            // print result
            // load newly available workers
            console.log(result);
          })
        })
      }
    })

    console.log("this is main account");
  }
    
});

// use global variables to store fetch data to avoid duplications
let dataCreatedTasks = null;
let dataRequestedTasks = null;
let dataRequestedWorkers = null;


// Main account dashboard
function load_view_main(view, e) {
  if (e) {
    e.preventDefault();
  }
  const viewDashboard = document.querySelector('#view-dashboard');

  if (view === 'requestedWorker' && !dataRequestedWorkers) {
    fetch(`task/${view}`)
    .then(response => response.json())
    .then(tasks => {
      
      dataRequestedWorkers = tasks;
      tasks.forEach(task => {
        const element = document.createElement('div');
        element.innerHTML = `<div class="card mb-3">
                                <div class="card-body">
                                  <div class="card-title d-flex justify-content-start">
                                    <h5 id="card-employer" class="text-capitalize fw-bold">${task.employer} <span id="card-zone" class="align-bottom fw-normal fs-6">${task.task}</span></h5>
                                  </div>
                                  <p id="task-amount"><strong>Amount: ${task.amount === 1 ? task.amount + ' worker' : task.amount + ' workers'}</strong></p>
                                  <ul class="list-unstyled">
                                    <li id="card-description">${task.description}</li>
                                      <ul>
                                        <li id="card-date">Date: ${task.start_date} - ${task.end_date}</li>
                                        <li id="card-time">Time: ${task.start_time} - ${task.end_time}</li>
                                      </ul>
                                    <li id="card-created"><small>Created: ${task.created}</small></li>
                                  </ul>
                                  <p id="requested-task-id" hidden>${task.id}</p>
                                
                                  <button type="button" id="btnArrange" class="btn-request btn btn-primary">Arrange</button>
                                </div>
                              </div>`;
        viewDashboard.append(element);
      })
    })
  }

  // if (dataRequestedWorkers) {
  //   viewDashboard.style.display = 'block';
  // }
}



// this function prevent default when click on an anchor on the nav and using the 'dataFetch' load the page via API
function load_view(view, e) {
  e.preventDefault();
  dataFetch(view);
}

// fetch data for Employer 
function dataFetch(input) {
 
  const containerCreatedTasks = document.querySelector('#tasks');
  const containerRequestedTasks = document.querySelector('#view-requested');
  const formWorkArrange = document.querySelector('#form-work-arrange');

  if (input !== 'created') {
    document.querySelector('#home').classList.remove('disabled');
  }

  if (input === 'work-arrange') {

    containerCreatedTasks.style.display = 'none';
    containerRequestedTasks.style.display = 'none';
    formWorkArrange.style.display = 'block';
  }

  // if the global variables are null, then fetch data
  if (!dataCreatedTasks || !dataRequestedTasks && input !== 'work-arrange') {
    fetch(`tasks/${input}`)
    .then(response => response.json())
    .then(tasks => {

      // storing fetched data to global variables to avoid duplications
      if (input === 'created') {
        dataCreatedTasks = tasks;

        // render each task and set visibility
        renderTasks(dataCreatedTasks, containerCreatedTasks);
        containerCreatedTasks.style.display = 'block';
        containerRequestedTasks.style.display = 'none';
        formWorkArrange.style.display = 'none';

        // once click on 'request button' a form appears to request workers
        requestTask(containerCreatedTasks);

      } else if (input === 'requested') {
        dataRequestedTasks = tasks;

        // render requested tasks and set visibility
        renderRequestedTasks(dataRequestedTasks, containerRequestedTasks);
        containerCreatedTasks.style.display = 'none';
        containerRequestedTasks.style.display = 'block';
        formWorkArrange.style.display = 'none';
      } 
    })
  }

  // if global variables contains data set display visibility without re-fetching data
  if (dataCreatedTasks && input === 'created') {
    containerCreatedTasks.style.display = 'block';
    containerRequestedTasks.style.display = 'none';
    formWorkArrange.style.display = 'none';

  } else if (dataRequestedTasks && input === 'requested') {
    containerCreatedTasks.style.display = 'none';
    containerRequestedTasks.style.display = 'block';
    formWorkArrange.style.display = 'none';

  } 
}

function requestTask(taskContainer) {
  taskContainer.addEventListener('click', event => {
    if(event.target.matches('#requestBtn')){
      console.log("clicked", );
      const parentElement = event.target.parentElement;
      
      // getting values of clicked request
      const taskName = parentElement.querySelector('#task-name').innerHTML;
      const taskDescription = parentElement.querySelector('#task-description').innerHTML;
      const taskAmount = parentElement.querySelector('#task-amount').textContent.replace(/\D/g, "");
      
      const requestTask = document.querySelector('#request-task');
      requestTask.style.position = 'absolute';
      const toast = document.querySelector('#toast');
      toast.classList.add('show');
      
      // inserting values
      document.querySelector('#toast-header-title').innerHTML = taskName;
      document.querySelector('#req-w-amount').value = taskAmount;
      document.querySelector('#req-w-description').value = taskDescription;
      document.querySelector('#req-w-task').value = taskName;
  
      const body = document.querySelector('body');
      
      // disable each button when request form is appears
      const btnRequest = document.querySelectorAll('.btn-request');
      btnRequest.forEach(element => {
        element.disabled = true;
      });
      
      const topRequestTask = (window.innerHeight / 2) - (requestTask.offsetHeight / 2) + 'px';
      const leftRequestTask = (window.innerWidth / 2) - (requestTask.offsetWidth / 2) + 'px';
  
      requestTask.style.top = topRequestTask;
      requestTask.style.left = leftRequestTask;
      const cards = document.querySelectorAll('.card');
      const btnToast = document.querySelector('#btn-toast');
      body.classList.add('stop-scrolling');
  
      // a function to add or remove blur to background
      function blur(property, cards) {
        cards.forEach(element => {
          if (property === 'add') {
            element.classList.add('blur');
          } if (property === 'remove') {
            element.classList.remove('blur');
          }
        })
      }
  
      blur('add', cards);
  
      btnToast.addEventListener('click', function() {
        toast.classList.remove("show");
        blur('remove', cards);
        // requestTask.remove();
        body.classList.remove('stop-scrolling');
  
        // re-enable buttons after request form is closed
        btnRequest.forEach(element => {
          element.disabled = false;
        });
      })
    }
  })

}

// function dataFetch(input) {

//   const taskContainer = document.querySelector('#tasks');
//   const requestedTaskContainer = document.querySelector('#view-requested');
//   if (dataHome === null) {
    
//     fetch(`/tasks/${input}`)
//     .then(response => response.json())
//     .then(tasks => {
//       if (input === 'created') {
//         dataHome = tasks;
//         console.log("this is data home inside: ", dataHome);
//         console.log("this is created");
//         console.log(tasks);
//         tasks.forEach(task => {
//           const div = document.createElement('div');
//           div.innerHTML = task;
//           taskContainer.append(div);
//         })
//         document.querySelector('#tasks').style.display = 'block';
//         document.querySelector('#view-requested').style.display = 'none';
        
//         // renderTasks(dataHome, taskContainer);

//       } else if (input === 'requested') {
//         console.log("this is requested");
//         console.log(tasks);
//         document.querySelector('#tasks').style.display = 'none';
//         document.querySelector('#view-requested').style.display = 'block';
//       }
//     })
//   } else if (dataHome) {
//     console.log("this is stored dataHome:", dataHome);
//     // renderTasks(dataHome, taskContainer)
//     document.querySelector('#tasks').style.display = 'block';
//     document.querySelector('#view-requested').style.display = 'none';
//   }
// }


// correct function
// function load_view(view, dataHome) {

//   // load home/index page
//   if (view === 'home') {
//     home(dataHome);
//   } else if (view === 'requested') {
//     requestedWorkers();
//   }
// }

// load home/index
// function home(dataHome) {

//   const taskContainer = document.querySelector('#tasks');
  
//   // show task and hide others
//   taskContainer.style.display = 'block';
//   document.querySelector('#view-requested').style.display = 'none';


//   if (dataHome === null) {

//     // render each task into the page
//     fetch('/tasks')
//     .then(response => response.json())
//     .then(tasks => {
//       // Print tasks
//       console.log(tasks);
//       dataHome = tasks;

//       renderTasks(dataHome, taskContainer);
//     }); 

//   } else {
//     renderTasks(dataHome, taskContainer);
//   }
//   taskContainer.addEventListener('click', event => {
//     if(event.target.matches('#requestBtn')){
//       console.log("clicked", );
//       const parentElement = event.target.parentElement;
      
//       // getting values of clicked request
//       const taskName = parentElement.querySelector('#task-name').innerHTML;
//       const taskDescription = parentElement.querySelector('#task-description').innerHTML;
//       const taskAmount = parentElement.querySelector('#task-amount').textContent.replace(/\D/g, "");
      
//       const requestTask = document.querySelector('#request-task');
//       requestTask.style.position = 'absolute';
//       const toast = document.querySelector('#toast');
//       toast.classList.add('show');
      
//       // inserting values
//       document.querySelector('#toast-header-title').innerHTML = taskName;
//       document.querySelector('#req-w-amount').value = taskAmount;
//       document.querySelector('#req-w-description').value = taskDescription;
//       document.querySelector('#req-w-task').value = taskName;
  
//       const body = document.querySelector('body');
      
//       // disable each button when request form is appears
//       const btnRequest = document.querySelectorAll('.btn-request');
//       btnRequest.forEach(element => {
//         element.disabled = true;
//       });
      
//       const topRequestTask = (window.innerHeight / 2) - (requestTask.offsetHeight / 2) + 'px';
//       const leftRequestTask = (window.innerWidth / 2) - (requestTask.offsetWidth / 2) + 'px';
  
//       requestTask.style.top = topRequestTask;
//       requestTask.style.left = leftRequestTask;
//       const cards = document.querySelectorAll('.card');
//       const btnToast = document.querySelector('#btn-toast');
//       body.classList.add('stop-scrolling');
  
//       // a function to add or remove blur to background
//       function blur(property, cards) {
//         cards.forEach(element => {
//           if (property === 'add') {
//             element.classList.add('blur');
//           } if (property === 'remove') {
//             element.classList.remove('blur');
//           }
//         })
//       }
  
//       blur('add', cards);
  
//       btnToast.addEventListener('click', function() {
//         toast.classList.remove("show");
//         blur('remove', cards);
//         // requestTask.remove();
//         body.classList.remove('stop-scrolling');
  
//         // re-enable buttons after request form is closed
//         btnRequest.forEach(element => {
//           element.disabled = false;
//         });
//       })
//     }
//   })

// }

// render each task created by the employer
function renderTasks(dataHome, taskContainer) {
  dataHome.forEach(task => {

    const element = document.createElement('div');
    element.innerHTML = `<div class="card mb-3">
                          <div class="card-body">
                            <h5 id="task-name" class="card-title">${task.task}</h5>
                            <p id="task-amount"><strong>Amount: ${task.amount === 1 ? task.amount + ' worker' : task.amount + ' workers'}</strong></p>
                            <p id="task-description" class="card-text">${task.description}</p>
                            <button type="button" id="requestBtn" class="btn-request btn btn-primary">Request</button>
                          </div>
                        </div>
                        `;
    taskContainer.append(element);
  });
}

// render each requested workers requested by the employer
function renderRequestedTasks(tasks, viewRequested) {
  tasks.forEach(task => {
  const element = document.createElement('div');
  element.innerHTML = `<div class="card mb-3">
                          <div class="card-body">
                            <h5 id="task-name" class="card-title">${task.task}</h5>
                            <p id="task-amount"><strong>Amount: ${task.amount === 1 ? task.amount + ' worker' : task.amount + ' workers'}</strong></p>
                            <ul class="list-unstyled">
                              <li>${task.description}</li>
                                <ul>
                                  <li>Date: ${task.start_date} - ${task.end_date}</li>
                                  <li>Time: ${task.start_time} - ${task.end_time}</li>
                                </ul>
                              <li><small>Created: ${task.created}</small></li>
                            </ul>
                          
                            <button type="button" id="btnRequestedEdit" class="btn-request btn btn-primary">Edit</button>
                            <button type="button" class="btn btn-danger">Cancel</button>
                          </div>
                        </div>`;
  viewRequested.append(element);
})
}

// // load requested
// function requestedWorkers() {
//   const viewRequested = document.querySelector('#view-requested');
//   const info = document.querySelector('#info');
//   const accountId = info.dataset.accountid;

//   viewRequested.style.display = 'block';
//   document.querySelector('#tasks').style.display = 'none';

//   fetch(`/requested/${accountId}`)
//   .then(response => response.json())
//   .then(tasks => {
//     // Print email
//     console.log(tasks);


//     tasks.forEach(task => {
//       const element = document.createElement('div');
//       element.innerHTML = `<div class="card mb-3">
//                               <div class="card-body">
//                                 <h5 id="task-name" class="card-title">${task.task}</h5>
//                                 <p id="task-amount"><strong>Amount: ${task.amount === 1 ? task.amount + ' worker' : task.amount + ' workers'}</strong></p>
//                                 <ul class="list-unstyled">
//                                   <li>${task.description}</li>
//                                     <ul>
//                                       <li>Date: ${task.start_date} - ${task.end_date}</li>
//                                       <li>Time: ${task.start_time} - ${task.end_time}</li>
//                                     </ul>
//                                   <li><small>Created: ${task.created}</small></li>
//                                 </ul>
                              
//                                 <button type="button" id="btnRequestedEdit" class="btn-request btn btn-primary">Edit</button>
//                               </div>
//                             </div>`;
//       viewRequested.append(element);
//     })
    
//     // ... do something else with email ...
//   });
// }