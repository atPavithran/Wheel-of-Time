import { SelectHTMLAttributes, ButtonHTMLAttributes } from "react";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`border border-gray-400 rounded-xl px-4 py-2 text-lg bg-[#efe2c6] text-[#5d4c2e] shadow-md ${props.className}`}
    >
      {props.children}
    </select>
  );
}

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-[#724f27] text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-[#5d4c2e] ${props.className}`}
    >
      {props.children}
    </button>
  );
}

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="p-0">{children}</div>
      </div>
    </div>
  );
}
