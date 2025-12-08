import { cn } from "@/utils/cn";
import { Dispatch, SetStateAction, useState } from "react";
import { ArrowInput } from "../icons";

export interface DropdownOptionProps {
  label?: string;
  text: string;
  value: number | string;
}

interface DropdownProps {
  options: DropdownOptionProps[];
  selectedOption: DropdownOptionProps;
  setSelectedOption: Dispatch<SetStateAction<DropdownOptionProps>>;
  className?: string;
}

export const Dropdown = ({ options, selectedOption, setSelectedOption, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const onOptionClicked = (value: DropdownOptionProps) => () => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="flex items-center w-full cursor-pointer" onClick={toggleOpen}>
        <span>{selectedOption.text}</span>
        {selectedOption.label && <span className="text-yellow-400 ml-2">{selectedOption.label}</span>}
        <div className="flex-1" />
        <ArrowInput direction="down" size="md" />
      </div>
      {isOpen && (
        <div className="absolute top-full w-full p-1 bg-neon-700 z-[999]">
          <div className="flex flex-col w-full gap-0.5 bg-neon-600">
            {/* Selected option */}
            {options.map(
              (option) =>
                option.value === selectedOption.value && (
                  <DropdownOption option={option} active onClick={onOptionClicked(option)} key={option.value} />
                ),
            )}
            {/* Other options */}
            {options.map(
              (option) =>
                option.value != selectedOption.value && (
                  <DropdownOption option={option} onClick={onOptionClicked(option)} key={option.value} />
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownOption = ({
  active,
  option,
  onClick,
}: {
  active?: boolean;
  option: DropdownOptionProps;
  onClick?: () => void;
}) => (
  <div
    className={cn(
      "group flex items-center w-full py-3 px-1.5 gap-2 bg-neon-700 cursor-pointer",
      active ? "text-neon-200" : "text-neon-500",
      "hover:text-neon-900 hover:bg-neon-200"
    )}
    onClick={onClick}
  >
    <span>{option.text}</span>
    {option.label && (
      <span className={cn(
        active ? "text-yellow-400" : "text-neon-500",
        "group-hover:text-neon-900"
      )}>
        {option.label}
      </span>
    )}
  </div>
);
