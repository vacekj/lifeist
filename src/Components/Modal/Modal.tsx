import React from "react";

export default function Modal(
	props: React.ComponentProps<"div"> & {
		showing: boolean;
		onClose: () => any;
	}
) {
	return (
		<div
			onClick={props.showing ? props.onClose : () => {}}
			className={`${
				props.showing ? "flex" : "hidden"
			} fixed w-full h-full top-0 left-0 items-center justify-center`}
		>
			<div className="absolute w-full h-full bg-gray-900 opacity-50" />

			<div
				className={
					(props.className ?? "") +
					" flex flex-col bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
				}
			>
				<button className="self-end p-3">
					<svg
						fill="currentColor"
						className={"text-gray-600 w-8 h-8"}
						viewBox="0 0 20 20"
					>
						<path
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
							fillRule="evenodd"
						/>
					</svg>
				</button>
				<div className="modal-content py-4 pt-1 text-left px-6">{props.children}</div>
			</div>
		</div>
	);
}
