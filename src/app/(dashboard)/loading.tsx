import { Loader as LoaderIcon } from "lucide-react"

function Loader() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export default Loader