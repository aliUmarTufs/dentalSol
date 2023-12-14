export default function Button({ children, className, ...rest }) {
  let classes =
    "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  if (rest.disabled) {
    classes = "bg-gray-400 cursor-not-allowed";
  }
  return (
    <button
      className={`border border-transparent rounded-md py-2 px-4 flex items-center justify-center w-full sm:w-auto text-base font-medium text-white ${classes} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
