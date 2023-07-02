document.addEventListener('DOMContentLoaded', function() {
    
  const taskContainer = document.querySelector('#tasks');

  // if this is a Employer account
  if (taskContainer.dataset.account === '3'){

    // render each task into the page
    fetch('/tasks')
    .then(response => response.json())
    .then(tasks => {
        // Print tasks
        console.log(tasks);

        tasks.forEach(task => {
  
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
    });

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
});