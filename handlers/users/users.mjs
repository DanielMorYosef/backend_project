import { app } from "../../app.mjs";
import { User } from "./users.model.mjs";
import { getUser, guard } from "../../guard.mjs";

app.get("/users", guard, async (req, res) => {
  if (getUser(req).isAdmin) {
    res.send(await User.find());
  } else {
    res.status(401).send("User is not authorized");
  }
});

app.get("/users/:id", guard, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(403).send({ message: "User not found" });
  }
  if (getUser(req).isAdmin || user._id == getUser(req)._id) {
    res.send(user);
  } else {
    res.status(401).send("User is not authorized");
  }
});

app.put("/users/:id", guard, async (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(403).send({ message: "User not found" });
  }
  if (user._id == getUser(req)._id) {
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.address = address;
    user.updatedAt = new Date();

    await user.save();
    res.send(user);
  } else {
    res.status(401).send("User is not authorized");
  }
});

app.patch("/users/:id", guard, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(403).send({ message: "User not found" });
  }
  if (user._id == getUser(req)._id) {
    user.isBusiness = !user.isBusiness;
    await user.save();
    res.send(user);
  }
});

app.delete("/users/:id", guard, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (
      getUser(req).isAdmin ||
      user._id.toString() === getUser(req)._id.toString()
    ) {
      await User.findByIdAndDelete(req.params.id);
      res.send("User deleted");
    } else {
      res.status(401).send("User is not authorized");
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
