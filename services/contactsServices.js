import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

const readContacts = async () => {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
};

const writeContact = (contact) => {
  return fs.writeFile(contactsPath, JSON.stringify(contact, undefined, 2));
};

//=============================================//
//=============================================//
async function listContacts() {
  return readContacts();
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  const findContact = contacts.find((item) => item.id === contactId);

  if (typeof findContact === "undefined") {
    return null;
  }
  return findContact;
}

async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }
  const removedContact = contacts[index];

  const newContacts = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];
  await writeContact(newContacts);
  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await writeContact(contacts);
  return newContact;
}

export default { listContacts, getContactById, removeContact, addContact };
