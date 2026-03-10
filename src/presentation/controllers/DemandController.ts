import type { Request, Response } from 'express';
import type { GetAllDemands } from '../../application/use-cases/demand/GetAllDemands';
import type { GetDemandById } from '../../application/use-cases/demand/GetDemandById';
import type { SaveDemand } from '../../application/use-cases/demand/SaveDemand';
import type { Demand } from '../../domain/entities/Demand';
import { NotFoundError } from '../../shared/errors';
import { logger } from '../../shared/utils/logger';

export class DemandController {
  constructor(
    private getAllDemands: GetAllDemands,
    private getDemandById: GetDemandById,
    private saveDemand: SaveDemand
  ) {}

  getAll = async (_req: Request, res: Response) => {
    const demands = await this.getAllDemands.execute();
    logger.demand('Fetched all demands', { count: demands.length });
    res.json(demands);
  };

  getById = async (req: Request, res: Response) => {
    const demandId = String(req.params.id);
    const demand = await this.getDemandById.execute(demandId);
    if (!demand) {
      throw new NotFoundError('DEMAND_NOT_FOUND', 'Demand not found', { demandId });
    }
    logger.demand('Fetched demand details', { demandId });
    res.json(demand);
  };

  save = async (req: Request<unknown, unknown, Demand>, res: Response) => {
    const demand = req.body;
    const result = await this.saveDemand.execute(demand);
    logger.demand('Demand synced', { demandId: demand.id });
    res.json(result);
  };
}
