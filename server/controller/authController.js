const Users = require("../models/User");
// bcrypt is a library for securely storing passwords using hashing and salting
const bcrypt = require("bcrypt");

// in both functions req.body expects a user object to validate
// user login
exports.login = async (req, res) => {
  try {
    // user : {email, password}
    const { user } = await req.body;
    Users.findOne({ email: user.email })
      .then(doc => {
        // compare the send password with the saved hashed password
        const valid = bcrypt.compareSync(user.password, doc.password);
        if (!valid) throw new Error("password is invalid");

        res.status(200).send({
          success: true,
          message: "user authorized",
          user: {
			_id: doc._id,
			name: doc.name
		  },
        })
      })
      .catch(e => {
        res.status(404).send({
          success: false,
          message: "could not validate user",
          error: e,
        })
      })


  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    })
  }
}

// user sign up
exports.signUp = async (req, res) => {
  try {
    // user: {name, email, password}
    const { user } = await req.body;

    // use bcrypt to hash the password
    const password = bcrypt.hashSync(user.password, 6);

    // mongodb checks unqiue fields
    // if it exists it throws an error
    const newUser = new Users({
      name: user.name,
      email: user.email,
      // hashed password is saved
      password: password
    })

    newUser.save().then(doc => {
      if (!doc) throw new Error("could not save user");

      res.status(201).send({
        success: true,
        message: "created user",
        user: {
		  _id: doc._id,
		  name: doc.name
		}
      })
    })
      .catch(e => {
        res.status(400).send({
          success: false,
          message: "error saving user",
          error: e,
        })
      })


  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    })
  }
}
