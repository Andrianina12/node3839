let express = require('express');
let app = express();
let bodyParser = require('body-parser');
// AuthController.js
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


let assignment = require('./routes/assignments');
let user = require('./routes/users');
let auth = require('./routes/auth');


let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
//const uri = 'mongodb+srv://mb:toto@cluster0.5e6cs7n.mongodb.net/assignments?retryWrites=true&w=majority';

//const uri = 'mongodb+srv://root:root@cluster0.c4jt7md.mongodb.net/Mean3839?retryWrites=true&w=majority';

const uri = 'mongodb+srv://mean3839:mean3839@cluster0.slx8jfw.mongodb.net/mean3839?retryWrites=true&w=majority';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
    },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

app.route(prefix + '/').get(assignment.getAssignmentsSansPagination)

app.route(prefix + '/assignments')
  .get(assignment.getAssignments)
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);


app.route(prefix + '/users')
  .get(user.getUsers)
  .post(user.postUser)
  .put(user.updateUser);

app.route(prefix + '/users/:id')
  .get(user.getUser)
  .delete(user.deleteUser);  

app.route(prefix + '/register')
  .post(auth.register);

app.route(prefix + '/me')
  .get(auth.me);

app.route(prefix + '/auth')
  .post(auth.login);

app.route(prefix + '/logout')
  .get(auth.logout)

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


