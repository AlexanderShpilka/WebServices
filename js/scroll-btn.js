'use strict';

const scrollBtn = document.querySelector('.scroll__link');
const href = scrollBtn.getAttribute('href');

scrollBtn.addEventListener('click', function() {
  const headerNav = document.querySelector('.navbar-nav');

  const selector = '.nav-link[href="' + href + '"]';
  const navLink = headerNav.querySelector(selector);

  const navLinks = headerNav.querySelectorAll('.nav-link');
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].classList.remove('nav-link--active');
  }

  navLink.classList.add('nav-link--active');
});
