document.addEventListener('DOMContentLoaded', function() {
    
  const btnRequested = document.querySelector('#requested');
  // const btnHome = document.querySelector('#home');

  // console.log("this is home btn", btnHome);
  
  let fetchHomeData = false;
  let fetchRequestedWorkersData = false;
  let dataHome = null;

  // use buttons to toggle between views
  const btnHome =  document.querySelector('#home');
  btnHome.addEventListener('click', ()=> load_view('created'));
  document.querySelector('#requested').addEventListener('click', ()=> load_view('requested'));

  console.log('befoer', dataCreatedTasks);

  load_view('created');
  // btnHome.removeAttribute('href');
  console.log("after", dataCreatedTasks);
  btnHome.classList.add('disabled');




//   document.querySelector('#requested').addEventListener('click', (e)=> {
//     e.preventDefault();
//     if (!fetchRequestedWorkersData) {
//       load_view('requested', dataHome);
//       fetchRequestedWorkersData = true;
//     }
//     fetchHomeData = false;
//   });
});

// for testing
function load_view(view) {
  dataFetch(view);
}

// use global variables to store fetch data to avoid duplications
let dataCreatedTasks = null;
let dataRequestedTasks = null;

function dataFetch(input) {
  const containerCreatedTasks = document.querySelector('#tasks');
  const containerRequestedTasks = document.querySelector('#view-requested');
  
  if (input !== 'created') {
    document.querySelector('#home').classList.remove('disabled');
  }


  // if the global variables are null, then fetch data
  if (!dataCreatedTasks || !dataRequestedTasks) {
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

        // once click on 'request button' a form appears to request workers
        requestTask(containerCreatedTasks);

      } else if (input === 'requested') {
        dataRequestedTasks = tasks;
        containerCreatedTasks.style.display = 'none';
        containerRequestedTasks.style.display = 'block';
      }
    })
  }

  // if global variables contains data set display visibility without re-fetching data
  if (dataCreatedTasks && input === 'created') {
    containerCreatedTasks.style.display = 'block';
    containerRequestedTasks.style.display = 'none';
  } else if (dataRequestedTasks && input === 'requested') {
    containerCreatedTasks.style.display = 'none';
    containerRequestedTasks.style.display = 'block';
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