import { useDojoContext } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";

import { Table } from "ka-table";
import { DataType, EditingMode, SortingMode } from "ka-table/enums";

const columns = [
  { key: "name", title: "name", dataType: DataType.String },
  { key: "idx", title: "idx", dataType: DataType.Number },
  { key: "bits", title: "bits", dataType: DataType.Number },
];

export const PlayerLayoutTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();

  return (
    <Table
      width="100%"
      columns={columns}
      data={config?.config.layouts.player || []}
      rowKeyField={"name"}
      editingMode={EditingMode.None}
      sortingMode={SortingMode.Single}
    />
  );
});



