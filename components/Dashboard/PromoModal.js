export default function Promo() {
  return (
    <div className="bg-gray-50 sm:rounded-lg border border-gray-300 flex px-4 py-5 sm:p-6 items-center justify-between">
      <div className="">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          It&apos;s tax season
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Dent247 has partnered with Aberfoyle accounting to save you up to{" "}
            <span className="font-semibold">$3000</span> this tax season. Check
            out this exclusive deal for Ontario dentists.
          </p>
        </div>
      </div>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
      >
        Save with Aberfoyle &rarr;
      </button>
    </div>
  );
}
