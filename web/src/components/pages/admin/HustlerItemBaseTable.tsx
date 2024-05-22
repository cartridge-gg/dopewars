import { useDojoContext } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";

import { Table } from "ka-table";
import { DataType, EditingMode, FilteringMode } from "ka-table/enums";
import { editComponents } from "./tables";

const columns = [
  { key: "icon", width: 80 },
  { key: "slot", title: "slot", dataType: DataType.String },
  { key: "id", title: "id", dataType: DataType.Number },
  { key: "slot_id", title: "slot_id", dataType: DataType.Number },
  { key: "name", title: "name", dataType: DataType.String },
  { key: "initial_tier", title: "initial_tier", dataType: DataType.Number },
];

export const HustlerItemBaseTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();

  return (
    <Table
      width="100%"
      columns={columns}
      data={config?.items || []}
      rowKeyField={"name"}
      editingMode={EditingMode.None}
      filteringMode={FilteringMode.HeaderFilter}
      childComponents={editComponents}
    />
  );
});
