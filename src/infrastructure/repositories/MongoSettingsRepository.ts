import type { ISettingsRepository } from "../../domain/repositories/ISettingsRepository";
import type { Settings } from "../../domain/entities/Settings";
import { SettingsModel } from "../database/models/SettingsModel";

export class MongoSettingsRepository implements ISettingsRepository {
  async findAll(): Promise<Settings[]> {
    return SettingsModel.find({}).lean<Settings[]>().exec();
  }

  async findById(id: string): Promise<Settings | null> {
    return SettingsModel.findOne({ id }).lean<Settings>().exec();
  }

  async save(settings: Settings): Promise<Settings> {
    const result = await SettingsModel.findOneAndUpdate(
      { id: settings.id },
      { ...settings, updatedAt: new Date() },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    )
      .lean<Settings>()
      .exec();
    
    if (!result) {
      throw new Error("Failed to save settings");
    }

    return result;
  }
}
