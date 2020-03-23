const express = require("express");
const staticRouter = require("./routers/static")

const port = process.env.PORT || 6969;


const app = express();

app.use(staticRouter)

app.listen(port, () => console.log(`Server running on port ${port}`));
