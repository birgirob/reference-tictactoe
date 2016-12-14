Given [Events],
When [Command],
Then [Resulting Event(s)]

-------------------------


- Create game
Given [ ],
When [ CreateGame() ],
Then [ GameCreated(id=1) ]

- Join game
Given [ GameCreated(id=1) ],
When [ JoinGame(id=1) ],
Then [ GameJoined(id=1) ]

- Join full game
Given [ GameCreated(id=1), GameJoined(id=1) ],
When [ JoinGame(id=1) ],
Then [ FullGameJoinAttempted() ]

- Leave game
Given [ GameJoined(id=1) ],
When [ LeaveGame(id=1) ],
Then [ PlayerLeftGame(id=1) ]

- Place legal move
Given [ GameCreated(id=1), GameJoined(id=1) ],
When [ PlaceMove(0,0,X) ],
Then [ MovePlaced(0,0,X) ]

- Place illegal move (square occupied)
Given [ PlaceMove(0,0,X) ],
When [ PlaceMove(0,0,O) ],
Then [ IllegalMove("Square occupied") ]

- Place illegal move (not your turn)
Given [ PlaceMove(0,0,X) ],
When [ PlaceMove(0,1,X ],
Then [ IllegalMove("Not your turn") ]

- Place winning move (horizontal)
Given [ PlaceMove(0,0,X), PlaceMove(0,1,X) ],
When [ PlaceMove(0,2,X) ],
Then [ PlayerWon(X) ]

- Place winning move (vertical)
Given [ PlaceMove(0,0,X), PlaceMove(1,0,X) ],
When [ PlaceMove(2,0,X) ],
Then [ PlayerWon(X) ]

- Place winning move (diagonal)
Given [ PlaceMove(0,0,X), PlaceMove(1,1,X) ],
When [ PlaceMove(2,2,X) ],
Then [ PlayerWon(X) ]

- Place drawing move
Given [ MoveCount = 8 ],
When [ PlaceMove(X) ],
Then [ GameDraw() if not PlayerWon(X) ]


