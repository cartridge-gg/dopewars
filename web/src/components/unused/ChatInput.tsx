import { Button, Input } from "@/components/common";
import { SendMessage } from "@/components/icons";

export interface ChatInputProps {
  value: string;
  onChange: (_: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

export const ChatInput = ({ value, onChange, onSend, ...props }: ChatInputProps & React.HTMLAttributes<HTMLDivElement>) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && value) {
      onSend();
    }
  };

  return (
    <div className="flex w-full gap-2" {...props}>
      <Input
        placeholder="Say Something!"
        className="bg-neon-700 px-3 py-0 hover:bg-neon-600 focus:bg-neon-600"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <Button className="px-[6px]" isDisabled={!value} onClick={onSend}>
        <SendMessage size="lg" />
      </Button>
    </div>
  );
};
