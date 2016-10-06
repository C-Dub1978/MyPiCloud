'use strict';

const SALT = 10;

var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    UserSchema = new mongoose.Schema({
        name     : String,
        email    : { type: String, unique: true },
        password : String,
        created  : {type: Date, default: Date.now},
        media: {
            audio: [{type: mongoose.Schema.Types.ObjectId}],
            video: [{type: mongoose.Schema.Types.ObjectId}],
            image: [{type: mongoose.Schema.Types.ObjectId}],
            document: [{type: mongoose.Schema.Types.ObjectId}]
        }
    });

UserSchema.methods.addMedia = function(type, id) {
        if(type === 'audio') {
            this.media.audio.push(id);
        } else if(type === 'video') {
            this.media.video.push(id);
        } else if(type === 'image') {
            this.media.image.push(id);
        } else if(type === 'document') {
            this.media.document.push(id);
        } else {
            console.error('File with id: ' + id + ' not found');
        }
};

UserSchema.methods.removeMedia = function(type, id) {
    if(type === 'audio') {
        for(var i = 0; i < this.media.audio.length; i++) {
            if(this.media.audio[i] === id) {
                this.media.audio.splice(i, 1);
            }
        }
    } else if(type === 'video') {
        for(var i = 0; i < this.media.video.length; i++) {
            if(this.media.video[i] === id) {
                this.media.video.splice(i, 1);
            }
        }
    } else if(type === 'image') {
        for(var i = 0; i < this.media.image.length; i++) {
            if(this.media.image[i] === id) {
                this.media.image.splice(i, 1);
            }
        }
    } else if(type === 'document') {
        for(var i = 0; i < this.media.document.length; i++) {
            if(this.media.document[i] === id) {
                this.media.document.splice(i, 1);
            }
        }
    } else {
        console.error('File with id: ' + id + ' not found');
    }
};

UserSchema.methods.getMedia = function(type) {
    if(type === 'audio') {
        return this.media.audio;
    } else if(type === 'video') {
        return this.media.video;
    } else if(type === 'image') {
        return this.media.image;
    } else if(type === 'document') {
        return this.media.document;
    } else {
        return;
    }
};



// hash passwords before saving them
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if ( !user.isModified('password') ) {
        return next();
    }
    // generate a salt
    bcrypt.genSalt(SALT, (saltErr, salt) => {
        if (saltErr) {
            return next(saltErr);
        }
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (hashErr, hash) => {
            if (hashErr) {
                return next(hashErr);
            }
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', UserSchema);
