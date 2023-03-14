const db = require('../config/database');
const Users = db.User;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const bcrypt = require('bcryptjs');
const saltRounds = 6;


module.exports = {
  join,
  login,
  update,
  getOne,
  getUsername,
  getAll
};

async function join(req, res) {
  try {
    const username = req.body.username;
    const funds = 0

    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(req.body.password, salt);

    await Users.create({
      username,
      password,
      funds
    });


    const token = createJWT({ username });
    return res.status(201).json({ token });
    
  } catch (err) {
    return res.status(400).json(err);
  } 
}

async function login(req, res) {
  try {
    const user = await Users.findOne({ where: { [Op.or]: [{username: req.body.username}, {email: req.body.username}] } });
    const username = user.dataValues.username;
    const password = user.dataValues.password;

    if (!user) {
      console.log("User Not Found");
      return res.status(401).json({err: 'User Not Found'});

    } else {
      if (!user.validPassword(req.body.password, password)) {
          console.log("Invalid Password");
          return res.status(401).json({err: 'Invalid Password'});

      } else {
        console.log("Welcome to theCause.art " + username + "!");
        const token = createJWT({ username });
        return res.status(200).json({ token });
      };
    };
  } catch (err) {
    return res.status(401).json(err);
  };
};

async function update(req, res) {
  try {
    const user = await Users.findOne({ where: { id: req.params.id } });

    if (req.body.password) {
      const salt = bcrypt.genSaltSync(saltRounds);
      const password = bcrypt.hashSync(req.body.password, salt);
      await user.update({
        password: password
      });
    };

    await user.update({
      username: req.body.username,
      email: req.body.email,
      bio: req.body.bio,
      avatar: req.body.avatar,
      auction1: req.body.auction1,
      auction2: req.body.auction2,
      auction3: req.body.auction3,
      cause1: req.body.cause1,
      cause2: req.body.cause2,
      cause3: req.body.cause3
    });

    return res.status(200).json({});
  } catch (err) {
      return res.status(400).json(err);
  }
}

async function getOne(req, res) {
  try {
    let user = await Users.findOne({ where: { id: req.params.id } });
    delete user.dataValues.password;
    return res.status(200).json( user );

  } catch (err) {
    return res.status(400).json(err);
  };
};

async function getUsername(req, res) {
  try {
    let user = await Users.findOne({ where: { username: req.params.username } });
    delete user.dataValues.password;
    return res.status(200).json( user );

  } catch (err) {
    return res.status(400).json(err);
  };
};

async function getAll(req, res) {
  try {
    const data = await Users.findAll({ limit: 4 });
    let users = [];
    data.forEach(function(user){
      const userData = {
        username: user.dataValues.username,
        funds: user.dataValues.funds,
        email: user.dataValues.email,
        bio: user.dataValues.bio,
        avatar: user.dataValues.avatar,
        auction1: user.dataValues.auction1,
        auction2: user.dataValues.auction2,
        auction3: user.dataValues.auction3,
        cause1: user.dataValues.cause1,
        cause2: user.dataValues.cause2,
        cause3: user.dataValues.cause3,
      };
      users.push(userData);
    });
    return res.status(200).json( users );

  } catch (err) {
    return res.status(400).json(err);
  };
};

/*----- Helper Functions -----*/

function createJWT(user) {
  return jwt.sign(
    {user}, // data payload
    SECRET,
    {expiresIn: '24h'}
  );
}
