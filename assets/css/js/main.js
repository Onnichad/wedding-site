// ====== Countdown (mets la date du mariage ici) ======
// Exemple: "2026-07-12T15:30:00-04:00"
const WEDDING_DATE_ISO = '2026-04-25T18:00:00-05:00';

function pad(n) {
  return String(n).padStart(2, '0');
}

function tick() {
  const dEl = document.getElementById('d');
  const hEl = document.getElementById('h');
  const mEl = document.getElementById('m');
  const sEl = document.getElementById('s');

  // Countdown seulement si les éléments existent sur la page
  if (!dEl || !hEl || !mEl || !sEl) return;

  const target = new Date(WEDDING_DATE_ISO);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (Number.isNaN(target.getTime()) || WEDDING_DATE_ISO.includes('[')) {
    dEl.textContent = '—';
    hEl.textContent = '—';
    mEl.textContent = '—';
    sEl.textContent = '—';
    return;
  }

  const total = Math.max(0, diff);
  const sec = Math.floor(total / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const secs = sec % 60;

  dEl.textContent = days;
  hEl.textContent = pad(hours);
  mEl.textContent = pad(mins);
  sEl.textContent = pad(secs);
}

setInterval(tick, 1000);
tick();
console.log('Wedding date:', WEDDING_DATE_ISO, new Date(WEDDING_DATE_ISO));

// ====== RSVP logic (désactive sections selon réponses) ======
document.addEventListener('DOMContentLoaded', () => {
  const attendingYes = document.querySelector(
    'input[name="attending"][value="yes"]',
  );
  const attendingNo = document.querySelector(
    'input[name="attending"][value="no"]',
  );

  const bringingYes = document.querySelector(
    'input[name="bringingGuests"][value="yes"]',
  );
  const bringingNo = document.querySelector(
    'input[name="bringingGuests"][value="no"]',
  );

  const extraGuests = document.querySelector('input[name="extraGuests"]');

  // Si on n'est pas sur la page RSVP, on sort proprement
  if (
    !attendingYes ||
    !attendingNo ||
    !bringingYes ||
    !bringingNo ||
    !extraGuests
  )
    return;

  function setExtraGuestsMode(mode) {
    // mode = "disabled0" | "enabledMin1"
    if (mode === 'disabled0') {
      extraGuests.min = '0';
      extraGuests.value = '0';
      extraGuests.readOnly = true; // meilleur que disabled (Netlify recevra la valeur)
      extraGuests.disabled = false; // on laisse activé pour que la valeur soit envoyée
      return;
    }

    // enabledMin1
    extraGuests.readOnly = false;
    extraGuests.min = '1';
    if (!extraGuests.value || Number(extraGuests.value) < 1) {
      extraGuests.value = '1';
    }
  }

  function setBringingEnabled(enabled) {
    bringingYes.disabled = !enabled;
    bringingNo.disabled = !enabled;

    if (!enabled) {
      bringingNo.checked = true;
      setExtraGuestsMode('disabled0');
    }
  }

  function sync() {
    const attending = document.querySelector(
      'input[name="attending"]:checked',
    )?.value;

    // Si "No" -> on force bringing = no et extraGuests = 0
    if (attending === 'no') {
      setBringingEnabled(false);
      setExtraGuestsMode('disabled0');
      return;
    }

    // Sinon (attending yes) -> bringing activé
    setBringingEnabled(true);

    const bringing = document.querySelector(
      'input[name="bringingGuests"]:checked',
    )?.value;

    if (bringing === 'yes') {
      setExtraGuestsMode('enabledMin1');
    } else {
      // bringing = no (ou pas encore choisi)
      setExtraGuestsMode('disabled0');
    }
  }

  attendingYes.addEventListener('change', sync);
  attendingNo.addEventListener('change', sync);
  bringingYes.addEventListener('change', sync);
  bringingNo.addEventListener('change', sync);

  // Init
  // Valeurs propres au chargement : extraGuests à 0 tant qu'on n'a pas yes+yes
  setExtraGuestsMode('disabled0');
  sync();
});
