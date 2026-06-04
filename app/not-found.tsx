import Link from "next/link";
import Placeholder from "@/components/Placeholder";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <Placeholder
        title="404 — Not found"
        note="This piece may have moved or sold out."
      />
      <div className="pb-16 text-center">
        <Link
          href="/"
          className="text-primary underline underline-offset-4 hover:text-accent"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
