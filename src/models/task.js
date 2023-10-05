const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true,
    },
    description : {
        type : String,
        required : true,
        trim : true,
    },
    priority : {
        type : Number,
        required : true,
        trim : true,
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed'], 
        default: 'pending' 
    },
    collaborators : [{
        type : String,
        ref : 'User',
    }],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
})

taskSchema.methods.addCollaborators = async function(userIds) {
    return new Promise((resolve, reject) => {
        for(id of userIds) {
            this.collaborators.addToSet(id);
        }
        resolve(this.save());
    })
}

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;