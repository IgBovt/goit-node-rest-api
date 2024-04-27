import contactsServices from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import crypto from "node:crypto";

export const getAllContacts = async (req, res, next) => {
  const contactsList = await contactsServices.listContacts();

  try {
    res.status(200).send(contactsList);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsServices.getContactById(id);

  try {
    if (contact) {
      res.status(200).send(contact);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsServices.removeContact(id);

  try {
    if (contact) {
      res.status(200).send(contact);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;

  const { error, value } = createContactSchema.validate({ name, email, phone });
  console.log(error);
  if (typeof error !== "undefined") {
    return res.status(400).send({ message: "Fields must be filled" });
  }

  try {
    const contact = await contactsServices.addContact(name, email, phone);
    res.status(201).send({ id: crypto.randomUUID(), ...value });
  } catch (error) {
    next(error);
  }
};

export const updateContact = (req, res) => {};

// http://localhost:3000/api/contacts
// http://localhost:3000/api/contacts/:id
// {"name": "Harry", "email": "Harry@gmail.com", "phone": "00000000000"}
