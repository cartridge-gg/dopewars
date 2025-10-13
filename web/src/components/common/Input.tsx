import { Box, Input as ChakraInput, InputProps, StyleProps, keyframes } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const { x, y, getPosition } = useCaretPosition(inputRef);

  const updateCaretPosition = useCallback(() => {
    setTimeout(() => {
      getPosition(inputRef);
    }, 10);
  }, [getPosition]);

  const onFocus = () => {
    updateCaretPosition();
    setIsFocused(true);
  };

  const onBlur = () => {
    updateCaretPosition();
    setIsFocused(false);
  };

  const handleKeyDown = (e: any) => {
    updateCaretPosition();
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      updateCaretPosition();
    };

    window.addEventListener("scroll", onScroll, true); // use capturing, not bubbling
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateCaretPosition]);

   useEffect(() => {
    setTimeout(() => {
      updateCaretPosition()
    }, 100);
  }, [updateCaretPosition]);

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
