import { useDojoContext, useSystems } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";

import { Table, useTable } from "ka-table";
import { ActionType, DataType, SortingMode } from "ka-table/enums";
import { useState } from "react";
import { editComponents } from "./tables";

const columns = [
  { key: "image",  width: 100  },
  { key: "id", title: "id", dataType: DataType.Number },
  { key: "encounter", title: "encounter", dataType: DataType.String },
  { key: "level", title: "level", dataType: DataType.Number },
  //
  { key: "health", title: "health", dataType: DataType.Number },
  { key: "attack", title: "attack", dataType: DataType.Number },
  { key: "defense", title: "defense", dataType: DataType.Number },
  { key: "speed", title: "speed", dataType: DataType.Number },
  //
  { key: "rep_pay", title: "rep_pay", dataType: DataType.Number },
  { key: "rep_run", title: "rep_run", dataType: DataType.Number },
  { key: "rep_fight", title: "rep_fight", dataType: DataType.Number },
  //
  { key: "min_rep", title: "min_rep", dataType: DataType.Number },
  { key: "max_rep", title: "max_rep", dataType: DataType.Number },
  // 
  // { key: "payout", title: "payout", dataType: DataType.Number },
  // { key: "demand_pct", title: "demand_pct", dataType: DataType.Number },

  { key: "editColumn", width: 80 },
];

export const EncounterTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();

  const { updateEncounterConfig } = useSystems();

  const [data, setData] = useState(config?.encounters || []);

  const table = useTable({
    onDispatch: (action) => {

      // triggered on cell modifs
      if (action.type === ActionType.UpdateEditorValue) {
        const toUpdateIndex = data.findIndex((i) => i.id === action.rowKeyValue);
        const toUpdate = {
          ...data[toUpdateIndex],
          [action.columnKey]: action.value,
        };

        data.splice(toUpdateIndex, 1, toUpdate);

        setData(data);
      }

      // triggered twice ... why ?
      if (action.type === ActionType.SaveRowEditors) {
        const update = data.find((i) => i.id === action.rowKeyValue);
        if (!update) return;

        const newValue = {
          ...update,
          encounter: update.encounter === "Cops" ? 0 : 1,
        };
        delete newValue.image;
      //  console.log(newValue)
        updateEncounterConfig(newValue);
      }

      if (action.type === ActionType.CloseRowEditors) {
        setData(config!.encounters);
      }
    },
  });

  return (
    <Table
      width="100%"
      table={table}
      columns={columns}
      data={data}
      rowKeyField={"id"}
      sortingMode={SortingMode.Single}
      childComponents={editComponents}
    />
  );
});
