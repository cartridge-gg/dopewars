import { ChildrenOrConnect } from "@/components/wallet";
import { Button } from "@chakra-ui/react";
import { closeRowEditors, openRowEditors, saveRowEditors } from "ka-table/actionCreators";
import { ICellEditorProps, ICellTextProps } from "ka-table/props";

export const EditButton: React.FC<ICellTextProps> = ({ dispatch, rowKeyValue }) => {
  return (
    <div className="edit-cell-button">
      <Button onClick={() => dispatch(openRowEditors(rowKeyValue))}>EDIT</Button>
    </div>
  );
};

export const SaveButton: React.FC<ICellEditorProps> = ({ dispatch, rowKeyValue }) => {
  return (
    <div className="buttons" style={{ display: "flex", justifyContent: "space-between" }}>
      <Button
        onClick={() => {
          dispatch(saveRowEditors(rowKeyValue));
        }}
      >
        SAVE
      </Button>

      <Button
        onClick={() => {
          dispatch(closeRowEditors(rowKeyValue));
        }}
      >
        CANCEL
      </Button>
    </div>
  );
};

export const editComponents = {
  cellText: {
    content: (props: any) => {
      if (props.column.key === "editColumn") {
        return (
          <ChildrenOrConnect>
            <EditButton {...props} />
          </ChildrenOrConnect>
        );
      }
    },
  },
  cellEditor: {
    content: (props: any) => {
      if (props.column.key === "editColumn") {
        return (
          <ChildrenOrConnect>
            <SaveButton {...props} />
          </ChildrenOrConnect>
        );
      }
    },
  },
};
