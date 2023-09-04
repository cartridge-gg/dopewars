import React, { ReactNode } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { StyleProps } from "@chakra-ui/react";


type ScrollbarProps = {
  autoHeightMin? : string,
  autoHeightMax? : string,
}
export const Scrollbar = ({
  children,
  ...props
}: { children: ReactNode } & ScrollbarProps) => {
  return (
    <Scrollbars
      autoHeight
      hideTracksWhenNotNeeded
      className="scrollbar-container"
      renderTrackHorizontal={(props) => (
        <div {...props} className="scrollbar-horizontal" />
      )}
      renderTrackVertical={(props) => (
        <div {...props} className="scrollbar-vertical" />
      )}
      renderThumbHorizontal={(props) => (
        <div {...props} className="thumb-horizontal" />
      )}
      renderThumbVertical={(props) => (
        <div {...props} className="thumb-vertical" />
      )}
      renderView={(props) => <div {...props} className="scrollbar-view" />}
      universal
      {...props}
    >
      {children}
    </Scrollbars>
  );
};
