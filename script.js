const form = document.querySelector('#rsvp-form');
const confirmation = document.querySelector('#confirmation');

const welcomeModal =
  document.querySelector('#welcome-modal');

const welcomeClose =
  document.querySelector('#welcome-close');


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


      confirmation.textContent =
        `Thank you, ${response.name}. Your seat is noted ♡`;


      submitButton.textContent =
        'Note sent — thank you ♡';


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
