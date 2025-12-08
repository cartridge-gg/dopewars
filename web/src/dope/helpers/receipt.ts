export function checkTxReceipt(txReceipt: any) {
  if (txReceipt.execution_status != "SUCCEEDED") {
    console.log(txReceipt);
    throw new Error(txReceipt?.revert_reason || "Error");
  }
}
