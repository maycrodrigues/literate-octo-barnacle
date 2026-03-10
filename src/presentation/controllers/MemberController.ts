import type { Request, Response } from 'express';
import type { GetAllMembers } from '../../application/use-cases/member/GetAllMembers';
import type { SaveMember } from '../../application/use-cases/member/SaveMember';
import type { Member } from '../../domain/entities/Member';
import { logger } from '../../shared/utils/logger';

export class MemberController {
  constructor(
    private getAllMembers: GetAllMembers,
    private saveMember: SaveMember
  ) {}

  getAll = async (_req: Request, res: Response) => {
    const members = await this.getAllMembers.execute();
    logger.member('Fetched all members', { count: members.length });
    res.json(members);
  };

  save = async (req: Request<unknown, unknown, Member>, res: Response) => {
    const member = req.body;
    logger.member('Syncing member', { id: member.id, active: member.active });
    const result = await this.saveMember.execute(member);
    logger.member('Member synced', { id: member.id });
    res.json(result);
  };
}
