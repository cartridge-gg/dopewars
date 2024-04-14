import { useDojoContext, useSystems } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";

import { Table, useTable } from "ka-table";
import { ActionType, DataType, SortingMode } from "ka-table/enums";
import { useState } from "react";
import { shortString } from "starknet";
import { editComponents } from "./tables";

const columns = [
  { key: "icon",  width: 80  },
  { key: "drug", title: "drug", dataType: DataType.String },
  { key: "drug_id", title: "drug_id", dataType: DataType.Number },
  { key: "name", title: "name", dataType: DataType.String },
  { key: "base", title: "base", dataType: DataType.Number },
  { key: "step", title: "step", dataType: DataType.Number },
  { key: "weight", title: "weight", dataType: DataType.Number },
  { key: "editColumn", width: 80 },
];

export const DrugTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();

  const { updateDrugConfig } = useSystems();

  const [data, setData] = useState(config?.drug || []);

  const table = useTable({
    onDispatch: (action) => {
      // console.log(action);

      if (action.type === ActionType.UpdateEditorValue) {
        const toUpdateIndex = data.findIndex((i) => i.drug_id === action.rowKeyValue);
        const toUpdate = {
          ...data[toUpdateIndex],
          [action.columnKey]: action.value,
        };

        data.splice(toUpdateIndex, 1, toUpdate);

        setData(data);
      }

      // triggered twice ... why ?
      if (action.type === ActionType.SaveRowEditors) {
        const update = data.find((i) => i.drug_id === action.rowKeyValue);
        if (!update) return;

        const newValue = {
          drug: update.drug_id,
          drug_id: update.drug_id,
          base: update.base,
          step: update.step,
          weight: update.weight,
          name: shortString.encodeShortString(update.name),
        };
        updateDrugConfig(newValue);
      }

      if (action.type === ActionType.CloseRowEditors) {
        setData(config!.drug);
      }
    },
  });

  return (
    <Table
      width="100%"
      table={table}
      columns={columns}
      data={data}
      rowKeyField={"drug_id"}
      sortingMode={SortingMode.Single}
      childComponents={editComponents}
    />
  );
});
