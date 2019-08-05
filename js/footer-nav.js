'use strict';

const footerNav = document.querySelector('#navigation');
const headerNav = document.querySelector('.navbar-nav');
const navbar2 = document.querySelector('.navbar');

// SET ACTIVE LINK IN HEADER WHEN LINK CLICKED IN FOOTER
footerNav.addEventListener('click', function(event) {
  const target = event.target.closest('.navigation__link');

  if (!target) {
    return;
  }

  const href = target.getAttribute('href');
  const selector = '.nav-link[href="' + href + '"]';
  const navLink = headerNav.querySelector(selector);

  if (!navLink) {
    return;
  }

  const headerNavLinks = headerNav.querySelectorAll('.nav-link');
  for (let i = 0; i < headerNavLinks.length; i++) {
    headerNavLinks[i].classList.remove('nav-link--active');
  }

  navLink.classList.add('nav-link--active');

  if (href !== '#home') {
    setTimeout(function() {
      navbar.classList.add('hidden');
    }, 15);
  }
});
