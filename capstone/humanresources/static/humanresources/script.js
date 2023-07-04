document.addEventListener('DOMContentLoaded', function() {
    
  const btnRequested = document.querySelector('#requested');
  const btnHome = document.querySelector('#home');

  console.log("this is home btn", btnHome);
  
  let fetchHomeData = false;
  let fetchRequestedWorkersData = false;
  let dataHome = null;

  // use buttons to toggle between views
  document.querySelector('#home').addEventListener('click', (e)=> {
    e.preventDefault();
    if (!fetchHomeData) {
      load_view('home', dataHome);
      fetchHomeData = true;
    }
    fetchRequestedWorkersData = false;
  });


  document.querySelector('#requested').addEventListener('click', (e)=> {
    e.preventDefault();
    if (!fetchRequestedWorkersData) {
      load_view('requested', dataHome);
      fetchRequestedWorkersData = true;
    }
    fetchHomeData = false;
  });
});

function load_view(view, dataHome) {

  // load home/index page
  if (view === 'home') {
    home(dataHome);
  } else if (view === 'requested') {
    requestedWorkers();
  }
}

// load home/index
function home(dataHome) {

  const taskContainer = document.querySelector('#tasks');
  
  // show task and hide others
  taskContainer.style.display = 'block';
  document.querySelector('#view-requested').style.display = 'none';


  if (dataHome === null) {

    // render each task into the page
    fetch('/tasks')
    .then(response => response.json())
    .then(tasks => {
      // Print tasks
      console.log(tasks);
      dataHome = tasks;

      renderTasks(dataHome, taskContainer);
    }); 

  } else {
    renderTasks(dataHome, taskContainer);
  }
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

// load requested
function requestedWorkers() {
  const viewRequested = document.querySelector('#view-requested');
  const info = document.querySelector('#info');
  const accountId = info.dataset.accountid;

  viewRequested.style.display = 'block';
  document.querySelector('#tasks').style.display = 'none';

  fetch(`/requested/${accountId}`)
  .then(response => response.json())
  .then(tasks => {
    // Print email
    console.log(tasks);


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
                              </div>
                            </div>`;
      viewRequested.append(element);
    })
    
    // ... do something else with email ...
  });
}