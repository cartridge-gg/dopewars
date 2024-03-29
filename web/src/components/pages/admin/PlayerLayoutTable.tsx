import { useDojoContext } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";
import DataTable from "react-data-table-component";

// bigint not supported ...
// const columns = getTableColumns(["name", "idx", "bits"]);

const columns = [
  {
    name: "name",
    selector: (row: any) => row["name"],
  },
  {
    name: "idx",
    selector: (row: any) => Number(row["idx"]),
  },
  {
    name: "bits",
    selector: (row: any) => Number(row["bits"]),
  },
];

export const PlayerLayoutTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();
  return <DataTable columns={columns} data={config?.config.layouts.player || []} />;
});
