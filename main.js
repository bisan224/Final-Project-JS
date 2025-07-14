//  נור צובח 214459463
// ביסאם פרח 211861208
"use strict";

// משתנים לקישור לאלמנטים מה-DOM
const listEl = document.getElementById("contactsList");
const contactCountEl = document.querySelector(".contact-count");
const searchInput = document.getElementById("searchInput");
const addBtn = document.getElementById("addBtn");
const effectBtn = document.getElementById("effectBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");

const popupOverlay = document.getElementById("popupOverlay");
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("nameInput");
const phoneInput = document.getElementById("phoneInput");
const emailInput = document.getElementById("emailInput");
const addressInput = document.getElementById("addressInput");
const notesInput = document.getElementById("notesInput");
const tagsInput = document.getElementById("tagsInput");
const favoriteInput = document.getElementById("favoriteInput");
const imageInput = document.getElementById("imageInput");
const cancelBtn = document.getElementById("cancelBtn");

const infoOverlay = document.getElementById("infoOverlay");
const infoContent = document.getElementById("infoContent");

// מערך נתונים התחלתי של אנשי קשר
let contactsArr = [
  {
    id: generateID(),
    name: "Roni",
    phone: "0525252525",
    email: "Roni@gmail.com",
    address: "Haifa",
    notes: "",
    tags: "Coworker",
    favorite: false,
    image: "./images/Roni.png",
  },
  {
    id: generateID(),
    name: "Kai",
    phone: "0585858585",
    email: "Kai@gmail.com",
    address: "Tel-Aviv",
    notes: "",
    tags: "Client",
    favorite: false,
    image: "./images/Kai.png",
  },
  {
    id: generateID(),
    name: "Lisa Rosy",
    phone: "0549123126",
    email: "LisaRosy@gmail.com",
    address: "Haifa",
    notes: "",
    tags: "Coworker",
    favorite: true,
    image: "./images/Lisa.webp",
  },
  {
    id: generateID(),
    name: "Barbara Rosy",
    phone: "0549123126",
    email: "BarbaraR@gmail.com",
    address: "Haifa",
    notes: "Lisa's cousin",
    tags: "Client",
    favorite: false,
    image: "./images/barbara.webp",
  },
  {
    id: generateID(),
    name: "David",
    phone: "0528412329",
    email: "David@gmail.com",
    address: "Tel-Aviv",
    notes: "",
    tags: "Client",
    favorite: false,
    image: "./images/David.png",
  },
];

let editingId = null; // מזהה עריכה של איש קשר

// פונקציה שמציגה את רשימת אנשי הקשר במסך
function renderContacts() {
  listEl.innerHTML = ""; // איפוס תוכן קודם
  const searchValue = searchInput.value.toLowerCase();

  let filtered = contactsArr.filter(
    (c) =>
      c.name.toLowerCase().includes(searchValue) ||
      (c.tags && c.tags.toLowerCase().includes(searchValue))
  );

  filtered.sort((a, b) => b.favorite - a.favorite); // מיון לפי מועדפים

  contactCountEl.textContent = `${filtered.length} contacts`;

  for (let c of filtered) {
    const li = document.createElement("li");
    li.className = "contact-card";
    li.innerHTML = `
        <img src="${c.image || "/images/default.webp"}" alt="Avatar" " class>
          <div class="contact-info">
            <h3>${c.name}</h3>
            <p>${c.phone}</p>
          </div>
        <div class="contact-actions">
          <button onclick="showInfo('${c.id}')">ℹ️</button>
          <button onclick="editContact('${c.id}')">📝</button>
          <button onclick="deleteContact('${c.id}')">🗑️</button>
          <button onclick="toggleFavorite('${c.id}')">${
      c.favorite ? "⭐" : "☆"
    }</button>
        </div>
      `;
    listEl.appendChild(li);
  }
}

// פונקציה שמחזירה מזהה ייחודי
function generateID() {
  return Date.now().toString() + Math.random().toString(36).slice(2);
}

// איפוס הטופס לערך ריק
function resetForm() {
  contactForm.reset();
  editingId = null;
  imageInput.value = "";
}

// שליחה/שמירה של הטופס
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const file = imageInput.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const newContact = {
      id: editingId || generateID(),
      name: nameInput.value,
      phone: phoneInput.value,
      email: emailInput.value,
      address: addressInput.value,
      notes: notesInput.value,
      tags: tagsInput.value,
      favorite: favoriteInput.checked,
      image: file
        ? reader.result
        : editingId
        ? contactsArr.find((c) => c.id === editingId).image
        : null,
    };

    if (editingId) {
      contactsArr = contactsArr.map((c) =>
        c.id === editingId ? newContact : c
      );
    } else {
      contactsArr.push(newContact);
    }

    renderContacts();
    popupOverlay.classList.remove("show");
    resetForm();
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload();
});

// פתיחת טופס הוספה
addBtn.addEventListener("click", () => {
  resetForm();
  popupOverlay.classList.add("show");
});

// ביטול טופס
cancelBtn.addEventListener("click", () => {
  popupOverlay.classList.remove("show");
});

// סינון תוך כדי הקלדה
searchInput.addEventListener("input", renderContacts);

// מחיקת כל אנשי הקשר
deleteAllBtn.addEventListener("click", () => {
  if (confirm("Delete all contacts?")) {
    contactsArr = [];
    renderContacts();
  }
});

// מעבר למצב לילה
effectBtn.addEventListener("click", () => {
  document.body.classList.toggle("night");
});

// מחיקת איש קשר בודד
function deleteContact(id) {
  contactsArr = contactsArr.filter((c) => c.id !== id);
  renderContacts();
}

// שינוי סטטוס מועדף
function toggleFavorite(id) {
  const contacts = contactsArr.find((c) => c.id === id);
  if (contacts) {
    contacts.favorite = !contacts.favorite;
    renderContacts();
  }
}

// עריכת איש קשר קיים
function editContact(id) {
  const c = contactsArr.find((x) => x.id === id);
  if (!c) return;

  nameInput.value = c.name;
  phoneInput.value = c.phone;
  emailInput.value = c.email;
  addressInput.value = c.address;
  notesInput.value = c.notes;
  tagsInput.value = c.tags;
  favoriteInput.checked = c.favorite;
  editingId = id;

  popupOverlay.classList.add("show");
}

// ✅ פונקציית תצוגת פרטי איש קשר
// תצוגת מידע על איש קשר
function showInfo(id) {
  const c = contactsArr.find((x) => x.id === id);
  if (!c) return;

  infoContent.innerHTML = `
    <button class="close-info" onclick="infoOverlay.classList.remove('show')">❌</button>
    <h3>${c.name}</h3>
    <p>📞 ${c.phone}</p>
    ${c.email ? `<p>📧 ${c.email}</p>` : ""}
    ${c.address ? `<p>📍 ${c.address}</p>` : ""}
    ${c.notes ? `<p>📝 ${c.notes}</p>` : ""}
    ${c.tags ? `<p>🏷️ ${c.tags}</p>` : ""}
    ${
      c.image
        ? `<img src="${c.image}" style="max-width:100%;border-radius:8px;margin-top:8px;" />`
        : ""
    }
  `;
  infoOverlay.classList.add("show");
}

// ✅ סגירת החלון הקופץ אם לוחצים מחוץ לו
// סגירת חלון מידע אם לוחצים מחוץ
window.addEventListener("click", (e) => {
  if (e.target === infoOverlay) {
    infoOverlay.classList.remove("show");
  }
});
// הצגה ראשונית של אנשי הקשר
renderContacts();
