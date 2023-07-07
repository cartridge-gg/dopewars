export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    ComponentUnion: ["Drug", "Game", "Location", "Market", "Player", "Risks"],
  },
};
export default result;
