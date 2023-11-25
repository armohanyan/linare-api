const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./models')

const newsRoutes = require('./routes/newsRoutes')
const authRoutes = require('./routes/authRoutes')
const accountRoutes = require("./routes/accountRoutes");
const testimonialsRoutes = require("./routes/testimonialsRoutes");
const contactsRoutes = require("./routes/contactsRoutes");
const collaboratorsRoutes = require("./routes/collaboratorsRoutes");

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
        origin: "*",
    })
);
app.use(cookies());

app.use("/api/news", newsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/collaborators", collaboratorsRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
