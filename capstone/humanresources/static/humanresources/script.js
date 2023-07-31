import * as pack from './pack.js';

document.addEventListener('DOMContentLoaded', function() {

  // getting the account type
  // const account = parseInt(document.querySelector('#profile').dataset.account);
  const account = pack.account;

  console.log("this is account type", account);

  // Employer account
  if (account === 3) {
    // document.querySelector('#btn-worker-connect').style.display = 'none';

    // use buttons to toggle between views
    const btnHome =  document.querySelector('#home');
    btnHome.addEventListener('click', e => load_view('created', e));
    document.querySelector('#requested').addEventListener('click', e => load_view('requested', e));
    document.querySelector('#work-arrange').addEventListener('click', e => load_view('work-arrange', e));
  
    // render home as default
    dataFetch('created');
    // load_view('created');
  
    // disable home anchor on the nav when page is loaded as default
    // btnHome.removeAttribute('href');
    btnHome.classList.add('disabled', 'active');


  } else if (account === 2) {
    // Employee account

    // render available works for accept
    const viewEmployee = document.querySelector('#view-employee');
    const viewEmployerDetails = document.querySelector('#view-employer-details');
    viewEmployee.style.display = 'block';
    viewEmployerDetails.style.display = 'none';

    fetch(`/worker`)
    .then(response => response.json())
    .then(works => {
      works.forEach(work => {
        console.log("create div");
        
        const element = document.createElement('div');
        element.innerHTML = `<div class="card mb-3">
                                <div class="card-body">
                                  <div class="card-title d-flex justify-content-start">
                                    <h5 id="card-employee" class="text-capitalize fw-bold">${work.employer} <span id="card-zone" class="align-bottom fw-normal fs-6">${work.task}</span></h5>
                                  </div>
                                  <p id="task-amount"><strong>Amount: ${work.amount === 1 ? work.amount + ' worker' : work.amount + ' workers'}</strong></p>
                                  <ul class="list-unstyled">
                                    <li>${work.description}</li>
                                      <ul>
                                        <li>Date: ${work.start_date} - ${work.end_date}</li>
                                        <li>Time: ${work.start_time} - ${work.end_time}</li>
                                      </ul>
                                    <li class="list-skip"></li>
                                    <li class="fw-semibold">Employer Details</li>
                                      <ul class="text-capitalize">
                                        <li>Address: ${work.employer_address}</li>
                                        <li>City: ${work.employer_city}</li>
                                        <li>Zip: ${work.employer_zip}</li>
                                      </ul>
                                    <li class="list-skip"></li>
                                    <li id="card-created"><small>Created: ${work.created}</small></li>
                                  </ul>
                                  <p id="requested-task-id" hidden>${work.id}</p>
                                
                                </div>
                              </div>`;
        viewEmployee.append(element);
      })
    })

    // console.log(viewEmployee.innerHTML);
    // notify the user if them haven't assigend to any work by rendering a message
    if (!viewEmployee.innerHTML) {
      console.log("You haven't been asigned to any work yet!");
      viewEmployee.innerHTML = `<div class="alert alert-warning" role="alert">You haven't been asigned to any work yet!</div>`;
    }
      
 
  } else {
    // Main account

    // load default page
    load_view_main('requestedWorker');

    const dashboard = document.querySelector('#dashboard');
    dashboard.addEventListener('click', e => load_view_main('requestedWorker', e));

    // avoid loading multiple fetched data disable dashboard button
    dashboard.classList.add('disabled', 'active');

    // arrange works by connecting available users to the task
    const taskContainer = document.querySelector('#view-dashboard');
    let dataTaskContainer = false;

    // notify user if there arn't any requested worker by any employer
    // if (!taskContainer.innerHTML) {
    //   taskContainer.innerHTML = `<div class="alert alert-warning" role="alert">There arn't any requested workers by any employer!</div>`;
    // }

    taskContainer.addEventListener('click', event => {
      if (event.target.matches('#btnArrange')) {
    
        const parentElement = event.target.parentElement;
        const requestedTaskId = parentElement.querySelector('#requested-task-id').textContent;
        const viewAvailableWorkers = document.querySelector('#view-available-workers');
        console.log("id", requestedTaskId);

        if (!dataTaskContainer) {

          // set visibility
          taskContainer.style.display = 'none';
          document.querySelector('#view-workArrange').style.display = 'block';
  
          // const parentElement = event.target.parentElement;
          // const requestedTaskId = parentElement.querySelector('#requested-task-id').textContent;
  
          // disable arrange button and insert the clicked parent element into page(left side)
          parentElement.querySelector('#btnArrange').style.display = 'none';
          const viewArrangeInfo = document.querySelector('#view-workArrange-info');
          // const viewAvailableWorkers = document.querySelector('#view-available-workers');
          viewArrangeInfo.append(parentElement);
          viewArrangeInfo.style.marginTop = '5%';
  
          // getting available workers and setting right side of the page
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

            const btnWorkerConnect = document.querySelector('#btn-worker-connect');

            // if there arn't available workers show a warning message
            if (viewAvailableWorkers.querySelectorAll('.list-group').length === 0) {
              
              btnWorkerConnect.style.display = 'none';
              viewAvailableWorkers.parentElement.style.position = 'relative';
              viewAvailableWorkers.innerHTML = `<div class="alert alert-warning" role="alert">There arn't available workers!</div>`;
              // viewAvailableWorkers.classList.add('not-available');

            } else {
              btnWorkerConnect.style.display = 'block';
            }
            
          })
          dataTaskContainer = true;
        } else {
          // set visibility
          taskContainer.style.display = 'none';
          document.querySelector('#view-workArrange').style.display = 'block';
        }
            
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

          fetch(`workers/${requestedTaskId}`, {
            method: 'POST',
            body: JSON.stringify({
              workers: workerIds
            })
          })
          .then(response => response.json())
          .then(result => {
            // print result
            // load newly available workers or to index page
            console.log(result);

            // go back to the default page
            load_view_main('requestedWorker');
          })
        })
      }
    })
  };
  
  pack.activeButton();
});

// use global variables to store fetch data to avoid duplications
let dataCreatedTasks = null;
let dataRequestedTasks = null;
let dataRequestedWorkers = null;

// Main account dashboard
function load_view_main(view, e) {
  if (e) {
    e.preventDefault();
    e.target.classList.add('active');
  }
  const viewDashboard = document.querySelector('#view-dashboard');

  if (view === 'requestedWorker' && !dataRequestedWorkers) {
    const btnWorkerConnect = document.querySelector('#btn-worker-connect');
    if (btnWorkerConnect) {
      btnWorkerConnect.style.display = 'none';
    }

    // render requested workers by employers
    fetch(`task/${view}`)
    .then(response => response.json())
    .then(tasks => {
      dataRequestedWorkers = tasks
      renderRequestedWorkers(dataRequestedWorkers, viewDashboard);
    })

  } else if (view === 'requestedWorker' && dataRequestedWorkers) {


    viewDashboard.style.display = 'block';
    document.querySelector('#view-workArrange').style.display = 'none';
    document.querySelector('#testing').style.display = 'none';
  }

  console.log("this is view dashboard", viewDashboard.innerHTML);

  // // notify user if there arn't any requested worker by any employer
  // if (!viewDashboard.querySelector('div')) {
  //   viewDashboard.innerHTML = `<div class="alert alert-warning" role="alert">There arn't any requested workers by any employer!</div>`;
  // }
}



// this function prevent default when click on an anchor on the nav and using the 'dataFetch' load the page via API
function load_view(view, e) {
  e.preventDefault();
  e.target.classList.add('active');
  console.log(e.target);
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

  // change the view
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

        // once clicked on 'cancel button' cancel/delete the task
        pack.cancel_task(containerCreatedTasks, 'DELETE-task');

        // if there isn't any task notify user by rendering this message
        if (dataCreatedTasks.length === 0) {
          containerCreatedTasks.innerHTML = `<div class="alert alert-warning" role="alert">There arn't any created task! Click on Work Arrange to create tasks</div>`;
        }

      } else if (input === 'requested') {
        dataRequestedTasks = tasks;

        // render requested tasks and set visibility
        renderRequestedTasks(dataRequestedTasks, containerRequestedTasks);
        containerCreatedTasks.style.display = 'none';
        containerRequestedTasks.style.display = 'block';
        formWorkArrange.style.display = 'none';
        
        // if there isn't any task notify user by rendering this message
        if (dataRequestedTasks.length === 0) {
          containerRequestedTasks.innerHTML = `<div class="alert alert-warning" role="alert">There arn't any requested workers! Click on Home to request workers</div>`;
        }

        // cancel button
        pack.cancel_task(containerRequestedTasks, 'DELETE');
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

// // cancel task 
// function cancel_task(containerRequestedTasks) {
//   containerRequestedTasks.addEventListener('click', event => {
//     if(event.target.matches('#btnCancleRequest')) {

//       const parentElement = event.target.parentElement;
//       const taskId = parentElement.querySelector('#task-id').textContent;
      
//       // fetch data to delete the following task
//       fetch(`/cancel/${taskId}`, {
//         method: 'DELETE'
//       })
//       .then(response => response.json())
//       .then(result => {

//         console.log(result);
//         // dataFetch('requested');
//         // redirecting to the index
//         // need to modify here
//         window.location.href = '/';
//       })
//     };
//   })
// }

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

// render each task created by the employer
function renderTasks(dataHome, taskContainer) {
  dataHome.forEach(task => {

    const element = document.createElement('div');
    element.innerHTML = `<div class="card mb-3">
                          <div class="card-body">
                            <h5 id="task-name" class="card-title">${task.task}</h5>
                            <p id="task-amount"><strong>Amount: ${task.amount === 1 ? task.amount + ' worker' : task.amount + ' workers'}</strong></p>
                            <p id="task-description" class="card-text">${task.description}</p>
                            <p id="task-id" hidden>${task.id}</p>
                            <button type="button" id="requestBtn" class="btn-request btn btn-primary">Request</button>
                            <button type="button" id="btnCancleRequest" class="btn-request btn btn-outline-danger">Cancel</button>
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

                            <p id="task-id" hidden>${task.id}</p>
                          
                            <button type="button" id="btnCancleRequest" class="btn btn-danger">Cancel</button>
                          </div>
                        </div>`;
  viewRequested.append(element);
})
}

// render each requested worker in main account dashboard
function renderRequestedWorkers(dataRequestedWorkers, viewDashboard) {
  dataRequestedWorkers.forEach(task => {
    const element = document.createElement('div');
    element.innerHTML = `<div id="testing" class="card mb-3">
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
}
