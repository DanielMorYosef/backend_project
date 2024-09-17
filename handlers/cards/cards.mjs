import { app } from "../../app.mjs";
import { bussinessGuard, getUser, guard } from "../../guard.mjs";
import { Card } from "./cards.model.mjs";
import validateCard from "./cards.joi.mjs";

app.get("/cards", async (req, res) => {
  res.send(await Card.find());
});

app.get("/cards/my-cards", guard, bussinessGuard, async (req, res) => {
  const user = getUser(req);
  res.send(await Card.find({ user_id: user._id }));
});

app.post("/cards", guard, bussinessGuard, async (req, res) => {
  try {
    const item = req.body;
    const validatedCard = validateCard(item);

    const card = new Card({
      title: validatedCard.title,
      subtitle: validatedCard.subtitle,
      description: validatedCard.description,
      phone: validatedCard.phone,
      email: validatedCard.email,
      address: {
        state: validatedCard.address.state,
        country: validatedCard.address.country,
        city: validatedCard.address.city,
        street: validatedCard.address.street,
        houseNumber: validatedCard.address.houseNumber,
        zip: validatedCard.address.zip,
      },
      image: {
        url: validatedCard.image.url,
        alt: validatedCard.image.alt,
      },
      web: validatedCard.web,
      user_id: getUser(req)?._id,
    });
    const newCard = await card.save();
    res.status(201).send(newCard);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get("/cards/:id", async (req, res) => {
  const card = await Card.findById(req.params.id);
  if (!card) {
    return res.status(404).send();
  }
  res.send(card);
});

app.put("/cards/:id", guard, bussinessGuard, async (req, res) => {
  try {
    const user = getUser(req);

    if (!user) {
      return res.status(401).send("User is not authenticated");
    }

    const cardId = req.params.id;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send("Card not found");
    }

    if (card.user_id.toString() !== user._id.toString() && !user.isAdmin) {
      return res.status(403).send("User is not authorized to update this card");
    }

    const updateData = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      image: req.body.image,
      web: req.body.web,
      updatedAt: new Date(),
    };

    const updatedCard = await Card.findByIdAndUpdate(cardId, updateData, {
      new: true,
    });

    res.send(updatedCard);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.patch("/cards/:id", guard, async (req, res) => {
  try {
    const user = getUser(req);
    const cardId = req.params.id;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send("Card not found");
    }
    if (card.likes.includes(user._id)) {
      card.likes = card.likes.filter(
        (id) => id.toString() !== user._id.toString()
      );
    } else {
      card.likes.push(user._id);
    }
    await card.save();
    res.status(200).send(card);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.delete("/cards/:id", guard, bussinessGuard, async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) {
      return res.status(401).send("User is not authenticated");
    }

    const cardId = req.params.id;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send("Card not found");
    }

    if (card.user_id.toString() !== user._id.toString() && !user.isAdmin) {
      return res.status(403).send("User is not authorized to delete this card");
    }

    await Card.findByIdAndDelete(cardId);
    res.send("Card deleted");
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
