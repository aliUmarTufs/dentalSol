import { supabase } from "../../../lib/supabaseClient";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, Footer } from "../../../components";
import { PlusIcon } from "@heroicons/react/solid";
import {
  CalendarIcon,
  ClockIcon,
  PhotographIcon,
  TableIcon,
  ViewBoardsIcon,
  ViewListIcon,
} from "@heroicons/react/outline";
import { ROUTES } from "../../../constants";

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [loginRequired, setLoginRequired] = useState(false);
  const [profile, setProfile] = useState([]);
  const [organization, setOrganization] = useState([]);

  const fetchUser = async () => {
    const user = supabase.auth.user();

    if (user) {
      setUser(user);
      setLoading(false);

      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id);

      setProfile(data[0]);
      fetchOrganization(data[0].controlled_organization);
    } else {
      setUser(null);
      setLoginRequired(true);
      setLoading(false);
    }
  };

  const fetchOrganization = async (organization_id) => {
    const user = supabase.auth.user();

    if (user) {
      setUser(user);
      setLoading(false);

      const { data, error } = await supabase
        .from("organizations")
        .select()
        .eq("id", organization_id);

      setOrganization(data[0]);
    } else {
      setUser(null);
      setLoginRequired(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    if (loginRequired) {
      return (
        <div>
          You need to log in to access this page. Login{" "}
          <Link href={`${ROUTES.LOGIN}`}>
            <a className="text-blue-600">here</a>
          </Link>
          .
        </div>
      );
    } else {
      return (
        <div>
          <Navbar isDashboard={true} />
          <div className="p-8">
            <h1 className="font-semibold text-2xl mb-4 flex ">
              <span className="mr-4 ">Manage {organization.name}</span>
              <CreditComponent organization={organization} />
            </h1>
            <WelcomeComponent />
            <CreateComponent />
            <Campaigns />
          </div>
          <Footer />
        </div>
      );
    }
  }
}

export const WelcomeComponent = () => {
  return (
    <div className="bg-gray-50 sm:rounded-lg border flex justify-between">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Want to reach thousands of dentists?
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Our sales team will be happy to assist you with anything you need.
            You&apos;ll only pay for leads we get you, not number of views.
          </p>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6 flex items-center">
        <Link href="mailto:sales@dent247.com">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
          >
            Contact sales
          </button>
        </Link>
      </div>
    </div>
  );
};

export const CreateComponent = () => {
  return (
    <div className="mt-8 mb-8">
      <h2 className="text-lg font-medium text-gray-900">
        Add to your company&apos;s presence
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Build up your brand on Dent247 and reach more dentists.
      </p>
      <ul
        role="list"
        className="mt-6 border-t border-b border-gray-200 py-6 grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {items.map((item, itemIdx) => (
          <li key={itemIdx} className="flow-root">
            <div className="relative -m-2 p-2 flex items-center space-x-4 rounded-xl hover:bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500">
              <div
                className={classNames(
                  item.background,
                  "flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-lg"
                )}
              >
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  <Link href={item.href}>
                    <a className="focus:outline-none flex items-center text-center">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {item.free ? (
                        <span className="border border-green-600 mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white-100 text-green-600">
                          <svg
                            className="-ml-0.5 mr-1.5 h-2 w-2 text-green-600 animate-pulse"
                            fill="currentColor"
                            viewBox="0 0 8 8"
                          >
                            <circle cx={4} cy={4} r={3} />
                          </svg>
                          Free
                        </span>
                      ) : (
                        <></>
                      )}
                      {item.title} <span aria-hidden="true"> &rarr;</span>
                    </a>
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex">
        <Link href="mailto:sales@dent247.com">
          <a className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Or talk to sales &rarr;
          </a>
        </Link>
      </div>
    </div>
  );
};

export const Campaigns = () => {
  const campaigns = [];
  return (
    <>
      <div className="mt-8 mb-8">
        <h2 className="text-lg font-medium text-gray-900">
          Your Advertising Campaigns
        </h2>
        <p className="mt-1 mb-8 text-sm text-gray-500">
          View and manage your active campaigns. You only pay for clicks and
          leads that Dent247 gets you.
        </p>
        {campaigns.length == 0 ? (
          <NoCampaigns />
        ) : (
          <ul className="mt-6 border-t border-b border-gray-200 py-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <NoCampaigns />
          </ul>
        )}
        <div className="mt-4 flex">
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Get support &rarr;
          </a>
        </div>
      </div>
    </>
  );
};

export const NoCampaigns = () => {
  return (
    <div className="text-center items-center justify-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new campaign. Get a $50 credit, on us.
      </p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Campaign
        </button>
      </div>
    </div>
  );
};

export const CreditComponent = ({ organization }) => {
  return (
    <>
      {organization.credit_used == false ? (
        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <svg
            className="-ml-1 mr-1.5 h-2 w-2 text-green-600"
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <circle cx={4} cy={4} r={3} />
          </svg>
          You have ${organization.balance} in credit remaining
        </span>
      ) : (
        <></>
      )}
    </>
  );
};

const items = [
  {
    title: "Add your product",
    description: "Another to-do system you’ll try but eventually give up on.",
    icon: ViewListIcon,
    background: "bg-pink-500",
    free: true,
    href: "/new/product",
  },
  {
    title: "Promote your products",
    description: "Make your product appear first. Only pay for clicks.",
    icon: CalendarIcon,
    background: "bg-yellow-500",
    free: false,
    href: "/new/product",
  },
  {
    title: "Write a blog post",
    description: "Great for mood boards and inspiration.",
    icon: PhotographIcon,
    background: "bg-green-500",
    free: true,
    href: "/new/product",
  },
  {
    title: "Promote your course",
    description: "Bump your course in our rankings. Only pay for clicks.",
    icon: ViewBoardsIcon,
    background: "bg-blue-500",
    free: false,
    href: "/new/product",
  },
  {
    title: "Advertise",
    description: "Get banner ads for your product on our newsletter",
    icon: TableIcon,
    background: "bg-blue-500",
    free: false,
    href: "/new/product",
  },
  {
    title: "Add your course",
    description: "Get a birds-eye-view of your procrastination.",
    icon: ClockIcon,
    background: "bg-purple-500",
    free: true,
    href: "/new/product",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export async function getStaticProps() {
  return {
    props: {
      isProtected: true,
    },
  };
}
