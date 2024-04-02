import { useDojoContext, useSystems } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";

import { Table, useTable } from "ka-table";
import { ActionType, DataType, SortingMode } from "ka-table/enums";
import { useState } from "react";
import { editComponents } from "./tables";

const columns = [
  { key: "cash", title: "cash", dataType: DataType.Number },
  { key: "health", title: "health", dataType: DataType.Number },
  { key: "max_turns", title: "max_turns", dataType: DataType.Number },
  { key: "max_wanted_shopping", title: "max_wanted_shopping", dataType: DataType.Number },
  { key: "rep_drug_step", title: "rep_drug_step", dataType: DataType.Number },
  { key: "rep_buy_item", title: "rep_buy_item", dataType: DataType.Number },
  { key: "rep_carry_drugs", title: "rep_carry_drugs", dataType: DataType.Number },
  { key: "editColumn", width: 80 },
];

// rep_pay_cops: 6, // NEGATIVE
// rep_pay_gang: 3, // NEGATIVE
// rep_run_cops: 3,
// rep_run_gang: 1,
// rep_fight_cops: 4,
// rep_fight_gang: 3,


export const GameConfigTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();

  const { updateGameConfig } = useSystems();

  const [data, setData] = useState([config?.config.game_config] || []);

  const table = useTable({
    onDispatch: (action) => {
      console.log(action);

      if (action.type === ActionType.UpdateEditorValue) {
        setData([
          {
            ...data[0],
            [action.columnKey]: action.value,
          },
        ]);
      }

      // triggered twice ... why ?
      if (action.type === ActionType.SaveRowEditors) {
        if(data && data[0] ){
          updateGameConfig(data[0]);
        }
      }

      if (action.type === ActionType.CloseRowEditors) {
        setData([config?.config.game_config]);
      }
    },
  });

  return (
    <Table
      width="100%"
      table={table}
      columns={columns}
      data={data}
      rowKeyField={"key"}
      sortingMode={SortingMode.Single}
      childComponents={editComponents}
    />
  );
});
