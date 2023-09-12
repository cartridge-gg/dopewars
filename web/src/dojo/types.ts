export enum Location {
  Queens,
  Bronx,
  Brooklyn,
  Coney,
  Jersey,
  Central,
}

export enum Drug {
  Acid,
  Weed,
  Ludes,
  Speed,
  Heroin,
  Cocaine,
}

export enum Action {
  Pay,
  Run,
}

export enum Outcome {
  Paid,
  Escaped,
  Captured,
}

export interface LocationInfo {
  type: Location;
  name: string;
  slug: string;
  id: string;
  icon: React.FC;
}

export interface DrugInfo {
  type: Drug;
  name: string;
  slug: string;
  id: string;
  icon: React.FC;
}

export interface OutcomeInfo {
  type: Outcome;
  name: string;
  imageSrc: string;
  getNarration: (isInitial: boolean) => string;
  color: string;
}
