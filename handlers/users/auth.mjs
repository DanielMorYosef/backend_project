import { app } from "../../app.mjs";
import { UserLogin, UserSignup } from "./users.joi.mjs";
import { User } from "./users.model.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const validate = UserLogin.validate({ email, password });

  if (validate.error) {
    return res.status(403).send(validate.error.details[0].message);
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(403).send("email or password is incorrect");
  }
  if (!user.password || !(await bcrypt.compare(password, user.password))) {
    return res.status(403).send("email or password is incorrect");
  }

  const token = jwt.sign(
    {
      _id: user._id,
      lastName: user.lastName,
      firstName: user.firstName,
      isBusiness: user.isBusiness,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.send(token);
  console.log(jwt.decode(token));
});

app.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    address,
    isBusiness,
    isAdmin,
    createdAt,
  } = req.body;

  const validate = UserSignup.validate(req.body, { allowUnknown: true });

  if (validate.error) {
    return res.status(400).send(validate.error.details[0].message);
  }

  if (await User.findOne({ email })) {
    return res.status(400).send("Already exists");
  }

  const user = new User({
    firstName,
    lastName,
    email,
    phone,
    address,
    isBusiness,
    isAdmin,
    password: await bcrypt.hash(password, 10),
    createdAt,
  });

  const newUser = await user.save();

  res.status(201).send(newUser);
});
