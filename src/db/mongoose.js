const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser : true
}).then(() => {
    console.log('connection working');
}).catch((e) => {
    console.log(e.message)
})


