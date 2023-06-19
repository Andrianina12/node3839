var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./../config');
let User = require('./../model/user');

function register(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8); 
    User.create({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword
    },
    function (err, user) {
      if (err) return res.status(500).send("There was a problem registering the user.")
      // create a token
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });
    }); 
}

function me(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'Aucun token fourni.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Échec de l\'authentification du token.' });
      
      User.findById(decoded.id, function (err, user) {
        if (err) return res.status(500).send("Une erreur est survenue.");
        if (!user) return res.status(404).send("Aucun utilisateur trouvé.");
        
        res.status(200).send(user);
      });
    });
}

function login(req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Une erreur est survenue.');
        if (!user) return res.status(404).send('Aucun utilisateur ne correspond à votre email.');
        
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(400).send('Mot de passe incorrect.');
        
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        
        res.status(200).send({ auth: true, token: token });
      });
}

function logout(req, res) {
    res.status(200).send({ auth: false, token: null });
}

module.exports = {register, me, login, logout}