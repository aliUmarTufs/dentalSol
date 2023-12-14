import Link from "next/link";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { ROUTES } from "../constants";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Subnav() {
  const router = useRouter();
  const path = router.asPath;

  let home = false;
  let courses = false;
  let products = false;
  let directory = false;
  let billing = false;
  let account = false;
  let partners = false;

  if (path == ROUTES.DASHBOARD) {
    home = true;
  } else if (path == "/dashboard/courses") {
    courses = true;
  } else if (path == "/dashboard/products") {
    products = true;
  } else if (path == "/dashboard/companies") {
    companies = true;
  } else if (path == "/dashboard/billing") {
    billing = true;
  } else if (path == "/dashboard/account") {
    account = true;
  } else if (path == "/dashboard/partners") {
    partners = true;
  }

  const navigation = [
    { name: "Dashboard Home", href: ROUTES.DASHBOARD, current: home },
    { name: "Saved Courses", href: "/dashboard/courses", current: courses },
    { name: "Saved Products", href: "/dashboard/products", current: products },
    {
      name: "Saved Directory Companies",
      href: "/dashboard/companies",
      current: directory,
    },
    { name: "Billing", href: "/dashboard/billing", current: billing },
    { name: "Your Account", href: "/dashboard/account", current: account },
    { name: "Partner Page", href: "/dashboard/partners", current: partners },
  ];

  return (
    <Disclosure as="header" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
            <nav
              className="hidden lg:py-2 lg:flex lg:space-x-8"
              aria-label="Global"
            >
              {navigation.map((item) => (
                <Link href={item.href} key={item.name}>
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                      "rounded-md py-2 px-3 inline-flex items-center text-sm font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </Disclosure>
  );
}
