import express from "express";
import dotenv from "dotenv";

import router from "./routers/router.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use(router);

const PORT = +process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
