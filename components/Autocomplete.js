import "@algolia/autocomplete-theme-classic";
import { autocomplete } from "@algolia/autocomplete-js";
import React, { createElement, Fragment, useEffect, useRef } from "react";
import { render } from "react-dom";

export default function Autocomplete(props) {
	const containerRef = useRef(null);

	useEffect(() => {
		if (!containerRef.current) {
			return undefined;
		}

		const search = autocomplete({
			debug: props.debug,
			placeholder: "Start searching",
			classNames: {
				detachedSearchButton:
					"block w-full bg-white border border-gray-300 rounded-md p-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-2xl",
				form: "block w-full bg-white border border-gray-300 rounded-md p-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-2xl",
			},
			detachedMediaQuery: "(max-width: 100px)",
			container: containerRef.current,
			renderer: { createElement, Fragment },
			render({ children }, root) {
				render(children, root);
			},
			...props,
		});

		return () => {
			search.destroy();
		};
	}, [props]);

	return (
		<div
			ref={containerRef}
			className="custom-ac block w-full bg-white border border-gray-300 rounded-md p-3 md:p-5 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-2xl"
		/>
	);
}
