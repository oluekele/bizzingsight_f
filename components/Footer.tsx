import { Watermark } from "@/components/Watermark";

export function Footer() {
  return (
    <footer className="p-4 bg-white shadow mt-auto flex justify-center items-center text-sm text-gray-500">
      <Watermark />
    </footer>
  );
}
