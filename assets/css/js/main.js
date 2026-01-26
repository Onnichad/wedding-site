// ====== Countdown (mets la date du mariage ici) ======
// Exemple: "2026-07-12T15:30:00"
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

function setExtraGuestsEnabled(enabled) {
  if (!extraGuests) return;
  extraGuests.disabled = !enabled;
  if (!enabled) extraGuests.value = 0;
  if (enabled && (!extraGuests.value || Number(extraGuests.value) < 1))
    extraGuests.value = 1;
}

function setBringingEnabled(enabled) {
  if (!bringingYes || !bringingNo) return;
  bringingYes.disabled = !enabled;
  bringingNo.disabled = !enabled;
  if (!enabled) {
    bringingNo.checked = true;
    setExtraGuestsEnabled(false);
  }
}

function sync() {
  const attending = document.querySelector(
    'input[name="attending"]:checked',
  )?.value;

  if (attending === 'no') {
    setBringingEnabled(false);
    setExtraGuestsEnabled(false);
    return;
  }

  setBringingEnabled(true);

  const bringing = document.querySelector(
    'input[name="bringingGuests"]:checked',
  )?.value;
  setExtraGuestsEnabled(bringing === 'yes');
  if (bringing === 'no' && extraGuests) extraGuests.value = 0;
}

attendingYes?.addEventListener('change', sync);
attendingNo?.addEventListener('change', sync);
bringingYes?.addEventListener('change', sync);
bringingNo?.addEventListener('change', sync);

// Valeurs initiales
if (extraGuests) {
  extraGuests.value = 0;
  setExtraGuestsEnabled(false);
}
