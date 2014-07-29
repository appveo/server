/* ===========================================================
 Project Model
 =========================================================== */

function init(mongoose){
    var Schema = mongoose.Schema;

    // Base Schema
    var ProjectSchema = new Schema({
        name: String, // Der Projektname
        creator: {type: Schema.ObjectId, ref: 'User'}, // Der Ersteller des Projektes
        created: { type: Date, default: Date.now }, // Das Erstellungsdatum
        archived: { type: Boolean, default: false }, // Ist das Projekt archiviert?
        deleted: { type: Boolean, default: false } // Ist das Projekt gelöscht?
    });

    // Modell erstellen
    var Project = mongoose.model('Project', ProjectSchema);

    return Project;
}

module.exports = init;