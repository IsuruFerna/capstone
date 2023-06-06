document.addEventListener('DOMContentLoaded', function() {
  const btnDropdown = document.querySelector('.register');
  const navListSub = document.querySelector('.nav-list-sub');
  
  // dropdown menu: check every click event
  document.addEventListener('click', function(event) {
    const targetElement = event.target.parentElement;

    if (btnDropdown.contains(targetElement)) {
      console.log('dropdown', navListSub);

      // toggle visibility
      if (navListSub.classList.contains('visible')) {
        console.log('reading hide');
        navListSub.classList.remove('visible');
        navListSub.classList.add('invisible');
      } else {
        console.log('reading add');
        navListSub.classList.remove('invisible');
        navListSub.classList.add('visible');
      }
    } else {

      // if user click out of dropdown menu, hide it
      navListSub.classList.remove('visible');
      navListSub.classList.add('invisible');
    }
  })

});