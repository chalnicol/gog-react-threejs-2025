import React from "react";

const GuideAndGameRules = () => {
	return (
		<div className="rounded-md max-w-6xl mx-auto mt-4 px-4">
			<h1 className="text-2xl font-bold py-2 border border-gray-400 px-6 py-3 shadow rounded">
				Game Guide & Rules
			</h1>

			<div className="px-6 py-3 border border-gray-400 rounded text-sm my-3 shadow">
				<p className="text-gray-700">
					<span className="font-bold">Note : </span>The game does not save
					any progress. Once the browser is closed, all progress is lost.
					Players will need to start fresh each time they enter the game.
				</p>
			</div>

			{/* Using the Interface Section */}
			<section className="mb-6 px-8 pt-6 pb-10 border border-gray-400 rounded shadow">
				<h2 className="text-xl font-semibold mb-2 underline">
					Pre-Game Interface
				</h2>
				<p className="text-gray-700 mb-4">
					The pre-game interface consists of several key panels :{" "}
					<span className="font-semibold">Welcome Page</span>,{" "}
					<span className="font-semibold">Online Players</span>,{" "}
					<span className="font-semibold">View All Games</span>,{" "}
					<span className="font-semibold">Chats</span>, and{" "}
					<span className="font-semibold">About</span>. If you're reading
					this, you're likely on the{" "}
					<span className="font-semibold">Game Guide & Rules</span> panel,
					which is designed to help you navigate through the game's
					interface and understand the rules.
				</p>

				{/* welcome page */}
				<div className="mb-4">
					<h3 className="font-semibold">1. Welcome Page</h3>
					<p className="text-gray-700">
						This panel allows players to quickly start a match by
						selecting:
						<ul className="list-inside list-disc ml-4 my-1">
							<li>
								<strong>Game Type:</strong>

								<ul className="ml-8">
									<li>
										<strong>Classic Mode</strong> - No time limits for
										preparation or turns.
									</li>
									<li>
										<strong>Blitz Mode</strong> - Timed mode with:
										<ul className="ml-4">
											<li>
												<strong>45 seconds preparation time</strong>{" "}
												(to arrange pieces).
											</li>
											<li>
												<strong>30 seconds per turn</strong> to make
												a move.
											</li>
										</ul>
									</li>
								</ul>
							</li>
							<li>
								<strong>Opponent Type:</strong>
								<ul className="ml-8">
									<li>
										<strong>Online Player</strong> - The system
										searches for an available opponent in an open
										room.
									</li>
									<li>
										<strong>AI Opponent</strong> - Play against an
										AI-controlled opponent.
									</li>
								</ul>
							</li>
						</ul>
						Once selections are made, the game begins.
					</p>
				</div>

				{/* Online Players Panel */}
				<div className="mb-4">
					<h3 className="font-semibold">2. Online Players Panel</h3>
					<p className="text-gray-700">
						This panel displays a list of all online players, showing:
						<ul className="list-inside list-disc ml-4 my-1">
							<li>
								<strong>Player ID</strong>
							</li>
							<li>
								<strong>Username</strong>
							</li>
							<li>
								<strong>Current Status</strong> :
								<ul className="ml-9">
									<li>
										<strong>Idle</strong> - Not in a room or game.
									</li>

									<li>
										<strong>Waiting</strong> - Created a room and
										waiting for an opponent to join.
									</li>
									<li>
										<strong>Playing</strong> - Currently in a game.
									</li>
								</ul>
							</li>

							<li>
								<strong>Actions</strong> :
								<ul className="ml-9">
									<li>
										<span className="px-2 text-white text-xs font-bold rounded bg-orange-500">
											Chat
										</span>{" "}
										- Allowing players to interact with one another
										privately.
									</li>
								</ul>
							</li>
						</ul>
					</p>
				</div>

				{/* View All Games Panel */}
				<div className="mb-4">
					<h3 className="font-semibold">3. View All Games Panel</h3>

					<p className="text-gray-700">
						This panel lists all ongoing or created rooms by players. At
						the top of the list, there is an option to create a new game.
						<ul className="list-inside list-disc ml-4 mt-2">
							<li className="mb-2">
								<strong>Create Game Options:</strong>
								<ul className="ml-9 my-1">
									<li>
										<strong>Game Type</strong>: Classic or Blitz
									</li>
									<li>
										<strong> Game Mode</strong>: Free Play or Private
										Match
									</li>
									<li>
										<strong>Allow Spectators</strong>: Yes or No
									</li>
									<li>
										<strong>Invite Player</strong> (optional): Enter
										Player ID (only for Private Matches)
									</li>
								</ul>
							</li>
							<li>
								<strong>Game List :</strong> For each game room, the
								following information is displayed:
								<ul className="ml-9 my-1">
									<li>
										<strong> Game ID</strong>
									</li>
									<li>
										<strong>Username of the Creator</strong>
									</li>
									<li>
										<strong>Game Type</strong>
									</li>
									<li>
										<strong>Game Mode</strong>
									</li>
									<li>
										<strong>Spectator Option</strong>
									</li>
									<li>
										<strong>Game Status</strong>
									</li>
									<li>
										<strong>Actions</strong> (based on ownership) :
										<ul className="ml-4">
											<li>
												<span className="mx-0.5 px-2 text-white text-xs font-bold rounded bg-blue-500">
													Join
												</span>{" "}
												- Join a game room if it's open and waiting
												for players.
											</li>
											<li>
												<span className="mx-0.5 px-2 text-white text-xs font-bold rounded bg-red-500">
													Delete
												</span>{" "}
												- Remove a game room you created (only if
												you're the creator).
											</li>
											<li>
												<span className="mx-0.5 px-2 text-white text-xs font-bold rounded bg-sky-700">
													Invite Player
												</span>{" "}
												- Send an invitation to another player to
												join the game (only available for{" "}
												<span className="font-semibold">
													Private Matches
												</span>
												).
											</li>
										</ul>
									</li>
								</ul>
							</li>
						</ul>
					</p>
				</div>

				{/* Chats Panel */}
				<div className="mb-4">
					<h3 className="font-semibold">4. Chats Panel</h3>
					<p className="text-gray-700">
						This panel displays all private conversations between players.
						It shows messages exchanged and any invites a player has
						received.
					</p>
				</div>

				{/* Game Rules and Interface Panel */}
				<div className="mb-4">
					<h3 className="font-semibold">
						5. Game Guide & Rules Panel (You're Here!)
					</h3>
					<p className="text-gray-700">
						In this panel, you can learn:
						<ul className="list-inside list-disc ml-4">
							<li>
								<strong>How to Use the Interface:</strong> Navigate
								through the game, start games, chat with players, and
								understand panel functions.
							</li>
							<li>
								<strong>Game Rules:</strong> Learn the official game
								rules for Games of the Generals, including piece
								movement, challenge mechanics, and rank hierarchy.
							</li>
						</ul>
					</p>
				</div>

				{/* About Panel */}
				<div className="mb-4">
					<h3 className="font-semibold">6. About Panel</h3>
					<p className="text-gray-700">
						This panel provides background information on the project and
						the developer, including links to their social media.
					</p>
				</div>
			</section>

			{/* In-Game Interface */}
			<section className="mb-6 px-8 pt-6 pb-10 border border-gray-400 rounded shadow">
				<h2 className="text-xl font-semibold mb-2 underline">
					In-Game Interface
				</h2>
				<p className="text-gray-700 mb-4">
					This interface consists of various elements that players use to
					interact with the game, such as the game board, player info,
					prompts, and controls.
				</p>

				<ul className="list-inside list-disc ml-4 my-1 space-y-2">
					<li>
						<strong>Game Board</strong> : Displays the game grid where
						players position and move their pieces during gameplay.
					</li>
					<li>
						<strong>Player Info</strong> : Shows the player's username,
						turn indicator, time remaining (for blitz games), and a
						"Ready" status to indicate when preparations are finished. It
						also displays the "Play Again" indicator when player wishes to
						play another round.
					</li>
					<li>
						<strong>Prompt Messaging</strong> : Displays key messages
						during the game, such as when the game is commencing, if it
						has started, or any other important updates (auto-closes after
						3 seconds or can be manually closed by the player).
					</li>
					<li>
						<strong>Controls Panel</strong> : A panel at the bottom-right
						of the screen that is shown when the game starts. Players can
						toggle it to show or hide. Inside the panel:
						<ul className="ml-8 my-1 list-inside list-disc space-y-1">
							<li>
								<strong>Ready Button</strong> : Indicates when the
								player is ready to start the game. Only visible during
								preparations phase.
							</li>
							<li>
								<strong>Surrender Button</strong> : Quits the current
								game without leaving, marking the surrendering player's
								loss.
							</li>
							<li>
								<strong>Leave Button</strong> : Always visible, allowing
								the player to leave the game at any time..
							</li>
							<li>
								<strong>Send Emoji</strong> : Displays 6 emoji buttons
								players can send to the opposing player during the game
								for interaction.
							</li>
						</ul>
					</li>
				</ul>
			</section>

			{/* Game Rules */}
			<section className="mb-6 px-8 pt-6 pb-10 border border-gray-400 rounded shadow">
				<h2 className="text-xl font-semibold mb-2 underline">Game Rules</h2>
				<p className="text-gray-700 mb-4">
					The game is turn-based, meaning players alternate taking turns to
					move their pieces on the board. Each player must wait for their
					opponent to complete their move before proceeding with their own.
				</p>
				<h3 className="font-semibold">Objective:</h3>
				<p className="text-gray-700 mb-4 px-3">
					The goal of the game is to strategically position and move your
					pieces to either capture the opponent’s Flag or corner it, while
					safeguarding your own Flag. Alternatively, a player wins by
					advancing their Flag to the enemy’s back row, provided no
					opposing pieces are adjacent to it. If the Flag reaches the back
					row without being challenged, the player automatically wins at
					the start of their turn.
				</p>

				<h3 className="font-semibold">Setting Up Pieces:</h3>
				<p className="text-gray-700 mb-4 px-3">
					At the start of the game, each player must place their pieces
					within the first three rows on their side of the board. Pieces
					cannot be placed beyond this area during the initial setup phase.
				</p>

				<h3 className="font-semibold">Making A Challenge:</h3>
				<p className="text-gray-700 mb-4 px-3">
					A challenge occurs when one piece attempts to move into a square
					occupied by an opposing piece. The player declares the challenge
					by moving their piece to the enemy’s square. The outcome is
					determined based on the specific rules of the game, with the
					winning piece remaining on the square and the losing piece being
					removed from the board.
				</p>

				<h3 className="font-semibold">Blitz Game Rule:</h3>
				<p className="text-gray-700 mb-4 px-3">
					In Blitz games, players are given a limited amount of time to
					make their move. If a player fails to make a move within the
					given time, they automatically lose the game. This ensures
					fast-paced gameplay and adds an extra layer of challenge.
				</p>

				<h3 className="font-semibold">Challenge Mechanics:</h3>
				<ul className="list-inside list-disc ml-4 mb-4">
					<li>
						If one piece challenges another, the higher-ranking piece
						wins. The Spy defeats any rank except for Private.
					</li>
					<li>
						If a Flag challenges another Flag, the attacking Flag wins.
					</li>
				</ul>

				<h3 className="font-semibold">Rank Hierarchy</h3>
				<ul className="list-inside list-disc ml-4 mb-4">
					<li>5-Star General</li>
					<li>4-Star General</li>
					<li>3-Star General</li>
					<li>2-Star General</li>
					<li>1-Star General</li>
					<li>Colonel</li>
					<li>Lieutenant Colonel</li>
					<li>Major</li>
					<li>Captain</li>
					<li>1st Lieutenant</li>
					<li>2nd Lieutenant</li>
					<li>Sergeant</li>
					<li>
						Private (The Private is defeated by any higher rank, but the
						Private defeats the Spy)
					</li>
					<li>Spy ( The Spy defeats any rank except for Private.)</li>
					<li>
						Flag (The Flag has no rank but is the most important piece.
						The game is won by capturing the enemy’s Flag or advancing
						your Flag to the enemy's back row.)
					</li>
				</ul>
			</section>

			{/* <div className="text-center  mb-2">-- End --</div> */}
			<div className="flex gap-x-1 justify-center my-6">
				<div className="w-2 h-2 bg-gray-500 rounded-full"></div>
				<div className="w-2 h-2 bg-gray-500 rounded-full"></div>
				<div className="w-2 h-2 bg-gray-500 rounded-full"></div>
			</div>
		</div>
	);
};

export default GuideAndGameRules;
