import fs from "fs/promises";
import path from "path";
import { validateContact } from "./utils/validateData.js";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.error("Error reading contacts:", error);
    return [];
  }
}

export async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === contactId) || null;
  } catch (error) {
    throw error;
  }
}

export async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);

    if (index !== -1) {
      const removedContact = contacts.splice(index, 1)[0];
      await fs.writeFile(contactsPath, JSON.stringify(contacts));
      return removedContact;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

export async function addContact(name, email, phone) {
  try {
    const newContact = { name, email, phone };
    const { error } = validateContact(newContact);
    if (error) {
      throw new Error(`Invalid contact data: ${error.message}`);
    }

    const contacts = await listContacts();
    const id = generateUniqueId(contacts);
    const contact = { id, name, email, phone };
    contacts.push(contact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return contact;
  } catch (error) {
    throw error;
  }
}

function generateUniqueId(contacts) {
  const existingIds = new Set(contacts.map((contact) => contact.id));
  let id;
  do {
    id = String(Math.floor(Math.random() * 1e9));
  } while (existingIds.has(id));
  return id;
}
