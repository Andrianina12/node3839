let Subject = require('../model/subject')

function getSubjects(req, res){
    Subject.find((err, subjects) => {
        if(err){
            res.send(err)
        }

        res.send(subjects);
    });
}

module.exports = {getSubjects}