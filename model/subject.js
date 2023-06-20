let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let SubjectsSchema = Schema({
    nom: String,
    code: String,
    nomProf: String,
    uri_mat: String,
    uri_prof: String
});

SubjectsSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// le nom de la collection (par défaut subjects) sera au pluriel, 
// soit subjects
// Si on met un nom "proche", Mongoose choisira la collection
// dont le nom est le plus proche
module.exports = mongoose.model('subjects', SubjectsSchema);
