import type { Request, Response } from 'express';
import type { GetAllContacts } from '../../application/use-cases/contact/GetAllContacts';
import type { SaveContact } from '../../application/use-cases/contact/SaveContact';
import type { Contact } from '../../domain/entities/Contact';
import { logger } from '../../shared/utils/logger';

export class ContactController {
  constructor(
    private getAllContacts: GetAllContacts,
    private saveContact: SaveContact
  ) {}

  getAll = async (_req: Request, res: Response) => {
    const contacts = await this.getAllContacts.execute();
    logger.contact('Fetched all contacts', { count: contacts.length });
    res.json(contacts);
  };

  save = async (req: Request<unknown, unknown, Contact>, res: Response) => {
    const contact = req.body;
    const result = await this.saveContact.execute(contact);
    logger.contact('Contact synced', { id: contact.id });
    res.json(result);
  };
}
