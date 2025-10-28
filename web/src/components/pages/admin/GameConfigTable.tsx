import { useDojoContext, useSystems } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";

import { Table, useTable } from "ka-table";
import { ActionType, DataType, SortingMode } from "ka-table/enums";
import { useEffect, useState } from "react";
import { editComponents } from "./tables";
import { useGameConfig } from "@/dojo/hooks/useGameConfig";
import { Dopewars_V0_GameConfig as GameConfig } from "@/generated/graphql";

const columns = [
  { key: "season_version", title: "season", dataType: DataType.Number },
  { key: "cash", title: "initial cash", dataType: DataType.Number },
  { key: "health", title: "initial health", dataType: DataType.Number },
  { key: "max_turns", title: "max turns", dataType: DataType.Number },
  { key: "max_wanted_shopping", title: "max wanted shopping", dataType: DataType.Number },
  { key: "rep_drug_step", title: "rep drug step", dataType: DataType.Number },
  { key: "rep_buy_item", title: "rep buy item", dataType: DataType.Number },
  { key: "rep_carry_drugs", title: "rep carry drugs", dataType: DataType.Number },
  { key: "rep_hospitalized", title: "rep hospitalized", dataType: DataType.Number },
  { key: "rep_jailed", title: "rep jailed", dataType: DataType.Number },
];

export const GameConfigTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();

  // const { updateGameConfig } = useSystems();

  //useGameConfigQuery
  const { gameConfig } = useGameConfig(config?.ryo.season_version);
  const [data, setData] = useState<GameConfig[]>([]);

  useEffect(() => {
    if (gameConfig) {
      setData([gameConfig]);
    }
  }, [gameConfig]);

  const table = useTable({});

  return (
    <div className="table-vertical">
      <Table
        width="100%"
        table={table}
        columns={columns}
        data={data}
        rowKeyField={"season_version"}
        sortingMode={SortingMode.Single}
      />
    </div>
  );
});
