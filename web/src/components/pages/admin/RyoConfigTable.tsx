import { useDojoContext, useSystems } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";

import { Table, useTable } from "ka-table";
import { ActionType, DataType, SortingMode } from "ka-table/enums";
import { useState } from "react";
import { editComponents } from "./tables";

const columns = [
  // { key: "key", title: "key", dataType: DataType.Number },
  { key: "initialized", title: "initialized", dataType: DataType.Boolean },
  { key: "paused", title: "paused", dataType: DataType.Boolean },
  { key: "season_version", title: "season_version", dataType: DataType.Number },
  { key: "season_duration", title: "season_duration", dataType: DataType.Number },
  { key: "season_time_limit", title: "season_time_limit", dataType: DataType.Number },
  { key: "paper_fee", title: "paper_fee", dataType: DataType.Number },
  { key: "paper_reward_launderer", title: "paper_reward_launderer", dataType: DataType.Number },
  { key: "treasury_fee_pct", title: "treasury_fee_pct", dataType: DataType.Number },
  // { key: "treasury_balance", title: "treasury_balance", dataType: DataType.Number },
  // { key: "editColumn", width: 80 },
];

export const RyoConfigTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();

  // const { updateGameConfig } = useSystems();

  const [data, setData] = useState([config?.config.ryo_config] || []);

  const table = useTable();

  return (
    <div className="table-vertical">
      <Table
        width="100%"
        table={table}
        columns={columns}
        data={data}
        rowKeyField={"key"}
        sortingMode={SortingMode.Single}
        childComponents={editComponents}
      />
    </div>
  );
});
