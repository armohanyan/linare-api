const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./models')

const productsRoutes = require('./routes/productsRoutes')
const authRoutes = require('./routes/authRoutes')
const accountRoutes = require("./routes/accountRoutes");
const testimonialsRoutes = require("./routes/testimonialsRoutes");
const contactsRoutes = require("./routes/contactsRoutes");
const collaboratorsRoutes = require("./routes/collaboratorsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const adminRoutes = require("./routes/adminRoutes");
const usersRoutes = require("./routes/usersRoutes");

const cookies = require("cookie-parser");

const port = process.env.PORT || 3001;

db.sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:8080",
    })
);
app.use(cookies());

app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/collaborators", collaboratorsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", usersRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
