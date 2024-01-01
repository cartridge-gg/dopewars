import { DATA_ASSET_KEYS } from "../assets/asset-keys";

DATA_ASSET_KEYS;
export class DataUtils {
  static getAnimations(scene: any) {
    const data = scene.cache.json.get(DATA_ASSET_KEYS.ANIMATIONS);

    return data;
  }
}
