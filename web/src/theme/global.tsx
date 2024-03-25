import { Global } from "@emotion/react";

import colors from "./colors";

const GlobalStyles = () => (
  <Global
    styles={`
      #chakra-toast-manager-top-left {
        margin-top: 70px;
      }

      .rdt_TableHeadRow {
        text-transform: uppercase;
      }


      .rdt_Table,
      .rdt_TableHead,
      .rdt_TableHeadRow,
      .rdt_TableBody,
      .rdt_TableRow {
        background-color: transparent;
        color: ${colors.neon["400"]};
      }
     
      .rdt_TableRow {
        min-height: 30px;
      }

      .rdt_TableCell {
        height: 30px;
      }

    `}
  />
);

export default GlobalStyles;
