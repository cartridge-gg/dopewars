import { useDojoContext } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";
import DataTable from "react-data-table-component";
import { customTableStyles } from "./tables";


// bigint not supported ...
// const columns = getTableColumns(["name", "idx", "bits"]);

const columns = [
  {
    name: "name",
    selector: (row) => row["name"],
  },
  {
    name: "idx",
    selector: (row) => Number(row["idx"]),
  },
  {
    name: "bits",
    selector: (row) => Number(row["bits"]),
  },
]

export const PlayerLayoutTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();
  return <DataTable customStyles={customTableStyles} columns={columns} data={config?.config.layouts.player} />;
});
