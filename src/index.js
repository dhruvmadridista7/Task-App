const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const app = express();



app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT || 5003;
app.listen(port, () => {
    console.log(`server is running at ${port}`);
})