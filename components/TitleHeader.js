import Link from "next/link";
import { useRouter } from "next/router";
import { ROUTES } from "../constants";
import { supabase } from "../lib/supabaseClient";

export default function TitleHeader({ title }) {
  const user = supabase.auth.user();

  return (
    <header className="bg-white shadow-sm border-b mb-8">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-lg leading-6 font-semibold text-gray-900">
          {title}
        </h1>
        {user ? (
          // <Link href = '/new/tip'>
          //     <button
          //         type="button"
          //         className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          //     >
          //         Post Tip &rarr;
          //     </button>
          // </Link>
          <></>
        ) : (
          <Link href={ROUTES.LOGIN}>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log In &rarr;
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
