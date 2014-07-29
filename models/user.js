/* ===========================================================
 User Model
 =========================================================== */

var crypto = require('crypto');

function init(mongoose){
    var Schema = mongoose.Schema;

    // Base Schema
    var UserSchema = new Schema({
        registered: Boolean, // Ist der Nutzer registriert? Nein, wenn temporär.
        name: { type: String }, // Der Name des Nutzers
        mail: {type: String, lowercase: true, unique: true, validate: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i}, // Die E-Mail Adresse des Benutzers
        passwordHash: String, // Das gehashte Passwort des Benutzers
        created: { type: Date, default: Date.now }, // Das Registrierungsdatum des Accounts
        lastLogin: Date // Das Datum des letzten Logins
    });

    UserSchema.path('name').validate(function (v) {
        return v.length >= 1;
    }, 'Name has to be defined');

    // Funktion zur Generierung eines Passwort Hashes
    UserSchema.statics.generatePasswordHash = function(password){
        var sha512 = crypto.createHash('sha512');
        sha512.update(password);
        return sha512.digest('hex');
    };

    // Login-Funktion, nimmt die E-Mail Adresse und das Passwort als Argument
    UserSchema.statics.tryLogin = function(mail, password, callback) {
        this.find({
            mail: mail.toLowerCase(),
            passwordHash: UserSchema.statics.generatePasswordHash(password)
        }, "-passwordHash -__v", function(err, data){
            if(!err){
                if(data.length == 1){
                    callback(data.length == 1, data[0]);
                }else{
                    callback(false, 1);
                }
            }else{
                callback(false, 2);
            }
        })
    };

    // Modell erstellen
    var User = mongoose.model('User', UserSchema);

    return User;
}

module.exports = init;