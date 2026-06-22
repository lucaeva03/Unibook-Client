// Chiave usata per salvare i contatti in localStorage
const STORAGE_KEY = 'contactBook.contacts';

// URL dell'API esterna da cui scaricare i contatti iniziali
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Riferimenti agli elementi del DOM usati più volte
const contactsList = document.getElementById('contacts-list');
const loadingMessage = document.getElementById('loading-message');
const emptyMessage = document.getElementById('empty-message');
const contactForm = document.getElementById('contact-form');

// Legge i contatti salvati in localStorage, se esistono
function readContactsFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// Salva l'array di contatti in localStorage come stringa JSON
function saveContactsToStorage(contacts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

// Trasforma un utente grezzo dell'API in un contatto con la forma usata internamente
function normalizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    website: user.website,
    company: user.company ? user.company.name : '',
    catchphrase: user.company ? user.company.catchPhrase : '',
    bs: user.company ? user.company.bs : '',
  };
}

// Recupera i contatti: prima guarda in localStorage, altrimenti scarica dall'API
async function loadContacts() {
  const cached = readContactsFromStorage();

  if (cached) {
    renderContacts(cached);
    return;
  }

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Richiesta non riuscita');
    }

    const users = await response.json();
    const contacts = users.map(normalizeUser);

    saveContactsToStorage(contacts);
    renderContacts(contacts);
  } catch (error) {
    loadingMessage.textContent = 'Impossibile caricare i contatti. Riprova più tardi.';
  }
}

// Genera le iniziali di un nome per l'avatar
function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// Crea elemento per un singolo contatto
function createContactCard(contact) {
  const card = document.createElement('div');
  card.className = 'contact-card';
  card.dataset.id = contact.id;

  card.innerHTML = `
    <div class="contact-avatar">${getInitials(contact.name)}</div>

    <div class="contact-info">
      <h3 class="contact-name">
        ${contact.name}
        <span class="contact-username">@${contact.username}</span>
      </h3>
      <div class="contact-details">
        <span>${contact.email}</span>
        <span>${contact.phone}</span>
      </div>
    </div>

    <div class="contact-actions">
      ${contact.company ? `<span class="contact-chip">${contact.company}</span>` : ''}
      <button class="delete-button" title="Elimina contatto" data-action="delete">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
          <path d="M10 11v6M14 11v6"></path>
        </svg>
      </button>
    </div>
  `;

  return card;
}

// Disegna l'intera lista di contatti nel DOM
function renderContacts(contacts) {
  loadingMessage.hidden = true;
  contactsList.innerHTML = '';

  if (contacts.length === 0) {
    emptyMessage.hidden = false;
    return;
  }

  emptyMessage.hidden = true;

  contacts.forEach((contact) => {
    const card = createContactCard(contact);
    contactsList.appendChild(card);
  });
}

// Genera un nuovo id univoco basato sul massimo id esistente
function getNextId(contacts) {
  if (contacts.length === 0) {
    return 1;
  }

  const maxId = Math.max(...contacts.map((c) => c.id));
  return maxId + 1;
}

// Gestisce il submit del form: crea un nuovo contatto e lo salva
function handleFormSubmit(event) {
  event.preventDefault();

  const contacts = readContactsFromStorage() || [];

  const newContact = {
    id: getNextId(contacts),
    name: document.getElementById('name').value.trim(),
    username: document.getElementById('username').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    website: document.getElementById('website').value.trim(),
    company: document.getElementById('company').value.trim(),
    catchphrase: document.getElementById('catchphrase').value.trim(),
    bs: document.getElementById('bs').value.trim(),
  };

  contacts.push(newContact);
  saveContactsToStorage(contacts);
  renderContacts(contacts);

  contactForm.reset();
}

// Gestisce il click sul bottone elimina di un contatto
function handleListClick(event) {
  const deleteButton = event.target.closest('[data-action="delete"]');

  if (!deleteButton) {
    return;
  }

  const card = deleteButton.closest('.contact-card');
  const id = Number(card.dataset.id);

  const contacts = readContactsFromStorage() || [];
  const updatedContacts = contacts.filter((contact) => contact.id !== id);

  saveContactsToStorage(updatedContacts);
  renderContacts(updatedContacts);
}

// Collega gli eventi e avvia il caricamento iniziale
contactForm.addEventListener('submit', handleFormSubmit);
contactsList.addEventListener('click', handleListClick);

loadContacts();