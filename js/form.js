'use strict';

const form = document.querySelector('#form');
const notification = document.querySelector('#notification');

const nameInput = form.querySelector('#name-input');
const emailInput = form.querySelector('#email-input');
const messageInput = form.querySelector('#message-input');
const inputs = [nameInput, emailInput, messageInput];

// SET FOCUS ON INPUT HOVER
form.addEventListener('mouseover', function(event) {
  const target = event.target;

  if (
    target == nameInput ||
    target == emailInput ||
    target == messageInput
  ) {
    target.focus();
  }
});

// FORM VALIDATION
form.addEventListener('submit', function(event) {
  event.preventDefault();

  resetValidity();

  let isFormInvalid = false

  for (let i = 0; i < inputs.length; i++) {
    let result = isInputValid(inputs[i]);
    isFormInvalid = isFormInvalid || !result;
  }

  if (isFormInvalid) {
    return;
  }

  makeRequest();
});

function resetValidity() {
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].classList.remove('input--invalid');
  }
}

function isInputValid(input) {
  return input.name === 'email'
    ? checkEmailValue(input)
    : checkTextValue(input);
}

function checkEmailValue(input) {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!(regex.test(input.value))) {
    markAsInvalid(input);
    return false;
  }

  return true;
}

function checkTextValue(input) {
  if (input.value === '') {
    markAsInvalid(input);
    return false;
  }

  return true;
}

function markAsInvalid(input) {
  input.classList.add('input--invalid');
}

function makeRequest() {
  $.ajax({
    type: 'post',
    url: 'https://echo.htmlacademy.ru',
    data: {
      userName: nameInput.value,
      email: emailInput.value,
      message: messageInput.value
    },
    success: function(response) {
      showNotification();
    }
  });
}

function showNotification() {
  hideForm();
  notification.style.display = 'block';
  restoreForm();
}

function hideForm() {
  form.style.display = 'none';
}

function restoreForm() {
  setTimeout(function() {
    notification.style.display = 'none';
    form.style.display = 'block';
  }, 5000);
}
