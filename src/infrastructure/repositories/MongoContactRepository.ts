import type { IContactRepository } from "../../domain/repositories/IContactRepository";
import type { Contact } from "../../domain/entities/Contact";
import { ContactModel } from "../database/models/ContactModel";

export class MongoContactRepository implements IContactRepository {
  async findAll(): Promise<Contact[]> {
    return ContactModel.find({}).lean<Contact[]>().exec();
  }

  async findById(id: string): Promise<Contact | null> {
    return ContactModel.findOne({ id }).lean<Contact>().exec();
  }

  async save(contact: Contact): Promise<Contact> {
    const result = await ContactModel.findOneAndUpdate(
      { id: contact.id },
      { ...contact, updatedAt: new Date() },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    )
      .lean<Contact>()
      .exec();
    
    if (!result) {
      throw new Error("Failed to save contact");
    }

    return result;
  }
}
