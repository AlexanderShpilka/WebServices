'use strict';

const MAX_MOBILE_WIDTH = 767;

const navbarToggler = document.querySelector('.navbar-toggler');
const navbar = document.querySelector('.navbar');

// OPEN/CLOSE NAV MENU ON MOBILE
navbarToggler.addEventListener('click', function() {
  navbar.classList.toggle('navbar--open');
  document.body.classList.toggle('ov-y-hidden');
});

// SHOW-HIDE NAVBAR ON SCROLL
let prevScrollpos = window.pageYOffset;

window.addEventListener('scroll', function() {
  const currentScrollPos = window.pageYOffset;

  if (prevScrollpos > currentScrollPos) {
    navbar.classList.remove('hidden');
  } else {
    navbar.classList.add('hidden');
  }
  prevScrollpos = currentScrollPos;
});

// CLOSE MENU ON LINK CLICK (MOBILE WIDTH ONLY)
const navbarNav = document.querySelector('.navbar-nav');

navbarNav.addEventListener('click', function(event) {
  const target = event.target.closest('.nav-link');

  if (!target) {
    return;
  }

  if (document.documentElement.clientWidth <= MAX_MOBILE_WIDTH) {
    navbarToggler.click();
  }
});

// SET ACTIVE NAV LINK
navbarNav.addEventListener('click', function(event) {
  const target = event.target.closest('.nav-link');

  if (!target) {
    return;
  }

  if (target.classList.contains('nav-link--active')) {
    return;
  }

  const navLinks = document.querySelectorAll('.nav-link');
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].classList.remove('nav-link--active');
  }

  target.classList.add('nav-link--active');

  if (target.getAttribute('href') !== '#home') {
    setTimeout(function() {
      navbar.classList.add('hidden');
    }, 45);
  }
});
