import { Global } from "@emotion/react";

import colors from "./colors";

const GlobalStyles = () => (
  <Global
    styles={`

    #chakra-toast-manager-top-left {
      margin-top: 50px;
    }
    
    @media only screen and (min-width : 768px) {
      #chakra-toast-manager-top-left {
        margin-top: 70px;
      }
    }
     

      .ka-table-wrapper{
        padding: 16px;
      }

      .ka-table{
        width: 100%;
      }

      .ka-table thead{
        text-align: left;
        text-transform: uppercase;
        font-weight: 400;
        border-bottom: solid 1px ${colors.neon["700"]};
      }

      .ka-row{
        border-bottom: solid 1px ${colors.neon["700"]};
      }

      .ka-cell, .ka-thead-cell{
        padding: 4px;
      }

      .ka-input {
          width: 100%;
          padding: 4px;
          min-width: 50px;
          background: ${colors.neon["800"]};
          border-color: ${colors.neon["500"]};
      }

      // .rdt_TableHeadRow {
      //   text-transform: uppercase;
      // }

      // .rdt_Table,
      // .rdt_TableHead,
      // .rdt_TableHeadRow,
      // .rdt_TableBody,
      // .rdt_TableRow {
      //   background-color: transparent;
      //   color: ${colors.neon["400"]};
      // }
     
      // .rdt_TableRow {
      //   min-height: 30px;
      // }

      // .rdt_TableCell {
      //   height: 30px;
      // }

    `}
  />
);

export default GlobalStyles;
