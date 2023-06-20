let Assignment = require('./../model/assignment');
let Subject = require('./../model/subject'); // Import du modèle Subject

// Récupérer tous les assignments avec les attributs de la matière (GET)



// Récupérer tous les assignments (GET)
async function getAssignmentsSansPagination(req, res){
    try {
        // Récupération de tous les documents de la collection "Assignments"
        const assignments = await Assignment.find();
    
        // Récupération des attributs de la matière (collection "Subjects") pour chaque assignment
        const populatedAssignments = await Promise.all(
          assignments.map(async (assignment) => {
            // Recherche de la matière correspondante dans la collection "Subjects"
            const subject = await Subject.findOne({ code: assignment.matiere });
    
            // Création d'un nouvel objet Assignment avec les attributs de la matière inclus
            const populatedAssignment = {
              _id: assignment._id,
              auteur: assignment.auteur,
              dateRendu: assignment.dateRendu,
              matiere: assignment.matiere,
              rendu: assignment.rendu,
              note: assignment.note,
              remarque: assignment.remarque,
              subject: subject, // Ajout des attributs de la matière
            };
    
            return populatedAssignment;
          })
        );
    
        res.send(populatedAssignments);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
}

// Récupérer tous les assignments avec les attributs de la matière et pagination (GET)
function getAssignments(req, res) {
    var aggregateQuery = Assignment.aggregate();
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };
  
    Assignment.aggregatePaginate(aggregateQuery, options, async (err, assignments) => {
      if (err) {
        res.send(err);
        return;
      }
  
      // Récupération des attributs de la matière (collection "Subjects") pour chaque assignment
      const populatedAssignments = await Promise.all(
        assignments.docs.map(async (assignment) => {
          // Recherche de la matière correspondante dans la collection "Subjects"
          const subject = await Subject.findOne({ code: assignment.matiere });
  
          // Création d'un nouvel objet Assignment avec les attributs de la matière inclus
          const populatedAssignment = {
            _id: assignment._id,
            auteur: assignment.auteur,
            dateRendu: assignment.dateRendu,
            matiere: assignment.matiere,
            rendu: JSON.parse(assignment.rendu),
            note: assignment.note,
            remarque: assignment.remarque,
            subject: subject, // Ajout des attributs de la matière
          };
  
          return populatedAssignment;
        })
      );
  
      // Remplacer les assignments docs par les assignments avec les attributs de la matière
      assignments.docs = populatedAssignments;
  
      res.send(assignments);
    });
  }
   
// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ", req.body);
    
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: assignment.matiere + 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, getAssignmentsSansPagination };
