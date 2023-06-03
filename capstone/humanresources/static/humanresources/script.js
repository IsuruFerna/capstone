document.addEventListener('DOMContentLoaded', function() {
  const btnDropdown = document.querySelector('.register');
  const navListSub = document.querySelector('.nav-list-sub');

  // dropdown menu visibility
  btnDropdown.addEventListener('click', function() {

      // toggle visibility
      if (navListSub.classList.contains('visible')) {
        navListSub.classList.remove('visible');
        navListSub.classList.add('invisible');
      } else {
        navListSub.classList.remove('invisible');
        navListSub.classList.add('visible');
      }
  })
});