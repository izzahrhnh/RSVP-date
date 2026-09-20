const form = document.querySelector('#rsvp-form');
const confirmation = document.querySelector('#confirmation');
const welcomeModal = document.querySelector('#welcome-modal');
const welcomeClose = document.querySelector('#welcome-close');

welcomeModal.showModal();
welcomeClose.addEventListener('click', () => welcomeModal.close());

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const response = Object.fromEntries(new FormData(form).entries());
  const dates = [...form.querySelectorAll('input[name="dates"]:checked')].map((input) => input.value);
  response.dates = dates;
  response.submittedAt = new Date().toISOString();

  localStorage.setItem('petals-and-plates-rsvp', JSON.stringify(response));
  confirmation.textContent = `Thank you, ${response.name}. Your note has been saved on this device ♡`;
  form.querySelector('.submit').textContent = 'Note sent — thank you ♡';
});
