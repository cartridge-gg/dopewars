import { useDojoContext } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";
import DataTable from "react-data-table-component";
import { getTableColumns } from "./tables";

const columns = getTableColumns(["slot", "id", "slot_id", "name", "initial_tier"]);

export const HustlerItemBaseTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();
  return <DataTable columns={columns} data={config?.items || []} />;
});
