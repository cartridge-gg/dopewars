import { useDojoContext } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";
import DataTable from "react-data-table-component";
import { customTableStyles, getTableColumns } from "./tables";

const columns = getTableColumns(["drug", "drug_id", "name", "base", "step", "weight"]);

export const DrugTable = observer(() => {
  const {
    configStore: { config },
  } = useDojoContext();
  return <DataTable customStyles={customTableStyles} columns={columns} data={config?.drug} />;
});
