"use client";

import { useTranslations } from "next-intl";
import { RiAddCircleFill } from "react-icons/ri";

function Projects() {
  const translations = useTranslations("projects")

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase text-neutral-500 ">
          {translations("projects")}
        </p>
        <RiAddCircleFill
          onClick={() => {}}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      Projects
    </div>
  );
}

export default Projects;
