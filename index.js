const zone = document.querySelector('#drop-zone');
const input = document.querySelector('#file-input');
const iconWrap = document.querySelector('#icon-wrap');
const label = document.querySelector('#drop-label');

let storedImageSrc = null;

zone.addEventListener('click', () => input.click());

zone.addEventListener('dragover', e => {
  e.preventDefault();
  zone.style.borderColor = '#e8613a';
  zone.style.background = '#1a1635';
  iconWrap.style.transform = 'scale(1.1)';
});

zone.addEventListener('dragleave', () => {
  zone.style.borderColor = '#4a4870';
  zone.style.background = '#12112a';
  iconWrap.style.transform = 'scale(1)';
});

zone.addEventListener('drop', e => {
  e.preventDefault();
  zone.style.borderColor = '#4a4870';
  zone.style.background = '#12112a';
  iconWrap.style.transform = 'scale(1)';
  handleImage(e.dataTransfer.files[0]);
});

input.addEventListener('change', () => handleImage(input.files[0]));

function handleImage(file) {
  if (!file || !file.type.startsWith('image/')) return;

  if (storedImageSrc) URL.revokeObjectURL(storedImageSrc);
  storedImageSrc = URL.createObjectURL(file);

  iconWrap.innerHTML = `<img src="${storedImageSrc}" alt="avatar preview" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">`;
  
  label.innerHTML = `
    <button id="remove-btn" type="button">Remove image</button>
    <button id="change-btn" type="button">Change image</button>
  `;

  document.querySelector('#remove-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    URL.revokeObjectURL(storedImageSrc);
    storedImageSrc = null;
    iconWrap.innerHTML = `<img src="images/icon-upload.svg" alt="">`;
    label.innerHTML = 'Drag and drop or click to upload';
  });

  document.querySelector('#change-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    input.click();
  });
}

const popoverError = document.querySelector('#error');

function emailValidation(emailText) {
  const regex  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(emailText)) {
    console.log(regex.test(emailText));
    popoverError.textContent = 'email is invalid';
    popoverError.showPopover();
    return 0;
  }
  popoverError.hidePopover();
}

document.querySelector('#submit-btn').addEventListener('click', (e) => {
  e.preventDefault();
  if (!storedImageSrc) return;

  const name = document.querySelector('#fullName').value;
  const email = document.querySelector('#email').value;
  const github = document.querySelector('#github').value;

  if (emailValidation(email) === 0) return;

  const output = document.querySelector('main');
  output.innerHTML = `
    <img src="images/logo-full.svg" alt="">

    <h1 class="inconsolata-800">Congrats, <span>${name}!</span><br>
    Your ticket is ready.</h1>

    <h3 class="inconsolata-400" style="max-width: 45ch;">We've emailed your ticket to
    <span style="color: var(--orange-500);">${email}</span> and will send updates in the run up to the event.</h3>

    <section class="ticket">
      <div class="ticket-info">
        <div class="conf">
          <img src="images/logo-mark.svg" alt="">
          <div class="conf-details">
            <h2 class="inconsolata-700">Coding Conf</h2>
            <span class="inconsolata-400">Jan 31, 2025 / Austin, TX</span>
          </div>
        </div>

        <div class="attendee">
          <img src="${storedImageSrc}" alt="${name}">
          <strong id="attendee-name" class="inconsolata-500">${name}</strong>
          <span id="github-profile" class="inconsolata-400">@${github}</span>
        </div>
      </div>

      <div id="ticket-number" class="inconsolata-400">#01609</div>
    </section>
  `;

  URL.revokeObjectURL(storedImageSrc);
  storedImageSrc = null;
});