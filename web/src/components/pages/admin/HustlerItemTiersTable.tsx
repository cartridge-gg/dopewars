import { useDojoContext } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";
import DataTable from "react-data-table-component";
import { getTableColumns } from "./tables";

const columns = getTableColumns(["slot", "tier", "slot_id", "cost", "stat"]);

export const HustlerItemTiersTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();
  return <DataTable columns={columns} data={config?.tiers || []} />;
});
