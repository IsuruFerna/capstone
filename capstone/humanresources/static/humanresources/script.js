document.addEventListener('DOMContentLoaded', function() {
  // const btnDropdown = document.querySelector('.register');
  // const navListSub = document.querySelector('.nav-list-sub');
  
  // // dropdown menu: check every click event
  // document.addEventListener('click', function(event) {
  //   const targetElement = event.target.parentElement;

  //   if (btnDropdown.contains(targetElement)) {
  //     // console.log('dropdown', navListSub);

  //     // toggle visibility
  //     if (navListSub.classList.contains('visible')) {
  //       console.log('reading hide');
  //       navListSub.classList.remove('visible');
  //       navListSub.classList.add('invisible');
  //     } else {
  //       console.log('reading add');
  //       navListSub.classList.remove('invisible');
  //       navListSub.classList.add('visible');
  //     }
  //   } else {

  //     // if user click out of dropdown menu, hide it
  //     navListSub.classList.remove('visible');
  //     navListSub.classList.add('invisible');
  //   }
  // })
  const taskContainer = document.querySelector('#tasks');
  console.log("connected", taskContainer.dataset);
  console.log(taskContainer.dataset.account);

  // if this is a Employer account
  if (taskContainer.dataset.account === '3'){

    fetch('/tasks')
    .then(response => response.json())
    .then(tasks => {
        // Print tasks
        console.log(tasks);

        // render each task into the page
        tasks.forEach(task => {
  
          const element = document.createElement('div');
          element.innerHTML = `<div class="card mb-3">
                                <div class="card-body">
                                  <h5 class="card-title">${task.task}</h5>
                                  <p><strong>Amount: ${task.amount === 1 ? task.amount + ' worker' : task.amount + ' workers'}</strong></p>
                                  <p class="card-text">${task.description}</p>
                                  <a href="#" class="btn btn-primary">Button</a>
                                </div>
                              </div>
                              `;
          taskContainer.append(element);
        });


    });
  }


});