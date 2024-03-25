
export function getTableColumns(fields: string[]) {
    return fields.map((field) => {
        return {
            name: field,
            selector: (row) => row[field],
        };
    });
}
