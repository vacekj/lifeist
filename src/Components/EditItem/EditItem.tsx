import React from "react";
import { useParams } from "react-router-dom";

const EditItem = () => {
	let { id } = useParams();

	return (
		<div className="flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between p-3 border-b border-gray-300">
				<button>
					<svg
						fill="currentColor"
						className={"text-gray-900 w-8 h-8"}
						viewBox="0 0 20 20"
					>
						<path
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
							fillRule="evenodd"
						/>
					</svg>
				</button>
				<h1 className="text-2xl">Edit item</h1>
				<button>
					<svg className="text-gray-900 w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clipRule="evenodd"
							fillRule="evenodd"
						/>
					</svg>
				</button>
			</div>
			{/* Form */}
			<div>
				<form className="flex flex-col justify-center w-full p-3">
					<label className="text-gray-700">Name</label>
					<input className="bg-gray-200 w-full mb-3 rounded h-10 p-2 " />
					<label className="text-gray-700">Description</label>
					<textarea className="resize-none bg-gray-200 w-full rounded h-40 p-2" />
				</form>
			</div>
		</div>
	);
};

export default EditItem;
