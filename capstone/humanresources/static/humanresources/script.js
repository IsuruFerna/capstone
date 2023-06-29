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
                                  <button type="button" id="requestBtn" class="btn-request btn btn-primary">not-1</button>
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
        const requestTask = document.createElement('div');

        // getting values of clicked request
        const taskName = parentElement.querySelector('#task-name').innerHTML;
        const taskDescription = parentElement.querySelector('#task-description').innerHTML;
        const taskAmount = parentElement.querySelector('#task-amount').textContent.replace(/\D/g, "");

        // making a form to request workers including extracted values from the clicked request
        requestTask.style.position = 'absolute';
        requestTask.innerHTML = `<!-- Flexbox container for aligning the toasts -->
        <div aria-live="polite" aria-atomic="true" class="d-flex justify-content-center align-items-center w-100">
        
          <!-- Then put toasts within -->
          <div id="toast" class="toast show form-request" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
              <strong class="me-auto">${ taskName }</strong>
              <button type="button" id="btn-toast" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              <form method="post">
                <div class="mb-3">
                  <label for="form-request-amount" class="form-label">Amount of Workers</label>
                  <input type="number" class="form-control" id="form-request-amount" required value="${ taskAmount }" min="1">
                </div>

                <div class="mb-3">
                  <label for="form-request-startdate" class="form-label">Start date</label>
                  <input type="date" class="form-control" id="form-request-startdate" required>
                </div>

                <div class="mb-3">
                  <label for="form-request-enddate" class="form-label">End date</label>
                  <input type="date" class="form-control" id="form-request-enddate" required>
                </div>

                <div class="mb-3">
                  <label for="form-request-starttime" class="form-label">Start Time</label>
                  <input type="time" class="form-control" id="form-request-starttime" required>
                </div>

                <div class="mb-3">
                  <label for="form-request-endtime" class="form-label">End Time</label>
                  <input type="time" class="form-control" id="form-request-endtime" required>
                </div>

                <div class="mb-3">
                  <label for="form-request-description" class="form-label">Description</label>
                  <textarea class="form-control" id="form-request-description" rows="3" required>${ taskDescription }</textarea>
                </div>
                <button class="btn btn-primary" type="submit">Request</button>
              </form>
            </div>
          </div>
        </div>`;
        const body = document.querySelector('body');
        body.append(requestTask);
        
        // disable each button when request form is appears
        const btnRequest = document.querySelectorAll('.btn-request');
        btnRequest.forEach(element => {
          element.disabled = true;
        });
        
        // applying style to make center the form and disable scroll
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
          // toast.classList.remove("show");
          blur('remove', cards);
          requestTask.remove();
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