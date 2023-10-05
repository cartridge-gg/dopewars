import { PersonA } from "./PersonA";
import { PersonB } from "./PersonB";
import { PersonC } from "./PersonC";
import { PersonD } from "./PersonD";
import { PersonE } from "./PersonE";
import { PersonF } from "./PersonF";
import { PersonG } from "./PersonG";
import { PersonH } from "./PersonH";
import { PersonI } from "./PersonI";
import { PersonJ } from "./PersonJ";
import { PersonK } from "./PersonK";
import { PersonL } from "./PersonL";

export const avatars = {
  PersonA: PersonA,
  PersonB: PersonB,
  PersonC: PersonC,
  PersonD: PersonD,
  PersonE: PersonE,
  PersonF: PersonF,
  PersonG: PersonG,
  PersonH: PersonH,
  PersonI: PersonI,
  PersonJ: PersonJ,
  PersonK: PersonK,
  PersonL: PersonL,
};

export type AvatarName = keyof typeof avatars;

// super simple way to generate an avatar from an address,
// the least significant byte of the address is used to get the avatar
export const genAvatarFromAddress = (address: String) => {
  const avatarKeys = Object.keys(avatars);
  const avatarIndex = parseInt(address.slice(-2), 16) % avatarKeys.length;
  return avatarKeys[avatarIndex] as AvatarName;
};
