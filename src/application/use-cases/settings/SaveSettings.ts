import type { ISettingsRepository } from "../../../domain/repositories/ISettingsRepository";
import type { Settings } from "../../../domain/entities/Settings";

export class SaveSettings {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(settings: Settings): Promise<Settings> {
    return this.settingsRepository.save(settings);
  }
}
