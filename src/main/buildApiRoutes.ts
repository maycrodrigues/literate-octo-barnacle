import { Router } from 'express';
import { GetAllContacts } from '../application/use-cases/contact/GetAllContacts';
import { SaveContact } from '../application/use-cases/contact/SaveContact';
import { GetAllDemands } from '../application/use-cases/demand/GetAllDemands';
import { GetDemandById } from '../application/use-cases/demand/GetDemandById';
import { SaveDemand } from '../application/use-cases/demand/SaveDemand';
import { GetAllMembers } from '../application/use-cases/member/GetAllMembers';
import { SaveMember } from '../application/use-cases/member/SaveMember';
import { GetSettings } from '../application/use-cases/settings/GetSettings';
import { SaveSettings } from '../application/use-cases/settings/SaveSettings';
import { MongoContactRepository } from '../infrastructure/repositories/MongoContactRepository';
import { MongoDemandRepository } from '../infrastructure/repositories/MongoDemandRepository';
import { MongoMemberRepository } from '../infrastructure/repositories/MongoMemberRepository';
import { MongoSettingsRepository } from '../infrastructure/repositories/MongoSettingsRepository';
import { ContactController } from '../presentation/controllers/ContactController';
import { DemandController } from '../presentation/controllers/DemandController';
import { MemberController } from '../presentation/controllers/MemberController';
import { SettingsController } from '../presentation/controllers/SettingsController';
import { buildContactRoutes } from '../presentation/routes/contactRoutes';
import { buildDemandRoutes } from '../presentation/routes/demandRoutes';
import { buildMemberRoutes } from '../presentation/routes/memberRoutes';
import { buildSettingsRoutes } from '../presentation/routes/settingsRoutes';

export const buildApiRoutes = () => {
  const router = Router();

  const demandRepository = new MongoDemandRepository();
  const demandController = new DemandController(
    new GetAllDemands(demandRepository),
    new GetDemandById(demandRepository),
    new SaveDemand(demandRepository)
  );

  const memberRepository = new MongoMemberRepository();
  const memberController = new MemberController(new GetAllMembers(memberRepository), new SaveMember(memberRepository));

  const contactRepository = new MongoContactRepository();
  const contactController = new ContactController(new GetAllContacts(contactRepository), new SaveContact(contactRepository));

  const settingsRepository = new MongoSettingsRepository();
  const settingsController = new SettingsController(new GetSettings(settingsRepository), new SaveSettings(settingsRepository));

  router.use('/demands', buildDemandRoutes(demandController));
  router.use('/members', buildMemberRoutes(memberController));
  router.use('/contacts', buildContactRoutes(contactController));
  router.use('/settings', buildSettingsRoutes(settingsController));

  return router;
};
