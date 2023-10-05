const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-management-system', {
    useNewUrlParser : true
}).then(() => {
    console.log('connection working');
}).catch((e) => {
    console.log(e.message)
})


// mongodb+srv://pateldhruv16199:task-app@cluster0.qp2s5t6.mongodb.net/?retryWrites=true&w=majority
// mongodb+srv://pateldhruv16199:task-app@cluster0.qp2s5t6.mongodb.net/?retryWrites=true&w=majority

// mongodb+srv://pateldhruv16199:Task-management-system@cluster0.tytqfm2.mongodb.net/?retryWrites=true&w=majority