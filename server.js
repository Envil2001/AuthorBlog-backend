require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');

const authRouter = require('./routes/authRouter');
const postRouter = require('./routes/postRouter');
const uploadsRouter = require('./routes/uploadRouter');
const commentsRouter = require('./routes/commentRouter');
const PORT = process.env.PORT || 4444;
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/comments", commentsRouter);
app.use("/uploads", express.static('uploads'), uploadsRouter);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            poolSize: 20,
            keepAlive: 300000,
            reconnectTries: 1000,
            reconnectInterval: 90000
        })
            .then(() => console.log('DB OK'))
            .catch(() => console.log('error db'));

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();