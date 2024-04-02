import { useDojoContext } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";

import { Table } from "ka-table";
import { DataType, EditingMode, SortingMode } from "ka-table/enums";

const columns = [
  { key: "slot", title: "slot", dataType: DataType.String },
  { key: "tier", title: "tier", dataType: DataType.Number },
  { key: "slot_id", title: "slot_id", dataType: DataType.Number },
  { key: "cost", title: "cost", dataType: DataType.Number },
  { key: "stat", title: "stat", dataType: DataType.Number },
];

export const HustlerItemTiersTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();

  return (
    <Table
      width="100%"
      columns={columns}
      data={config?.tiers || []}
      rowKeyField={"id"}
      editingMode={EditingMode.None}
      sortingMode={SortingMode.Single}
    />
  );
});
