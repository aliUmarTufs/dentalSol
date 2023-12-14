export default function PageTitleInfo({ title }) {
  return (
    <div className="bg-light-blue">
      <div className="relative customBgColor bg-bluish-100 overflow-hidden h-64 lg:h-84 flex items-center justify-center">
        <h1 className="font-semibold text-lg md:text-2xl lg:text-4xl mt-44 mb-2 capitalize text-center">
          {title}
        </h1>
      </div>
    </div>
  );
}
