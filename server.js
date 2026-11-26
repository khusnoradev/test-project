// Server ishga tushayotganini konsolda ko'rsatamiz
console.log("Start server");
// Express kutubxonasini chaqirib olamiz
const express = require('express')
// Express ilovasini (app) yaratamiz
const app = express();
const http = require("http")

//**1 - Kirish kodlari (middleware)

// "public" papkasidagi statik fayllarni (css, rasm, js) brauzerga ochib beradi
app.use(express.static('public'));
// Kelayotgan JSON ma'lumotlarni o'qib, req.body ga joylaydi
app.use(express.json());
// HTML formadan yuborilgan ma'lumotlarni o'qib, req.body ga joylaydi
app.use(express.urlencoded({ extended: true }));

//**2 - Session kodlari (hozircha bo'sh)

//**3 - Views (ko'rinish) sozlamalari

// EJS shablon fayllari "views" papkasida turishini belgilaymiz
app.set('views', "views");
// Shablon dvigateli sifatida EJS dan foydalanamiz
app.set('view engine', 'ejs');

//**4 - Routing (yo'nalishlar)

/* Bosh sahifaga ("/") GET so'rov kelganda "Hello World!" javobini qaytaramiz
app.get("/gift", function (req, res){
    res.end(`<h1 style="background: gold;">Hello you are in prize module!</h1>`);
});

app.get("/hello", function (req, res){
    res.end(`<h1 style="background: yellow;">Hello World!</h1>`);
});
*/
// Rejalarni vaqtincha xotirada saqlaymiz (keyinchalik MongoDB bilan almashtiriladi)
const items = [];

// Bosh sahifa ("/") — harid sahifasini rejalar ro'yxati bilan ko'rsatamiz
app.get("/", function (req, res){
    res.render("harid", { items: items });
});

app.get("/harid", function (req, res){
    res.render("harid", { items: items });
});

// Yangi reja qo'shish:
// formadan (urlencoded) kelgan "item" maydonini req.body dan olamiz
// va javobni JSON formatda qaytaramiz
app.post("/create-item", function (req, res){
    // Terminalda formadan kelgan ma'lumot ko'rinadi, masalan: { item: 'done' }
    console.log(req.body);

    // Bo'sh joylarni olib tashlaymiz, bo'sh bo'lsa xato qaytaramiz
    const reja = (req.body.item || "").trim();
    if (!reja) {
        return res.status(400).json({ state: "fail", message: "reja bo'sh bo'lmasligi kerak" });
    }

    // Yangi reja: id sifatida hozirgi vaqt (millisekund) ishlatiladi
    const newItem = { id: Date.now(), reja: reja };
    items.push(newItem);
    console.log("Yangi reja qo'shildi:", reja);

    // Brauzer yangi rejani ro'yxatga qo'shishi uchun uni (id bilan) qaytaramiz
    res.json({ message: "successfully added", data: newItem });
});

// Rejani o'chirish: brauzerdan { id } keladi
app.post("/delete-item", function (req, res){
    console.log(req.body); // masalan: { id: '1795698105605' }
    const id = Number(req.body.id); // brauzerdan matn keladi, songa aylantiramiz
    // Shu id dagi rejaning massivdagi o'rnini topamiz
    const index = items.findIndex(function (item) { return item.id === id; });
    if (index === -1) {
        return res.status(404).json({ state: "fail", message: "reja topilmadi" });
    }
    items.splice(index, 1); // massivdan o'chiramiz
    res.json({ state: "success" });
});

// Rejani tahrirlash: brauzerdan { id, item } keladi
app.post("/edit-item", function (req, res){
    console.log(req.body); // masalan: { id: '...', item: 'yangi matn' }
    const id = Number(req.body.id);
    const reja = (req.body.item || "").trim();
    if (!reja) {
        return res.status(400).json({ state: "fail", message: "reja bo'sh bo'lmasligi kerak" });
    }
    // Shu id dagi rejani topamiz
    const found = items.find(function (item) { return item.id === id; });
    if (!found) {
        return res.status(404).json({ state: "fail", message: "reja topilmadi" });
    }
    found.reja = reja; // matnini yangilaymiz
    res.json({ state: "success", data: found });
});

// Barcha rejalarni JSON formatda qaytaramiz
app.get("/items", function (req, res){
    res.json({ state: "success", data: items });
});

// HTTP serverni yaratamiz va 3000-portda ishga tushiramiz
const server = http.createServer(app);
let PORT = 3000;
server.listen(PORT, function () {
    console.log(`The server is running successfully on port: ${PORT}`);
});
