let addContactForm = document.getElementById("addContactForm");
let contactPhotoInput = document.getElementById("contactPhotoInput");
let contactName = document.getElementById("name");
let contactPhone = document.getElementById("phone");
let contactEmail = document.getElementById("email");
let contactAddress = document.getElementById("address");
let contactGroupe = document.getElementById("group");
let contactNote = document.getElementById("note");
let contactFavorite = document.getElementById("favorite");
let contactEmergency = document.getElementById("emergency");
let saveContactBtn = document.getElementById("saveContactBtn");
let cancelContactBtn = document.getElementById("cancelContactBtn");
let starBtn = document.getElementById("starBtn");
let heartBtn = document.getElementById("heartBtn");
let editBtn = document.getElementById("update");
let deleteBtn = document.getElementById("delete");
let search = document.getElementById("search");
let currentIndex;

// for random avatar background
const avatarColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899"];

function getRandomAvatarColor() {
	let randomIndex = Math.floor(Math.random() * avatarColors.length);
	return avatarColors[randomIndex];
}

// validation for input
contactName.onkeyup = nameValidation;
contactPhone.onkeyup = phoneValidation;
contactEmail.onkeyup = emailValidation;

function checkPhoneDuplicate() {
	let value = contactPhone.value.trim();
	let isDuplicate = contactList.some(function (c, i) {
		return c.phone === value && i !== currentIndex;
	});

	if (isDuplicate) {
		Swal.fire({
			icon: "error",
			title: "Duplicate Phone Number",
			text: "This phone number is already used by another contact",
			confirmButtonColor: "#dc3545",
		});
		return false;
	}
	return true;
}

function checkEmailDuplicate() {
	let value = contactEmail.value.trim();
	if (value === "") return true;

	let isDuplicate = contactList.some(function (c, i) {
		return c.email && c.email.toLowerCase() === value.toLowerCase() && i !== currentIndex;
	});

	if (isDuplicate) {
		Swal.fire({
			icon: "error",
			title: "Duplicate Email",
			text: "This email is already used by another contact",
			confirmButtonColor: "#dc3545",
		});
		return false;
	}
	return true;
}

// for bootstrap modal
let addContactModal = new bootstrap.Modal(document.getElementById("addContactModal"));

let contactList = [];

if (localStorage.getItem("contact")) {
	contactList = JSON.parse(localStorage.getItem("contact"));
	displayContacts();
}

addContactForm.addEventListener("submit", function (e) {
	e.preventDefault();
});

saveContactBtn.addEventListener("click", function () {
	if (!nameValidation() || !phoneValidation() || !emailValidation()) {
		return;
	}

	// duplicate checks (shown as SweetAlert)
	if (!checkPhoneDuplicate()) {
		return;
	}
	if (!checkEmailDuplicate()) {
		return;
	}
	let isUpdate = saveContactBtn.innerHTML.includes("update");
	let contact = {
		image: contactPhotoInput.files[0] ? `./image/${contactPhotoInput.files[0].name}` : isUpdate && contactList[currentIndex] ? contactList[currentIndex].image : "",
		avatarColor: isUpdate && contactList[currentIndex] ? contactList[currentIndex].avatarColor : getRandomAvatarColor(),
		name: contactName.value,
		phone: contactPhone.value,
		email: contactEmail.value,
		address: contactAddress.value,
		group: contactGroupe.value,
		note: contactNote.value,
		favorite: contactFavorite.checked,
		emergency: contactEmergency.checked,
	};

	if (saveContactBtn.innerHTML == "update") {
		contactList.splice(currentIndex, 1, contact);
		saveContactBtn.innerHTML = "add Contact";
		Swal.fire({
			icon: "success",
			title: "Updated Successfully",
			text: "Contact information updated successfully",
			confirmButtonColor: "#3085d6",
		});
	} else {
		contactList.push(contact);
		Swal.fire({
			icon: "success",
			title: "Added Successfully",
			text: "Contact added successfully",
			confirmButtonColor: "#3085d6",
		});
	}
	localStorage.setItem("contact", JSON.stringify(contactList));
	addContactForm.reset();

	displayContacts();
	addContactModal.hide();
});

function getInitials(name) {
	let words = name.trim().split(" ");

	if (words.length === 1) {
		return words[0][0].toUpperCase();
	} else {
		return (words[0][0] + words[1][0]).toUpperCase();
	}
}

function displayContacts(searchValue = "") {
	let box = "";
	if (contactList.length === 0) {
		document.getElementById("rowBody").innerHTML = `
	<div class="col-12">
		<div class="empty-state">
			<div class="empty-state-icon"><i class="fa-solid fa-address-book"></i></div>
			<div class="empty-state-title">No contacts found</div>
			<div class="empty-state-sub">Click "Add Contact" to get started</div>
		</div>
	</div>
	`;
		displayFav();
		displayEmergency();
		updateStats();
		return;
	}
	for (let i = 0; i < contactList.length; i++) {
		box += `
    <div class="col-12 col-md-6">
            <div class="contact-card h-100">
              <div class="d-flex gap-3">
                <div class="avatar-wrap">
                  <div class="avatar-square" style="${!contactList[i].image ? `background:${contactList[i].avatarColor}` : ""}">
                  ${contactList[i].image ? `<img src="${contactList[i].image}">` : getInitials(contactList[i].name)}</div>
                  <div class="badge-star ${contactList[i].favorite ? "" : "d-none"}"><i class="fa-solid fa-star"></i></div>
                  <div class="badge-heart ${contactList[i].emergency ? "" : "d-none"}"><i class="fa-solid fa-heart"></i></div>
                </div>

                <div class="flex-grow-1">
                  <div class="contact-name">${contactList[i].name}</div>
                  <div class="contact-phone"><i class="fa-solid fa-phone"></i> ${contactList[i].phone}</div>

                  <div class="contact-meta">
                    <div class="meta-icon mail"><i class="fa-solid fa-envelope"></i></div>
                    <span>${contactList[i].email}</span>
                  </div>
                  <div class="contact-meta">
                    <div class="meta-icon pin"><i class="fa-solid fa-location-dot"></i></div>
                    <span>${contactList[i].address}</span>
                  </div>

                  <div class="d-flex gap-2 mt-3">
                    <div class="tag tag-family">
                    <span>${contactList[i].group}</span>
                    </div>
                    <span class="tag tag-emergency ${contactList[i].emergency ? "" : "d-none"}"><i class="fa-solid fa-heart me-1"></i>Emergency</span>
                  </div>
                </div>
              </div>

              <div class="card-actions">
                <div class="d-flex gap-2">
                   <a href="tel:${contactList[i].phone}" class="action-btn action-call"><i class="fa-solid fa-phone"></i></a>
                  <a href="mailto:${contactList[i].email}" class="action-btn action-mail"><i class="fa-solid fa-envelope"></i></a>
                </div>
                <div class="d-flex gap-2">
                  <button onclick="toggleFavorite(${i})" class="action-btn action-star ${contactList[i].favorite ? "active" : ""}"><i class="fa-solid fa-star"></i></button>
                  <button onclick="toggleEmergency(${i})" class="action-btn action-heart ${contactList[i].emergency ? "active" : ""}"><i class="fa-solid fa-heart"></i></button>
                  <button onclick="editContact(${i})" class="action-btn action-edit"><i class="fa-solid fa-pen"></i></button>
                  <button onclick="deleteContact(${i})" class="action-btn action-trash"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>
          </div>
          `;
	}

	document.getElementById("rowBody").innerHTML = box;
	displayFav();
	displayEmergency();
	updateStats();
}

function displayFav() {
	let box = "";
	if (!contactList.some((contact) => contact.favorite)) {
		document.getElementById("sideFavoritesPanel").innerHTML = `<div class="empty-state-side">No favorites yet</div>`;
		return;
	}
	for (let i = 0; i < contactList.length; i++) {
		if (contactList[i].favorite) {
			box += `
      <div class="side-contact-row">
          <div class="side-avatar" style="${!contactList[i].image ? `background:${contactList[i].avatarColor}` : ""}">${contactList[i].image ? `<img src="${contactList[i].image}">` : getInitials(contactList[i].name)}</div>
          <div>
            <div class="side-contact-name">${contactList[i].name}</div>
            <div class="side-contact-phone">${contactList[i].phone}</div>
          </div>
          <a href="tel:${contactList[i].phone}" class="side-call-btn fav"><i class="fa-solid fa-phone"></i></a>
        </div>
      `;
		}
	}
	document.getElementById("sideFavoritesPanel").innerHTML = box;
}

function displayEmergency() {
	let box = "";
	if (!contactList.some((contact) => contact.emergency)) {
		document.getElementById("sideEmergencyPanel").innerHTML = `<div class="empty-state-side">No favorites yet</div>`;
		return;
	}
	for (let i = 0; i < contactList.length; i++) {
		if (contactList[i].emergency) {
			box += `
      <div class="side-contact-row">
          <div class="side-avatar" style="${!contactList[i].image ? `background:${contactList[i].avatarColor}` : ""}">${contactList[i].image ? `<img src="${contactList[i].image}">` : getInitials(contactList[i].name)}</div>
          <div>
            <div class="side-contact-name">${contactList[i].name}</div>
            <div class="side-contact-phone">${contactList[i].phone}</div>
          </div>
          <a href="tel:${contactList[i].phone}" class="side-call-btn fav"><i class="fa-solid fa-phone"></i></a>
        </div>
      `;
		}
	}
	document.getElementById("sideEmergencyPanel").innerHTML = box;
}

function updateStats() {
	let total = contactList.length;

	let favorites = 0;
	let emergency = 0;

	for (let i = 0; i < contactList.length; i++) {
		if (contactList[i].favorite) {
			favorites++;
		}

		if (contactList[i].emergency) {
			emergency++;
		}
	}

	document.getElementById("totalContacts").innerHTML = total;
	document.getElementById("favoriteContacts").innerHTML = favorites;
	document.getElementById("emergencyContacts").innerHTML = emergency;
}

function toggleFavorite(index) {
	if (contactList[index].favorite) {
		contactList[index].favorite = false;
	} else {
		contactList[index].favorite = true;
	}
	localStorage.setItem("contact", JSON.stringify(contactList));
	displayContacts();
}

function toggleEmergency(index) {
	if (contactList[index].emergency) {
		contactList[index].emergency = false;
	} else {
		contactList[index].emergency = true;
	}
	localStorage.setItem("contact", JSON.stringify(contactList));
	displayContacts();
}

function deleteContact(index) {
	Swal.fire({
		icon: "warning",
		title: "Are you sure?",
		text: "Do you want to delete this contact? This action cannot be undone",
		showCancelButton: true,
		confirmButtonText: "Yes, delete it",
		cancelButtonText: "Cancel",
		confirmButtonColor: "#dc3545",
		cancelButtonColor: "#6c757d",
	}).then(function (result) {
		if (result.isConfirmed) {
			contactList.splice(index, 1);
			localStorage.setItem("contact", JSON.stringify(contactList));
			displayContacts();

			Swal.fire({
				icon: "success",
				title: "Deleted",
				text: "Contact deleted successfully",
				confirmButtonColor: "#3085d6",
			});
		}
	});
}

function editContact(index) {
	contactName.value = contactList[index].name;
	contactPhone.value = contactList[index].phone;
	contactEmail.value = contactList[index].email;
	contactAddress.value = contactList[index].address;
	contactGroupe.value = contactList[index].group;
	contactNote.value = contactList[index].note;
	contactFavorite.checked = contactList[index].favorite;
	contactEmergency.checked = contactList[index].emergency;
	currentIndex = index;
	saveContactBtn.innerHTML = "update";
	addContactModal.show();
}

search.onkeyup = searchForContact;

function searchForContact() {
	let box = "";
	for (let i = 0; i < contactList.length; i++) {
		if (contactList[i].name.toLowerCase().includes(search.value.toLowerCase()) || contactList[i].phone.toLowerCase().includes(search.value.toLowerCase()) || contactList[i].email.toLowerCase().includes(search.value.toLowerCase())) {
			box += `
      <div class="col-12 col-md-6">
            <div class="contact-card h-100">
              <div class="d-flex gap-3">
                <div class="avatar-wrap">
                  <div class="avatar-square">${contactList[i].image ? `<img src="${contactList[i].image}">` : getInitials(contactList[i].name)}</div>
                  <div class="badge-star ${contactList[i].favorite ? "" : "d-none"}"><i class="fa-solid fa-star"></i></div>
                  <div class="badge-heart ${contactList[i].emergency ? "" : "d-none"}"><i class="fa-solid fa-heart"></i></div>
                </div>

                <div class="flex-grow-1">
                  <div class="contact-name">${contactList[i].name}</div>
                  <div class="contact-phone"><i class="fa-solid fa-phone"></i> ${contactList[i].phone}</div>

                  <div class="contact-meta">
                    <div class="meta-icon mail"><i class="fa-solid fa-envelope"></i></div>
                    <span>${contactList[i].email}</span>
                  </div>
                  <div class="contact-meta">
                    <div class="meta-icon pin"><i class="fa-solid fa-location-dot"></i></div>
                    <span>${contactList[i].address}</span>
                  </div>

                  <div class="d-flex gap-2 mt-3">
                    <div class="tag tag-family">
                    <span>${contactList[i].group}</span>
                    </div>
                    <span class="tag tag-emergency ${contactList[i].emergency ? "" : "d-none"}"><i class="fa-solid fa-heart me-1"></i>Emergency</span>
                  </div>
                </div>
              </div>

              <div class="card-actions">
                <div class="d-flex gap-2">
                  <button class="action-btn action-call"><i class="fa-solid fa-phone"></i></button>
                  <button class="action-btn action-mail"><i class="fa-solid fa-envelope"></i></button>
                </div>
                <div class="d-flex gap-2">
                  <button onclick="toggleFavorite(${i})" class="action-btn action-star ${contactList[i].favorite ? "active" : ""}"><i class="fa-solid fa-star"></i></button>
                  <button onclick="toggleEmergency(${i})" class="action-btn action-heart ${contactList[i].emergency ? "active" : ""}"><i class="fa-solid fa-heart"></i></button>
                  <button onclick="editContact(${i})" class="action-btn action-edit"><i class="fa-solid fa-pen"></i></button>
                  <button onclick="deleteContact(${i})" class="action-btn action-trash"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>
          </div>
          `;
		}
		let rowBody = document.getElementById("rowBody");
		if (box === "") {
			rowBody.innerHTML = `
	<div class="col-12">
		<div class="empty-state">
			<div class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
			<div class="empty-state-title">No contacts found</div>
			<div class="empty-state-sub">Try a different search term</div>
		</div>
	</div>
	`;
		} else {
			rowBody.innerHTML = box;
		}
	}
}

function nameValidation() {
	let regex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
	if (regex.test(contactName.value)) {
		contactName.classList.remove("is-invalid");
		contactName.classList.add("is-valid");
		document.getElementById("nameError").classList.remove("show");
		return true;
	} else {
		contactName.classList.remove("is-valid");
		contactName.classList.add("is-invalid");
		document.getElementById("nameError").classList.add("show");
		return false;
	}
}

function phoneValidation() {
	let regex = /^01[0125][0-9]{8}$/;
	if (regex.test(contactPhone.value)) {
		contactPhone.classList.remove("is-invalid");
		contactPhone.classList.add("is-valid");
		document.getElementById("phoneError").classList.remove("show");
		return true;
	} else {
		contactPhone.classList.remove("is-valid");
		contactPhone.classList.add("is-invalid");
		document.getElementById("phoneError").classList.add("show");
		return false;
	}
}

function emailValidation() {
	let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	if (regex.test(contactEmail.value)) {
		contactEmail.classList.remove("is-invalid");
		contactEmail.classList.add("is-valid");
		document.getElementById("emailError").classList.remove("show");
		return true;
	} else {
		contactEmail.classList.remove("is-valid");
		contactEmail.classList.add("is-invalid");
		document.getElementById("emailError").classList.add("show");
		return false;
	}
}

function checkPhoneDuplicate() {
	let value = contactPhone.value.trim();
	let isDuplicate = contactList.some(function (c, i) {
		return c.phone === value && i !== currentIndex;
	});
	if (isDuplicate) {
		Swal.fire({
			icon: "error",
			title: "Duplicate Phone Number",
			text: "This phone number is already used by another contact",
			confirmButtonColor: "#dc3545",
		});
		return false;
	}
	return true;
}
