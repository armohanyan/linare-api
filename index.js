const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./models')
const newsRoutes = require('./routes/newsRoutes')
const authRoutes = require('./routes/authRoutes')
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

app.use("/api/news", newsRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
