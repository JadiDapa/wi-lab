import Image from "next/image";
import Link from "next/link";
import { RiFacebookFill, RiInstagramFill, RiTwitterFill } from "react-icons/ri";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const resourcesLinks = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Products",
    link: "/product",
  },
  {
    label: "Categories",
    link: "/categories",
  },
  {
    label: "Contact",
    link: "/contact",
  },
  {
    label: "About",
    link: "/about",
  },
];

const categoryLink = [
  {
    label: "Headphone",
    link: "/",
  },
  {
    label: "Speaker",
    link: "/product",
  },
  {
    label: "Earbuds",
    link: "/categories",
  },
];

const socialMediaLinks = [
  {
    link: "/",
    Icon: RiInstagramFill,
  },
  {
    link: "/product",
    Icon: RiFacebookFill,
  },
  {
    link: "/categories",
    Icon: RiTwitterFill,
  },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-primary bottom-0 left-0 border-t">
      <div className="flex flex-col gap-6 px-6 py-8 lg:px-32">
        <div className="relative mx-auto flex w-full flex-col gap-6">
          <div className="flex w-full flex-col justify-between gap-9 text-sm md:gap-20 lg:flex-row">
            <div className="flex flex-col gap-3">
              <figure className="flex items-center gap-6">
                <figure className="relative h-18 w-40">
                  <Image
                    src={"/images/logo.png"}
                    alt="Logo GIZMO"
                    fill
                    className="object-contain object-center brightness-0 invert filter"
                  />
                </figure>
              </figure>
              <div className="text-primary-foreground flex flex-col gap-1">
                <h4 className="text-lg font-bold">2P8J+2VQ</h4>
                <p className="text-lg leading-relaxed tracking-wide lg:w-[70%]">
                  Jl. Dwikora II No.1220, Demang Lebar Daun, Kec. Ilir Bar. I,
                  Kota Palembang, Sumatera Selatan 30137
                </p>
              </div>
              <div className="mt-4 flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="placeholder:text-background w-60 rounded-r-none"
                />
                <Button className="bg-background text-primary rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-8 tracking-wide max-lg:justify-between md:flex-row lg:gap-14 xl:gap-28">
              <div className="flex flex-col gap-2 md:gap-6">
                <h4 className="border-background text-primary-foreground w-fit text-lg font-bold lg:text-xl">
                  Links
                </h4>
                <ul className="flex flex-col gap-2 text-base text-slate-500 md:gap-3 md:text-lg">
                  {resourcesLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.link}
                        className="text-primary-foreground duration-200 hover:opacity-75"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 md:gap-6">
                <h4 className="border-background text-primary-foreground w-fit text-lg font-bold lg:text-xl">
                  Products
                </h4>
                <ul className="flex flex-col gap-2 text-base text-slate-500 md:gap-3 md:text-lg">
                  {categoryLink.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.link}
                        className="text-primary-foreground duration-200 hover:opacity-75"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-6 px-6 py-4 lg:px-32">
        {" "}
        <div className="flex w-full items-center justify-between">
          <small className="text-primary-foreground text-base font-medium">
            &copy; Copyright {new Date().getFullYear()} Integra. All rights
            reserved.
          </small>
          <ul className="flex gap-2 text-base text-slate-500 md:gap-4 md:text-lg">
            {socialMediaLinks.map((link) => (
              <a
                href={link.link}
                key={link.link}
                className="text-primary-foreground grid size-12 place-items-center rounded-full border text-3xl duration-200 hover:opacity-75"
              >
                <link.Icon />
              </a>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
