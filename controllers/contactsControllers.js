import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../models/contact.js";

// ======================= GET ALL CONTACTS ===================================//
// ======================= GET ALL CONTACTS =================================//

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });
    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

// ========================== GET CONTACT BU ID ================================//
// ========================== GET CONTACT BU ID ===============================//

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findOne({ _id: id, owner: req.user.id });
    if (!contact) {
      res.status(404).send({ message: "Not found" });
    }

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

// ======================== DELETE CONTACT ==================================//
// ======================== DELETE CONTACT =================================//

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findOne({ _id: id, owner: req.user.id });
    if (!contact) {
      return res.status(404).send({
        message: "Not found",
      });
    }

    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      res.status(404).send({ message: "Not found" });
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

// =========================== CREATE NEW CONTACT ===============================//
// =========================== CREATE NEW CONTACT ==============================//

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;

  try {
    const { error } = createContactSchema.validate({ name, email, phone });
    if (error) {
      return res.status(400).send({ message: "Fields must be filled" });
    }
    const contact = await Contact.create({
      name,
      email,
      phone,
      owner: req.user.id,
    });
    res.status(201).send(contact);
  } catch (error) {
    next(error);
  }
};

// =========================== UPDATE CONTACT ===============================//
// =========================== UPDATE CONTACT ==============================//

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    const { error } = updateContactSchema.validate({ name, email, phone });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contact = await Contact.findOne({ _id: id, owner: req.user.id });
    if (!contact) {
      return res.status(404).send({
        message: "Not found",
      });
    }

    const result = await Contact.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).send({ message: "Not found" });
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

// =========================== ADD TO FAVORITES CONTACTS ===============================//
// =========================== ADD TO FAVORITES CONTACTS ==============================//

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;

  try {
    const { error } = updateFavoriteSchema.validate({
      favorite,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contact = await Contact.findOne({ _id: id, owner: req.user.id });
    if (!contact) {
      return res.status(404).send({
        message: "Not found",
      });
    }
    const result = await Contact.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).send({ message: "Not found" });
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
