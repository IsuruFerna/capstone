import * as pack from './pack.js';

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#btn-arranged').classList.add('active');

  const contaninerArrangedTasks = document.querySelector('#view-arranged');
  pack.cancel_task(contaninerArrangedTasks, 'PUT');
})