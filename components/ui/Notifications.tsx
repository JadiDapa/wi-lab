import { Bell } from "lucide-react";
import { Popover, PopoverTrigger } from "../ui/popover";

export default function Notifications() {
  return (
    <Popover>
      <PopoverTrigger className="relative">
        <Bell strokeWidth={1.8} size={24} />
        <div className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-red-500">
          <p className="text-xs text-white">{[]?.length}</p>
        </div>
      </PopoverTrigger>
      {/* {[] && (
        <PopoverContent align="end" className="bg-tertiary w-96 p-0">
          <div className="relative flex items-center justify-between border-b px-6 py-4">
            <p className="">Notifications</p>
            <div className="bg-primary/70 rounded-md px-3 py-0.5 text-sm text-white">
              <p>{[].length} New</p>
            </div>
          </div>
          <div className="">
            {[].map((r) => (
              <Link
                href={`/requests/${r.id}`}
                key={r.id}
                className="flex cursor-pointer items-center gap-6 border-b p-4 transition hover:bg-slate-100"
              >
                <div className="bg-primary grid size-10 place-items-center rounded-full">
                  <p className="text-xl text-white">{"DA"}</p>
                </div>
                <div className="">
                  <p className="text-sm">
                    Request from{" "}
                    <span className="text-primary font-medium">
                      {r.username}
                    </span>
                  </p>
                  <p className="text-sm font-light">
                    {r.username} is requesting {r.RequestItem.length} type of
                    items
                  </p>
                  <p className="text-sm font-light text-slate-400">
                    {formatDate(new Date(r.createdAt) as unknown as string)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </PopoverContent>
      )} */}
    </Popover>
  );
}
