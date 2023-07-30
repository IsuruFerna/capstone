// use strict version to load everything after the loding of DOM

const account = parseInt(document.querySelector('#profile').dataset.account);

document.addEventListener('DOMContentLoaded', ()=> {
  activeButton();

  // when user clicked on forgot password show them instructions via alert
  const alertPasswordForgot = document.querySelector('#password-reset-req');
  alertPasswordForgot.style.display = 'none';

  document.querySelector('#link-forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    alertPasswordForgot.style.display = 'block';
    document.querySelector('#conataner-form-login').classList.remove('container-form-login-top');
  })
})

// highlight the clicked button on the nav
function activeButton() {
  const navLink = document.querySelectorAll('.nav-link');
  console.log(navLink);

  navLink.forEach(e => {
    e.addEventListener('click', () => {
      console.log(e);
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


// // this function prevent default when click on an anchor on the nav and using the 'dataFetch' load the page via API
// function load_view(view, e) {
//   e.preventDefault();
//   dataFetch(view);
// }

// // fetch data for Employer 
// function dataFetch(input) {
 
//   const containerCreatedTasks = document.querySelector('#tasks');
//   const containerRequestedTasks = document.querySelector('#view-requested');
//   const formWorkArrange = document.querySelector('#form-work-arrange');

//   if (input !== 'created') {
//     document.querySelector('#home').classList.remove('disabled');
//   }

//   if (input === 'work-arrange') {

//     containerCreatedTasks.style.display = 'none';
//     containerRequestedTasks.style.display = 'none';
//     formWorkArrange.style.display = 'block';
//   }

//   // if the global variables are null, then fetch data
//   if (!dataCreatedTasks || !dataRequestedTasks && input !== 'work-arrange') {
//     fetch(`tasks/${input}`)
//     .then(response => response.json())
//     .then(tasks => {

//       // storing fetched data to global variables to avoid duplications
//       if (input === 'created') {
//         dataCreatedTasks = tasks;

//         // render each task and set visibility
//         renderTasks(dataCreatedTasks, containerCreatedTasks);
//         containerCreatedTasks.style.display = 'block';
//         containerRequestedTasks.style.display = 'none';
//         formWorkArrange.style.display = 'none';

//         // once click on 'request button' a form appears to request workers
//         requestTask(containerCreatedTasks);

//       } else if (input === 'requested') {
//         dataRequestedTasks = tasks;

//         // render requested tasks and set visibility
//         renderRequestedTasks(dataRequestedTasks, containerRequestedTasks);
//         containerCreatedTasks.style.display = 'none';
//         containerRequestedTasks.style.display = 'block';
//         formWorkArrange.style.display = 'none';
//       } 
//     })
//   }

//   // if global variables contains data set display visibility without re-fetching data
//   if (dataCreatedTasks && input === 'created') {
//     containerCreatedTasks.style.display = 'block';
//     containerRequestedTasks.style.display = 'none';
//     formWorkArrange.style.display = 'none';

//   } else if (dataRequestedTasks && input === 'requested') {
//     containerCreatedTasks.style.display = 'none';
//     containerRequestedTasks.style.display = 'block';
//     formWorkArrange.style.display = 'none';

//   } 
// }



export {account, cancel_task, activeButton}