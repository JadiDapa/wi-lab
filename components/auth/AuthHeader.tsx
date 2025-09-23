import Image from "next/image";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="">
      <div className="flex items-center justify-center gap-3">
        <div className="relative size-8 lg:size-14">
          <Image
            src="/images/icon.png"
            alt="logo"
            fill
            className="object-contain object-center"
          />
        </div>
        <div className="text-primary text-4xl font-semibold tracking-wide">
          <p style={{ textShadow: "3px 3px 1px #38bdf8" }}>WI-LAB</p>
        </div>
      </div>
      <h1 className="text-primary mt-6 text-center text-3xl font-medium lg:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm">{subtitle}</p>
    </div>
  );
}
