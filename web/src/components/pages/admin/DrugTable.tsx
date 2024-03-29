import { useDojoContext } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";
import DataTable from "react-data-table-component";
import { getTableColumns } from "./tables";

const columns = getTableColumns(["drug", "drug_id", "name", "base", "step", "weight"]);

export const DrugTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();
  return <DataTable  columns={columns} data={config?.drug || []} />;
});
