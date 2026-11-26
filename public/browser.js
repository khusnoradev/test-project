// Sahifadagi kerakli elementlarni olib qo'yamiz
const form = document.getElementById("create-form");
const input = document.getElementById("create-field");
const list = document.getElementById("item-list");

// Serverga JSON yuborib, javobni qaytaradigan yordamchi funksiya
async function postJSON(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Xatolik yuz berdi");
    return data;
}

// Bitta reja uchun <li> elementini yasaydi (Edit va Delete tugmalari bilan)
function itemTemplate(item) {
    const li = document.createElement("li");
    li.dataset.id = item.id;
    li.className = "list-group-item list-group-item-info d-flex align-items-center justify-content-between";

    const span = document.createElement("span");
    span.className = "item-text";
    span.textContent = item.reja;

    const buttons = document.createElement("div");
    buttons.innerHTML =
        '<button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>' +
        '<button class="delete-me btn btn-danger btn-sm">Delete</button>';

    li.appendChild(span);
    li.appendChild(buttons);
    return li;
}

// Ro'yxat bo'shab qolsa "Hozircha reja yo'q" yozuvini qayta ko'rsatamiz
function showEmptyIfNeeded() {
    if (list.children.length === 0) {
        const li = document.createElement("li");
        li.id = "empty-item";
        li.className = "list-group-item text-muted";
        li.textContent = "Hozircha reja yo'q";
        list.appendChild(li);
    }
}

// 1) Yangi reja qo'shish
form.addEventListener("submit", async function (e) {
    e.preventDefault(); // sahifa yangilanib ketmasin

    const item = input.value.trim();
    if (!item) {
        // Bo'sh bo'lsa popup chiqaramiz
        alert("Iltimos, reja yozing!");
        input.focus();
        return;
    }

    try {
        const data = await postJSON("/create-item", { item: item });

        // "Hozircha reja yo'q" yozuvi bo'lsa olib tashlaymiz
        const empty = document.getElementById("empty-item");
        if (empty) empty.remove();

        // Serverdan kelgan rejani ro'yxat oxiriga qo'shamiz
        list.appendChild(itemTemplate(data.data));
        input.value = ""; // inputni tozalaymiz
        input.focus();
    } catch (err) {
        alert(err.message);
    }
});

// 2) Edit va Delete — bitta listener orqali (yangi qo'shilgan rejalarda ham ishlaydi)
list.addEventListener("click", async function (e) {
    // Bosilgan tugma qaysi rejaga tegishli ekanini topamiz
    const li = e.target.closest("li");
    if (!li || !li.dataset.id) return;
    const id = li.dataset.id;

    // Delete
    if (e.target.classList.contains("delete-me")) {
        // Avval tasdiqlashni so'raymiz
        if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;
        try {
            await postJSON("/delete-item", { id: id });
            li.remove(); // sahifadan ham olib tashlaymiz
            showEmptyIfNeeded();
        } catch (err) {
            alert(err.message);
        }
    }

    // Edit
    if (e.target.classList.contains("edit-me")) {
        const span = li.querySelector(".item-text");
        // Hozirgi matnni ko'rsatib, yangisini so'raymiz
        const newValue = prompt("Rejani o'zgartiring:", span.textContent);
        if (newValue === null) return; // Cancel bosildi
        if (!newValue.trim()) {
            alert("Reja bo'sh bo'lmasligi kerak!");
            return;
        }
        try {
            const data = await postJSON("/edit-item", { id: id, item: newValue.trim() });
            span.textContent = data.data.reja; // sahifadagi matnni yangilaymiz
        } catch (err) {
            alert(err.message);
        }
    }
});
