import { OG } from "./OG";

export const Loader = ({ text = "LOADING ..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <img src="/images/loading.gif" alt="loading" className="w-[60px] h-[60px] m-auto" />
      <span className="font-broken-console text-xs text-neon-500">{text}</span>
    </div>
  );
};

export const OGLoader = ({ text = "LOADING ..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <OG id={Math.floor(Math.random() * 500)} />
      <span className="font-broken-console text-xs text-neon-500">{text}</span>
    </div>
  );
};

export const SmallLoader = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <img src="/images/loading.gif" alt="loading" className="w-6 h-6 m-auto" />
    </div>
  );
};
