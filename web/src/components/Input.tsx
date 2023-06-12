import {
  Input as ChakraInput,
  InputProps,
  StyleProps,
  Text,
  Box,
  keyframes,
} from "@chakra-ui/react";
import { ReactNode, useLayoutEffect, useState, useRef } from "react";
import useCaretPosition from "use-caret-position";

const blinkAnim = keyframes`  
  0% {opacity: 0.5;}   
  60% {opacity: 0.5;}   
  61% {opacity: 0;}   
  100% {opacity: 0;}   
`;

const Input = ({ ...props }: StyleProps & InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const { x, y, getPosition, getSelection } = useCaretPosition(inputRef);

  const updateCaretPosition = (e) => {
    setTimeout(() => {
      getPosition(inputRef);
    }, 10);
  };

  const onFocus = (e) => {
    updateCaretPosition(e);
    setIsFocused(true);
  };

  const onBlur = (e) => {
    updateCaretPosition(e);
    setIsFocused(false);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        margin: "0",
      }}
    >
      <ChakraInput
        ref={inputRef}
        onClick={updateCaretPosition}
        onKeyDown={updateCaretPosition}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
        style={{
          caretColor: "transparent",
          marginLeft: "8px",
        }}
      />
      {isFocused && (
        <Box
          className="custom-caret"
          style={{
            width: "10px",
            height: "1.2em",
            backgroundColor: "var(--chakra-colors-neon-200)",
            position: "fixed",
            left: `${x}px`,
            top: `${y}px`,
            zIndex: 99,
            marginLeft: "-1.5px",
            marginTop: "6px",
            transition: "none",
            borderRadius: "3px",
            overflow: "visible",
          }}
          animation={`${blinkAnim} infinite 1.2s linear`}
        ></Box>
      )}
    </div>
  );
};

export default Input;
