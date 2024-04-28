import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} from "./contacts.js";

import { program } from "commander";
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse();

const options = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
  try {
    switch (action) {
      case "list":
        const contacts = await listContacts();
        console.table(contacts);
        break;

      case "get":
        if (!id) {
          console.error("Incorrect id!");
          return;
        }
        const contact = await getContactById(id);
        if (contact) {
          console.log("Contact with id", id + ":", contact);
        } else {
          console.log(null, "Contact with id", id, "has not found.");
        }
        break;

      case "add":
        if (!name || !email || !phone) {
          console.log("All area must be filled");
          return;
        }
        const newContact = await addContact(name, email, phone);
        console.log("Contact added:", newContact);
        break;

      case "remove":
        if (!id) {
          console.log("Incorrect id");
          return;
        }
        const removedContact = await removeContact(id);
        if (removedContact) {
          console.log("Removed contact:", removedContact);
        } else {
          console.log("Contact with id", id, "has not found.");
        }
        break;

      default:
        console.warn("\x1B[31m Unknown action type!");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

invokeAction(options);
