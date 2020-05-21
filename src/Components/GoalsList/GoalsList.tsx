import React from "react";

const GoalsList = () => {
	const goals = [
		{
			name: "Buy 1 full Bitcoin",
			description: "Stack Satoshis until I reach 1 BTC"
		},
		{
			name: "Get 32 ETH",
			description: "Get 32 ETH to create a validation node (staking)"
		},
		{
			name: "Build first DeFi app",
			description: "Deploy a decentralized application to the Ethereum mainnet within the next year"
		}
	];
	return (
		<div className={"flex flex-col "}>
			<Header />
			{goals.map((g, i) => {
				return <Item key={i} {...g} />;
			})}
		</div>
	);
};

function Header() {
	return (
		<div className="flex justify-between p-3 items-center border-b border-gray-300">
			<h1 className={"text-2xl"}>My bucketlist</h1>
			<button className={"focus:outline-none focus:bg-none"}>
				<svg className={"text-blue-500 w-10 h-10"} fill="currentColor" viewBox="0 0 20 20">
					<path
						d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
						clipRule="evenodd"
						fillRule="evenodd"
					/>
				</svg>
			</button>
		</div>
	);
}

function Item(
	props: React.ComponentProps<"div"> & {
		name: string;
		description: string;
	}
) {
	return (
		<div className="flex flex-col p-3 border-b border-gray-300">
			<div className="text-gray-900 text-lg">{props.name}</div>
			<div className="text-gray-600">{props.description}</div>
		</div>
	);
}

export default GoalsList;
