import { Global } from "@emotion/react";

import colors from "./colors";

const GlobalStyles = () => (
  <Global
    styles={`
      * {
        user-select: none;
      }

      #chakra-toast-manager-top-left {
        margin-top: 50px;
      }
      
      @media only screen and (min-width : 768px) {
        #chakra-toast-manager-top-left {
          margin-top: 0px;
        }
      }

      html .ka {
        background-color: transparent;
      }

      html .ka-thead-background {
        background-color: transparent;
      }
     
      // .ka-table-wrapper{
      //   padding: 16px;
      // }

      // .ka-table{
      //   width: 100%;
      // }

      html .ka-table thead{
        text-align: left;
        text-transform: uppercase;
        font-weight: 400;
        border-bottom: solid 1px ${colors.neon["700"]};
      }

      html .ka-row{
        border-top: solid 1px ${colors.neon["700"]};
        border-bottom: solid 1px ${colors.neon["700"]};
      }

      html .ka-thead-cell{
        color:${colors.neon["500"]};
      }

      html .ka-cell{
        color:${colors.neon["400"]};
      }

      html .ka-cell, html .ka-thead-cell{
        padding: 4px;
      }

      html .ka-header-filter-button-icon {
        left: 0;
        color:${colors.neon["500"]};
      }

      html .ka-header-filter-button.ka-header-filter-button-has-value .ka-icon-filter {
        color:${colors.neon["400"]};
      }

      html .ka-popup{
        background-color:${colors.neon["700"]};
      }

      html .ka-popup-content-item-value {
        padding: 4px;
        color:${colors.neon["400"]};
      }

      .ka-input {
          width: 100%;
          padding: 4px;
          min-width: 50px;
          background: transparent;
          border-color: ${colors.neon["500"]};
      }


      .table-vertical {
        .ka {
          // width: 400px;
          table {
            border-collapse: collapse;
          }

          colgroup{
            display: none;
          }

          /* Force table to not be like tables anymore */
          table,
          thead,
          tbody,
          th,
          td,
          tr {
            display: block;
          }

          table{
            display: flex;
            flex-direction: row;
          }

          th, td {
            height:40px;
          }
      
          th{
            border-bottom: 1px solid;
            border-color: ${colors.neon["700"]};
          }
      
          td.ka-cell {
             border-bottom: 1px solid;
             border-color: ${colors.neon["700"]};
           }
        }
      }



    `}
  />
);

export default GlobalStyles;
