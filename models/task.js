/* ===========================================================
 Task Model
 =========================================================== */

function init(mongoose){
    var Schema = mongoose.Schema;

    // Base Schema
    var TaskSchema = new Schema({
        name: String, // Der Name der Aufgabe
        project: {type: Schema.ObjectId, ref: 'Project'}, // Das Projekt der Aufgabe
        creator: {type: Schema.ObjectId, ref: 'User'}, // Der Ersteller des Projektes
        created: { type: Date, default: Date.now }, // Das Erstellungsdatum
        lastActivated: { type: Date, default: Date.now }, // Die letzte Aktivierung der Zeiterfassung
        active: Boolean, // Ist die Zeiterfassung aktiv bzw. läuft der Timer?
        elapsedTime: Number // Die bisher getrackte Zeit in Sekunden
    });

    // Modell erstellen
    var Task = mongoose.model('Task', TaskSchema);

    return Task;
}

module.exports = init;