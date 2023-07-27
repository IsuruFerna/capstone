import * as pack from './pack.js';

document.addEventListener('DOMContentLoaded', function() {

  const contaninerArrangedTasks = document.querySelector('#view-arranged');
  pack.cancel_task(contaninerArrangedTasks, 'PUT');
})