// use strict version to load everything after the loding of DOM

let account = parseInt(document.querySelector('#profile').dataset.account);

document.addEventListener('DOMContentLoaded', ()=> {
  activeButton();

  // Available on Login page
  // when user clicked on forgot password show them instructions via alert
  const alertPasswordForgot = document.querySelector('#password-reset-req');
  if (alertPasswordForgot) {
    alertPasswordForgot.style.display = 'none';

    document.querySelector('#link-forgot-password').addEventListener('click', function(e) {
      e.preventDefault();
      alertPasswordForgot.style.display = 'block';
      document.querySelector('#conataner-form-login').classList.remove('container-form-login-top');
    })
  }

})

// highlight the clicked button on the nav
function activeButton() {
  const navLink = document.querySelectorAll('.nav-link');

  navLink.forEach(e => {
    e.addEventListener('click', () => {
      console.log("this is clicked nav btn", e);
      e.classList.add('active');
    })
  })
}

// i must optimize code removing repetition
// after the cancelation re-fetch data via main functions instead of using re-directing pages to index
// cancel task or delete task
function cancel_task(containerRequestedTasks, action) {
  containerRequestedTasks.addEventListener('click', event => {
    if(event.target.matches('#btnCancleRequest')) {

      const parentElement = event.target.parentElement;
      const taskId = parentElement.querySelector('#task-id').textContent;
      
      // fetch data to delete the following task
      if(action === 'DELETE') {
        fetch(`/cancel-workarrange/${taskId}`, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
  
          console.log(result);
          // dataFetch('requested');
          // redirecting to the index
          // need to modify here
          window.location.href = '/';
        })
      
      // cancel arranged task
      } else if (action === 'PUT') {
        fetch(`/cancel-workarrange/${taskId}`, {
          method: 'PUT',
          body: JSON.stringify({
            filled: false
          })
        })
        .then(response => response.json())
        .then(result => {
          
          console.log(result);
          window.location.href = '/';
        })
      
      // cancel created task
      } else if (action === 'DELETE-task') {
        console.log('clicked on cancel task button');
        fetch(`/cancel-task/${taskId}`, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {

          console.log(result);
          window.location.href = '/';
        })
      }
    };
  })
}

export {account, cancel_task, activeButton}