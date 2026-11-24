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

// Bosh sahifaga ("/") GET so'rov kelganda "Hello World!" javobini qaytaramiz
app.get("/gift", function (req, res){
    res.end(`<h1 style="background: gold;">Hello you are in prize module!</h1>`);
});

app.get("/hello", function (req, res){
    res.end(`<h1 style="background: yellow;">Hello World!</h1>`);
});

// HTTP serverni yaratamiz va 3000-portda ishga tushiramiz
const server = http.createServer(app);
let PORT = 3000;
server.listen(PORT, function () {
    console.log(`The server is running successfully on port: ${PORT}`);
});
