export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    ComponentUnion: [
      "Drug",
      "Game",
      "Location",
      "Market",
      "Name",
      "Player",
      "Risks",
    ],
  },
};
export default result;
