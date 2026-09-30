const form = document.querySelector('#rsvp-form');
const confirmation = document.querySelector('#confirmation');
const welcomeModal = document.querySelector('#welcome-modal');
const welcomeClose = document.querySelector('#welcome-close');

welcomeModal.showModal();
welcomeClose.addEventListener('click', () => welcomeModal.close());

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = form.querySelector('.submit');
  const response = Object.fromEntries(new FormData(form).entries());
  const dates = [...form.querySelectorAll('input[name="dates"]:checked')].map((input) => input.value);
  response.dates = dates;
  response.submittedAt = new Date().toISOString();

  if (!window.RSVP_SHEET_ENDPOINT || window.RSVP_SHEET_ENDPOINT.includes('PASTE_YOUR')) {
    confirmation.textContent = 'The RSVP sheet is not connected yet. Please ask the host to finish setup.';
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Sending your note…';
  confirmation.textContent = '';

  try {
    // text/plain keeps this a simple request, which a Google Apps Script web app
    // can receive directly from this Vercel site.
    await fetch(window.RSVP_SHEET_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(response),
    });

    form.reset();
    confirmation.textContent = `Thank you, ${response.name}. Your note has been sent to the host ♡`;
    submitButton.textContent = 'Note sent — thank you ♡';
  } catch (error) {
    console.error('Could not submit RSVP:', error);
    confirmation.textContent = 'We could not send your note. Please check your connection and try again.';
    submitButton.disabled = false;
    submitButton.textContent = 'Send my little note →';
  }
});
