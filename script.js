const form = document.querySelector('#rsvp-form');
const confirmation = document.querySelector('#confirmation');

const welcomeModal =
  document.querySelector('#welcome-modal');

const welcomeClose =
  document.querySelector('#welcome-close');

const thankYouScreen =
  document.querySelector('#thank-you-screen');

const thankYouName =
  document.querySelector('#thank-you-name');

const thankYouReturn =
  document.querySelector('#thank-you-return');


/* =====================================================
   OPENING INVITATION
===================================================== */

if (
  welcomeModal &&
  typeof welcomeModal.showModal === 'function'
) {
  welcomeModal.showModal();
}


welcomeClose?.addEventListener(
  'click',
  () => {
    welcomeModal.close();
  }
);


function showThankYou() {

  thankYouName.textContent =
    'Your reply has been received.';

  thankYouScreen.hidden = false;

  document.body.classList.add('thank-you-active');

  window.scrollTo(0, 0);

  thankYouReturn.focus();

}


thankYouReturn?.addEventListener(
  'click',
  () => {

    thankYouScreen.hidden = true;

    document.body.classList.remove('thank-you-active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

  }
);


/* =====================================================
   RSVP SUBMISSION
===================================================== */

form.addEventListener(
  'submit',
  async (event) => {

    event.preventDefault();


    const submitButton =
      form.querySelector('.submit');


    const response =
      Object.fromEntries(
        new FormData(form).entries()
      );


    response.submittedAt =
      new Date().toISOString();


    /* Make sure Google Sheet is connected */

    if (
      !window.RSVP_SHEET_ENDPOINT ||
      window.RSVP_SHEET_ENDPOINT.includes(
        'PASTE_YOUR'
      )
    ) {

      confirmation.textContent =
        'The RSVP sheet is not connected yet. Please ask the host to finish setup.';

      return;

    }


    /* Sending state */

    submitButton.disabled = true;

    submitButton.textContent =
      'Sending your note…';

    confirmation.textContent = '';


    try {

      await fetch(
        window.RSVP_SHEET_ENDPOINT,
        {

          method: 'POST',

          mode: 'no-cors',

          headers: {
            'Content-Type':
              'text/plain;charset=utf-8'
          },

          body:
            JSON.stringify(response)

        }
      );


      /* Success */

      form.reset();

      submitButton.disabled = false;

      submitButton.innerHTML =
        'Send my little note <span>→</span>';

      showThankYou();


    }

    catch (error) {

      console.error(
        'Could not submit RSVP:',
        error
      );


      confirmation.textContent =
        'I could not send your note. Please check your connection and try again.';


      submitButton.disabled = false;


      submitButton.textContent =
        'Send my little note →';

    }

  }
);
