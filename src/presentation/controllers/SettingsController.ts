import type { Request, Response } from 'express';
import type { GetSettings } from '../../application/use-cases/settings/GetSettings';
import type { SaveSettings } from '../../application/use-cases/settings/SaveSettings';
import type { Settings } from '../../domain/entities/Settings';
import { logger } from '../../shared/utils/logger';

export class SettingsController {
  constructor(
    private getSettings: GetSettings,
    private saveSettings: SaveSettings
  ) {}

  getAll = async (_req: Request, res: Response) => {
    const settings = await this.getSettings.execute();
    logger.settings('Fetched all settings', { count: settings.length });
    res.json(settings);
  };

  save = async (req: Request<unknown, unknown, Settings>, res: Response) => {
    const settings = req.body;
    const result = await this.saveSettings.execute(settings);
    logger.settings('Settings synced', { id: settings.id });
    res.json(result);
  };
}
