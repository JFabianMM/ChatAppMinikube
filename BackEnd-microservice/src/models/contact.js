const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
    identification: { 
        type: String,
        unique: true, 
        required: true,
        trim: true,
    },
    email: { 
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    contacts: [{
        id: { 
            type: String, 
            trim: true,
            },
        room: { 
            type: String, 
            trim: true,
        },
        email: { 
            type: String, 
            trim: true,
        },
        firstName: { 
            type: String, 
            trim: true
        },
        lastName: { 
            type: String, 
            trim: true
        },
    }]
});

module.exports = mongoose.model('Contact', contactSchema);