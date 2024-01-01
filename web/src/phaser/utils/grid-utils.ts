import { DIRECTION } from "../common/direction";
import { TILE_SIZE } from "../world/config";
import { exhaustiveGuard } from "./guard";

export function getTargetPositionFromGameObjectPositionAndDirection(
  currentPosition: any,
  direction: any
) {
  const targetPosition = { ...currentPosition };
  switch (direction) {
    case DIRECTION.DOWN:
      targetPosition.y += TILE_SIZE;
      break;
    case DIRECTION.UP:
      targetPosition.y -= TILE_SIZE;
      break;
    case DIRECTION.LEFT:
      targetPosition.x -= TILE_SIZE;
      break;
    case DIRECTION.RIGHT:
      targetPosition.x += TILE_SIZE;
      break;
    case DIRECTION.NONE:
      break;
    default:
      // We should never reach this default case
      exhaustiveGuard(direction as never);
  }
  return targetPosition;
}
