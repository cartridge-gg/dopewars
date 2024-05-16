import { Box, Input as ChakraInput, InputProps, StyleProps, keyframes } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

// @ts-ignore
import useCaretPosition from "use-caret-position";

const blinkAnim = keyframes`  
  0% {opacity: 0.5;}   
  70% {opacity: 0.5;}   
  71% {opacity: 0;}   
  100% {opacity: 0;}   
`;

export const Input = ({ ...props }: StyleProps & InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const { x, y, getPosition, getSelection } = useCaretPosition(inputRef);

  const updateCaretPosition = (e: any) => {
    setTimeout(() => {
      getPosition(inputRef);
    }, 10);
  };

  const onFocus = (e: any) => {
    updateCaretPosition(e);
    setIsFocused(true);
  };

  const onBlur = (e: any) => {
    updateCaretPosition(e);
    setIsFocused(false);
  };

  const handleKeyDown = (e: any) => {
    updateCaretPosition(e);
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  const onScroll = (e: any) => {
    updateCaretPosition(e);
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll, true); // use capturing, not bubbling
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        margin: "0",
      }}
    >
      <ChakraInput
        {...props}
        ref={inputRef}
        onClick={updateCaretPosition}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          caretColor: "transparent",
        }}
        variant="primary"
      />
      {isFocused && (
        <Box
          className="custom-caret"
          style={{
            position: "fixed",
            width: "10px",
            height: "1.2em",
            left: `${x}px`,
            top: `${y}px`,
            zIndex: 99,
            marginLeft: "-1px",
            marginTop: "9px",
            transition: "none",
            backgroundColor: "var(--chakra-colors-neon-200)",
            borderRadius: "3px",
            overflow: "visible",
          }}
          animation={`${blinkAnim} infinite 1.2s linear`}
        ></Box>
      )}
    </div>
  );
};
