import { Catridge } from './Catridge';
import { PersonA } from './PersonA';
import { PersonB } from './PersonB';
import { PersonC } from './PersonC';
import { PersonD } from './PersonD';
import { PersonE } from './PersonE';
import { PersonF } from './PersonF';
import { PersonG } from './PersonG';
import { PersonH } from './PersonH';
import { PersonI } from './PersonI';
import { PersonJ } from './PersonJ';
import { PersonK } from './PersonK';
import { PersonL } from './PersonL';

export const avatars = {
  Catridge: Catridge,
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
