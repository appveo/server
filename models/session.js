/* ===========================================================
 Project Model
 =========================================================== */

function init(mongoose){
    var Schema = mongoose.Schema;

    // Base Schema
    var SessionSchema = new Schema({
        app: { type: String },                          // Der Name der registrieren App
        user: {type: Schema.ObjectId, ref: 'User'},     // Der Inhaber der Session
        created: { type: Date, default: Date.now },     // Das Erstellungsdatum der Session
        lastAccessed: { type: Date, default: Date.now } // Der letzte Zugriff auf die Session
    });

    // Modell erstellen
    return mongoose.model('Session', SessionSchema);
}

module.exports = init;