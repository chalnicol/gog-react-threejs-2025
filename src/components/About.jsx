import React from "react";

const About = () => {
	return (
		<div className="w-11/12 max-w-3xl border border-gray-500 py-6 mx-auto rounded my-10 shadow-xl bg-white">
			<div className="w-11/12 mx-auto text-gray-600 text-justify text-sm">
				{/* about the project */}
				<div className="space-y-2">
					<h2 className="text-xl text-gray-700 font-semibold">
						About The Project
					</h2>

					<p>
						Welcome to my Game of the Generals project—a modern
						reimagining of the classic Filipino strategy game! This app
						merges the timeless tactical gameplay of the original with
						cutting-edge technology to create an immersive, visually
						engaging experience.
					</p>
					<p>
						The project is built using React for the user interface,
						styled with Tailwind CSS for a clean and responsive design.
						The 3D visuals, powered by Three.js, bring the game board and
						pieces to life, making each match dynamic and captivating.
						Real-time functionality is achieved through Socket.IO and a
						Node.js backend, ensuring smooth interactions between players.
					</p>
					<p>
						As the builder of this app, my goal is to preserve the spirit
						of this beloved game while crafting a platform that’s
						accessible and enjoyable for a modern audience. Although I am
						not the creator of Game of the Generals, I am proud to
						contribute to its legacy by developing this digital version
						for enthusiasts and newcomers alike.
					</p>
				</div>

				{/* about me */}
				<div className="mt-7 space-y-2">
					<h2 className="text-xl text-gray-700 font-semibold">About Me</h2>

					{/* <div className="flex items-center">
						<img
							src="/images/user_icon.jpg"
							alt=""
							className="aspect-square w-12 h-auto"
						/>
						<h3 className="text-lg font-bold">Charlou E. Nicolas</h3>
					</div> */}
					<p>
						I’m a passionate web developer with a love for combining
						creativity and technology to bring ideas to life. My expertise
						includes React, Tailwind CSS, Node.js, and Three.js, and I
						enjoy building applications that are both visually stunning
						and functionally robust.
					</p>
					<p>
						This project is a reflection of my dedication to continuous
						learning and my drive to create meaningful experiences through
						software development. When I’m not coding, I’m exploring new
						technologies, experimenting with creative projects, or diving
						deep into strategy games like Game of the Generals.
					</p>
					<p>
						If you're interested in learning more about me or working with
						me on a project, feel free to reach out. I'm always open to
						discussing projects, collaborations, or simply passionate
						about technology and its potential to bring joy and excitement
						to others.
					</p>

					<hr className="border-0 border-b border-gray-400 shadow-lg my-6" />

					<div className="flex gap-x-3">
						<a
							href="https://www.facebook.com/charlou.nicolas"
							className="text-blue-800 hover:text-blue-600"
							target="_blank"
							rel="noopener noreferrer"
						>
							Facebook
						</a>
						<a
							href="https://github.com/chalnicol"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-800 hover:text-blue-600"
						>
							Github
						</a>
						<a
							href="https://www.linkedin.com/in/charlou-nicolas-ba201432/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-800 hover:text-blue-600"
						>
							LinkedIn
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
