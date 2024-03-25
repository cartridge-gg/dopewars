import { useDojoContext } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";
import DataTable from "react-data-table-component";
import { customTableStyles, getTableColumns } from "./tables";

const columns = getTableColumns(["slot", "id", "slot_id", "name", "initial_tier"]);

export const HustlerItemBaseTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();
  return <DataTable customStyles={customTableStyles} columns={columns} data={config?.items} />;
});
