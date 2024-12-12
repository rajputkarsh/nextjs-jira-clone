import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "./dotter-separator";
import Navigation from "./navigation";

function Sidebar() {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/">
        <Image src="/logo/heera.png" width={152} height={56} alt="Logo" />
      </Link>
      <DottedSeparator className="my-4" />
      <Navigation />
    </aside>
  )
}

export default Sidebar;
