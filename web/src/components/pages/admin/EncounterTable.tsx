import { useDojoContext, useSystems } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";

import { Table, useTable } from "ka-table";
import { ActionType, DataType, SortingMode } from "ka-table/enums";
import { useState } from "react";
import { editComponents } from "./tables";

const columns = [
  // { key: "image", width: 100 },
  { key: "encounter", title: "encounter", dataType: DataType.String },
  { key: "encounters_mode", title: "encounters_mode", dataType: DataType.String },

  { key: "health_base", title: "health_base", dataType: DataType.Number },
  { key: "health_step", title: "health_step", dataType: DataType.Number },
  { key: "attack_base", title: "attack_base", dataType: DataType.Number },
  { key: "attack_step", title: "attack_step", dataType: DataType.Number },
  { key: "defense_base", title: "defense_base", dataType: DataType.Number },
  { key: "defense_step", title: "defense_step", dataType: DataType.Number },
  { key: "speed_base", title: "speed_base", dataType: DataType.Number },
  { key: "speed_step", title: "speed_step", dataType: DataType.Number },

  { key: "editColumn", width: 80 },
];

export const EncounterTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();

  const { updateEncounterConfig } = useSystems();

  const [data, setData] = useState(config?.encounterStats || []);

  const table = useTable({
    // onDispatch: (action) => {
    //   // triggered on cell modifs
    //   if (action.type === ActionType.UpdateEditorValue) {
    //     const toUpdateIndex = data.findIndex((i) => i.id === action.rowKeyValue);
    //     const toUpdate = {
    //       ...data[toUpdateIndex],
    //       [action.columnKey]: action.value,
    //     };
    //     data.splice(toUpdateIndex, 1, toUpdate);
    //     setData(data);
    //   }
    //   // triggered twice ... why ?
    //   if (action.type === ActionType.SaveRowEditors) {
    //     const update = data.find((i) => i.id === action.rowKeyValue);
    //     if (!update) return;
    //     const newValue = {
    //       ...update,
    //       encounter: update.encounter === "Cops" ? 0 : 1,
    //     };
    //     delete newValue.image;
    //   //  console.log(newValue)
    //     updateEncounterConfig(newValue);
    //   }
    //   if (action.type === ActionType.CloseRowEditors) {
    //     setData(config!.encounters);
    //   }
    // },
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
