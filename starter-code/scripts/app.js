function init() {

  // DOM Variables

  const selectorContainer = document.querySelector('.selector_container')
  const back = document.querySelector('.back')

  // Variables

  let timerId = null

  // Tetris DOM Variables

  const tetrisGameContainer = document.querySelector('.tetris_game_container')
  const tetrisStart = document.querySelector('#tetris_start')
  const tetrisDomScore = document.querySelector('.score')
  const tetrisNextGrid = document.querySelector('.next')
  const tetrisDomBank = document.querySelector('.bank')
  const tetrisDomPause = document.querySelector('#tetris_paused')
  const tetrisTheme = document.querySelector('#theme')
  const tetrisPop = document.querySelector('#pop')
  const tetris = document.querySelector('#tetris')
  const tetrisPlay = document.querySelector('.tetris_selector')

  // TETRIS

  // Tetris Variables 

  const height = 24
  let width = 10
  const sideBarDiff = 6
  const squares = []
  const nextSquares = []
  const bankSquares = []
  let playing = false
  let paused = false
  let x

  class Block {
    constructor() {
      this.initId = initGen()
      this.rotId = rotGen()
      this.init = tetriminos[this.initId][this.rotId]
      this.colour = colourGen()
      this.blocks = this.init()
    }
  }

  let current
  let next
  let bank
  let passing

  let active = []
  let score = 0
  let speed = 500
  let levelUpScore = 250

  let banked = false

  let colourRotator = 4
  const colour1 = 'maroon'
  let colour1Array = []
  const colour2 = 'magenta'
  let colour2Array = []
  const colour3 = 'cyan'
  let colour3Array = []
  const colour4 = 'green'
  let colour4Array = []
  const colour5 = 'gold'
  let colour5Array = []

  const tetriminos = [
    [
      function lo() {
        return [x, x - width, x + width, x + width + width]
      },
      function lo() {
        return [x + width, x + 1 + width, x - 1 - 1 + width, x - 1 + width]
      },
      function lo() {
        return [x - 1, x - width - 1, x - 1 + width, x - 1 + width + width]
      },
      function lo() {
        return [x, x + 1, x - 1 - 1, x - 1]
      }
    ],
    [
      function l() {
        return [x, x + 1, x - 1, x - 1 - width]
      },
      function l() {
        return [x, x - 1 - width, x + width, x - width]
      },
      function l() {
        return [x, x - 1, x + 1, x + 1 + width]
      },
      function l() {
        return [x, x - width, x + width , x - 1 + width]
      }
    ],
    [
      function bl() {
        return [x, x - 1, x + 1, x + 1 - width]
      },
      function bl() {
        return [x, x - width, x + width, x + width + 1]
      },
      function bl() {
        return [x, x - 1, x - 1 + width, x + 1]
      },
      function bl() {
        return [x, x - 1 - width, x - width, x + width]
      }
    ],
    [
      function s() {
        return [x, x - 1, x + width, x - 1 + width]
      },
      function s() {
        return [x, x - 1, x + width, x - 1 + width]
      },
      function s() {
        return [x, x - 1, x + width, x - 1 + width]
      },
      function s() {
        return [x, x - 1, x + width, x - 1 + width]
      }
    ],
    [
      function z() {
        return [x, x - 1, x - width, x - width + 1]
      },
      function z() {
        return [x, x - width, x + 1, x + width + 1]
      },
      function z() {
        return [x, x + 1, x + width, x - 1 + width]
      },
      function z() {
        return [x, x - 1, x - width - 1, x + width]
      }
    ],
    [
      function bz() {
        return [x, x - width, x - width - 1, x + 1]
      },
      function bz() {
        return [x, x + 1, x + 1 - width, x + width]
      },
      function bz() {
        return [x, x - 1, x + width, x + width + 1]
      },
      function bz() {
        return [x, x - width, x - 1, x - 1 + width]
      }
    ],
    [
      function t() {
        return [x, x - 1, x + 1, x - width]
      },
      function t() {
        return [x, x - width, x + 1, x + width]
      },
      function t() {
        return [x, x + 1, x - 1, x + width]
      },
      function t() {
        return [x, x - width, x + width, x - 1]
      }
    ]
  ]

  // Generate Board Functions

  function gridCreate() {
    for (let i = 0; i < height; i++) {
      for (let i = 0; i < width; i++) {
        const square = document.createElement('div')
        square.classList.add('game_square')
        tetrisGameContainer.appendChild(square)
        squares.push(square)
      }
    }
    squares.forEach((item, index) => {
      if (index < width * 4) {
        item.classList.add('invis')
      }
    })
  }

  function nextGridCreate() {
    for (let i = 0; i < width - sideBarDiff; i++) {
      for (let i = 0; i < width - sideBarDiff; i++) {
        const square = document.createElement('div')
        square.classList.add('game_square')
        tetrisNextGrid.appendChild(square)
        nextSquares.push(square)
      }
    }
  }

  function bankGridCreate() {
    for (let i = 0; i < width - sideBarDiff; i++) {
      for (let i = 0; i < width - sideBarDiff; i++) {
        const square = document.createElement('div')
        square.classList.add('game_square')
        tetrisDomBank.appendChild(square)
        bankSquares.push(square)
      }
    }
  }

  // Block property Functions

  function initGen() {
    return Math.floor(Math.random() * (tetriminos.length))
  }

  function rotGen() {
    return Math.floor(Math.random() * 4)
  }

  function colourGen() {
    colourRotator++
    if (colourRotator === 5) {
      colourRotator = 0
    }
    switch (colourRotator) {
      case 0:
        return colour1
      case 1:
        return colour2
      case 2:
        return colour3
      case 3:
        return colour4
      case 4:
        return colour5
    }
  }


  function colourArraySwitch() {
    switch (current.colour) {
      case colour1:
        colour1Array = colour1Array.concat(current.blocks)
        break
      case colour2:
        colour2Array = colour2Array.concat(current.blocks)
        break
      case colour3:
        colour3Array = colour3Array.concat(current.blocks)
        break
      case colour4:
        colour4Array = colour4Array.concat(current.blocks)
        break
      case colour5:
        colour5Array = colour5Array.concat(current.blocks)
        break
    }
  }

  function rotateBlock() {
    if (current.rotId === tetriminos[current.initId].length - 1) { 
      current.rotId = 0
    } else {
      current.rotId++
    }
    current.init = tetriminos[current.initId][current.rotId]
    current.blocks = current.init()
    if ((rightWallRotChecker() || leftWallRotChecker()) && (leftBlockRotChecker() || rightBlockRotChecker()) && !baseChecker()) {
      removeAndRepaint()
    } else {
      if (current.rotId === 0) {
        current.rotId = tetriminos[current.initId].length - 1
      } else {
        current.rotId--
      }
      current.init = tetriminos[current.initId][current.rotId]
      current.blocks = current.init()
    }
    removeAndRepaint()
  }

  function blockPick() {
    current = new Block()
  }

  function nextBlockPick() {
    if (next) {
      current = next
    }
    width = 4
    x = 6
    next = new Block
    nextBlockPaint()
    width = 10
  }

  function nextBlockPaint() {
    nextSquares.forEach(square => square.className = 'game_square')
    next.blocks.forEach(index => nextSquares[index].classList.add(next.colour))
    resetX()
  }

  function removeAndRepaint() {
    squares.forEach(square => square.classList.remove(colour1, colour2, colour3, colour4, colour5))
    current.blocks.forEach(index => squares[index].classList.add(current.colour))
    colour1Array.forEach(index => squares[index].classList.add(colour1))
    colour2Array.forEach(index => squares[index].classList.add(colour2))
    colour3Array.forEach(index => squares[index].classList.add(colour3))
    colour4Array.forEach(index => squares[index].classList.add(colour4))
    colour5Array.forEach(index => squares[index].classList.add(colour5))
  }

  function resetX() {
    x = 15
  }

  function baseCollision() {
    if ((baseChecker() || blockChecker()) && playing) {
      tetrisPop.play()
      active = active.concat(current.blocks)
      colourArraySwitch()
      gameOverFunc()
      resetX()
      scoreFunc()
      nextBlockPick()
    }
  }

  function spliceFromEachColour(z) {
    if (colour1Array.includes(z)) {
      const index = colour1Array.indexOf(z)
      colour1Array.splice(index, 1)
    }
    if (colour2Array.includes(z)) {
      const index = colour2Array.indexOf(z)
      colour2Array.splice(index, 1)
    }
    if (colour3Array.includes(z)) {
      const index = colour3Array.indexOf(z)
      colour3Array.splice(index, 1)
    }
    if (colour4Array.includes(z)) {
      const index = colour4Array.indexOf(z)
      colour4Array.splice(index, 1)
    }
    if (colour5Array.includes(z)) {
      const index = colour5Array.indexOf(z)
      colour5Array.splice(index, 1)
    }
  }

  function moveDownEachColour(inc, z) {
    if (colour1Array[inc] < z) {
      colour1Array[inc] += width
    }
    if (colour2Array[inc] < z) {
      colour2Array[inc] += width
    }
    if (colour3Array[inc] < z) {
      colour3Array[inc] += width
    }
    if (colour4Array[inc] < z) {
      colour4Array[inc] += width
    }
    if (colour5Array[inc] < z) {
      colour5Array[inc] += width
    }
  }

  function scoreFunc() {
    active.sort((a, b) => a - b)
    let n = 0
    for (let i = 0; i < height * width; i += width) {
      const rowComplete = active.filter(item => item >= i && item < (i + width))
      if (rowComplete.length === width) {
        n++
        for (let q = 0; q < rowComplete.length; q++) {
          const index = active.indexOf(rowComplete[q])
          active.splice(index, 1)
          spliceFromEachColour(rowComplete[q])
        }
        for (let q = 0; q < active.length; q++) {
          if (active[q] < rowComplete[0]) {
            active[q] += width
            moveDownEachColour(q, rowComplete[0])
          }
        }
      }
    }
    score += (10 * (n * n))
    tetrisDomScore.innerHTML = score
    speedUp()
  }

  function gravityTimer() {
    baseCollision()
    x += width
    current.blocks = current.init()
    removeAndRepaint()
  }


  function speedUp() {
    if (score > levelUpScore) {
      speed -= 100
      clearInterval(timerId)
      timerId = setInterval(gravityTimer, speed)
      levelUpScore *= 2
    }
  }

  function bankFunc() {
    width = 4
    const bankedX = x
    x = 6
    if (!banked) {
      bank = current
      bank.blocks = bank.init()
      bank.blocks.forEach(index => bankSquares[index].classList.add(bank.colour))
      resetX()
      nextBlockPick()
      banked = true
    } else {
      width = 10 
      x = bankedX
      current.blocks = bank.init()
      if ((rightWallRotChecker() || leftWallRotChecker()) && (leftBlockRotChecker() || rightBlockRotChecker()) && !baseChecker()) {
        x = 6
        width = 4
        passing = current
        current = bank
        bank = passing
        bank.blocks = bank.init()
        bankSquares.forEach(index => index.classList.remove(colour1, colour2, colour3, colour4, colour5))
        bank.blocks.forEach(index => bankSquares[index].classList.add(bank.colour))
        x = bankedX
      }
    }
    width = 10
    current.blocks = current.init()
    removeAndRepaint()
  }

  // Collision detection Functions
  

  function rightWallChecker() {
    return !current.blocks.some(index => index % width === width - 1)
  }

  function leftWallChecker() {
    return !current.blocks.some(index => index % width === 0)
  }

  function rightWallRotChecker() {
    return !current.blocks.some(index => index % width === 0)
  }

  function leftWallRotChecker() {
    return !current.blocks.some(index => index % width === width - 1)
  }

  function baseChecker() {
    return current.blocks.some(index => index + width >= height * width)
  }

  function blockChecker() {
    return current.blocks.some(index => active.includes(index + width))
  }

  function rightBlockChecker() {
    return !current.blocks.some(index => active.includes(index + 1))
  }

  function leftBlockChecker() {
    return !current.blocks.some(index => active.includes(index - 1))
  }

  function leftBlockRotChecker() {
    return !current.blocks.some(index => active.includes(index))
  }

  function rightBlockRotChecker() {
    return !current.blocks.some(index => active.includes(index))
  }

  function startTimer() {
    timerId = setInterval(gravityTimer, speed)
  }
  
  // Button Functions

  function pause() {
    if (paused) {
      tetrisDomPause.style.display = 'block'
    } else {
      tetrisDomPause.style.display = 'none'
    }
  }

  function startFunc() {
    if (!playing) {
      if (!paused) {
        resetFunc()
        blockPick()
        nextBlockPick()
      }
      tetrisTheme.play()
      startTimer()
      tetrisStart.innerHTML = 'Pause'
      paused = false
      playing = true
      pause()
    } else {
      tetrisTheme.pause()
      playing = false
      clearInterval(timerId)
      tetrisStart.innerHTML = 'Play'
      paused = true
      pause()
    }
  }

  function resetFunc() {
    playing = false
    clearInterval(timerId)
    tetrisStart.innerHTML = 'Play'
    tetrisTheme.pause()
    tetrisTheme.currentTime = 0
    active = []
    colour1Array = []
    colour2Array = []
    colour3Array = []
    colour4Array = []
    colour5Array = []
    banked = false
    squares.forEach(square => square.classList.remove(colour1, colour2, colour3, colour4, colour5))
    bankSquares.forEach(index => index.classList.remove(colour1, colour2, colour3, colour4, colour5))
    nextSquares.forEach(index => index.classList.remove(colour1, colour2, colour3, colour4, colour5))
    score = 0
    tetrisDomScore.innerHTML = score
    resetX()
  }

  function stopGame() {
    clearInterval(timerId)
    tryAgainPopUp()
    playing = false
    tetrisStart.innerHTML = 'Play'
    tetrisTheme.pause()
    tetrisTheme.currentTime = 0
  }

  function gameOverFunc(){
    if (active.some(item => item < width * 5)) {
      stopGame()
    }
  }

  function tryAgainPopUp() {
    tetrisDomPause.style.display = 'block'
    tetrisDomPause.innerHTML = 'Bad Luck, Try Again!'
  }

  function keyDownEvents(e) {
    if (playing) {
      if (e.key === 'ArrowRight' && rightWallChecker() && rightBlockChecker()) {
        x++
        current.blocks = current.init()
        removeAndRepaint()
      } else if (e.key === 'ArrowLeft' && leftWallChecker() && leftBlockChecker()) {
        x--
        current.blocks = current.init()
        removeAndRepaint()
      } else if (e.key === 'ArrowDown') {
        clearInterval(timerId)
        timerId = setInterval(gravityTimer, 50)
      } else if (e.key === 'ArrowUp') {
        rotateBlock()
      } else if (e.key === 'z') {
        bankFunc()
      }
    }
  }

  function keyUpEvents(e) {
    if (playing) {
      if (e.key === 'ArrowDown') {
        clearInterval(timerId)
        gravityTimer()
        startTimer()
      }
    }
  }

  function displayTetris() {
    selectorContainer.style.display = 'none'
    tetris.style.display = 'flex'
    back.style.display = 'block'
  }

  nextGridCreate()
  gridCreate()
  bankGridCreate()

  // Event Handlers

  tetrisPlay.addEventListener('click', displayTetris)
  window.addEventListener('keyup', keyUpEvents)
  window.addEventListener('keydown', keyDownEvents)
  tetrisStart.addEventListener('click', startFunc)

  // TETRIS END

  // FL TRON

  // FL Tron DOM Variables

  const flGameContainer = document.querySelector('.fl_tron_container')
  const flTron = document.querySelector('#fl_tron')
  const flStart = document.querySelector('#fl_start')
  const numPlayers = document.querySelector('#num_players')
  const numPlayersSpan = document.querySelector('label > span')
  const players = document.querySelectorAll('.fl_player')
  const flPoint = document.querySelectorAll('.fl_point')
  const flP1Points = document.querySelectorAll('.fl_P1_point')
  const flP2Points = document.querySelectorAll('.fl_P2_point')
  const flP3Points = document.querySelectorAll('.fl_P3_point')
  const flP4Points = document.querySelectorAll('.fl_P4_point')
  const flPlayerName = document.querySelector('#fl_player_name')
  const flWinMessage = document.querySelector('#fl_message')
  const flReset = document.querySelector('.fl_reset')
  const flRoundDom = document.querySelector('#fl_round')
  const flRoundMatch = document.querySelector('#fl_round_match')
  const colourInputs = document.querySelectorAll('.colour_input')
  const flTronPlay = document.querySelector('.fl_tron_selector')

  // Variables

  const flHeight = 80
  const flWidth = 104
  const flSquares = []
  const fl2PStart = ((flHeight * flWidth) / 2) + (flWidth / 4)
  const fl2PStart2 = ((flHeight * flWidth) / 2) + ((flWidth / 4) * 3)
  const fl3PStart = fl2PStart - ((flHeight * flWidth) / 4)
  const fl3PStart2 = fl2PStart2 - ((flHeight * flWidth) / 4)
  const fl3PStart3 = (((flHeight * flWidth) / 4) * 3) + (flWidth / 2)
  const fl4PStart3 = fl2PStart + ((flHeight * flWidth) / 4)
  const fl4PStart4 = fl2PStart2 + ((flHeight * flWidth) / 4)

  let flP1 = null
  let flP2 = null
  let flP3 = null
  let flP4 = null

  let arrayOfFlPlayers = []
  let arrayOfAllFlPlayers = []
  let flRound = 1

  const flSpeed = 40
  let flPlaying = false
  let flResetScreen = false

  class FlPlayer {
    constructor(x, active, name, pointList, player) {
      this.name = name,
      this.player = player,
      this.x = x,
      this.active = active,
      this.directions = [
        function() {
          return this.x + 1
        }, 
        function() {
          return this.x + flWidth
        }, 
        function() {
          return this.x - 1
        }, 
        function() {
          return this.x - flWidth
        }
      ]
      this.direction = this.directions[0],
      this.score = 0,
      this.pointsList = pointList
    }
    flPlayerEnd() {
      arrayOfFlPlayers.splice(arrayOfFlPlayers.indexOf(this), 1)
    }
    wallCollision() {
      if (
        this.x < 0 || 
        this.x > (flHeight * flWidth) ||
        ((this.x % flWidth === 0) && ((this.active[this.active.length - 1] + 1) % flWidth === 0)) ||
        (((this.x + 1 ) % flWidth === 0) && (this.active[this.active.length - 1] % flWidth === 0))
      ) {
        this.flPlayerEnd()
      }
    }
    playerCollision() {
      arrayOfAllFlPlayers.forEach(player => {
        if (player.active.includes(this.x)) {
          this.flPlayerEnd()
        }
      })
    }
  }

  function tronGridCreate() {
    for (let i = 0; i < flHeight; i++) {
      for (let i = 0; i < flWidth; i++) {
        const square = document.createElement('div')
        square.classList.add('fl_game_square')
        flGameContainer.appendChild(square)
        flSquares.push(square)
      }
    }
  }

  function flPaint() {
    arrayOfFlPlayers.forEach(player => {
      player.active.forEach(index => {
        flSquares[index].classList.add(`${player.name}background`)
      })
    })
  }

  function flResetPaint() {
    arrayOfAllFlPlayers.forEach(player => {
      player.active.forEach(index => {
        flSquares[index].classList.add(`${player.name}background`)
      })
    })
  }

  function clearFlPaint() {
    flSquares.forEach(index => index.classList.remove('flP1background', 'flP2background', 'flP3background', 'flP4background'))
  }

  function flPlayerCountCheck() {
    if (arrayOfFlPlayers.length === 1) {
      arrayOfFlPlayers[0].score++
      flUpdateScore()
      clearInterval(timerId)
      flResetScreen = true
      flPlaying = false
      flMessage()
      flWinMessage.style.display = 'inline'
    }
  }

  function flKeyDown() {
    if (!flPlaying) return
    switch (event.key) {
      case 'ArrowUp':
        if (flP1.direction === flP1.directions[1]) return
        flP1.direction = flP1.directions[3]
        break
      case 'ArrowLeft':
        if (flP1.direction === flP1.directions[0]) return
        flP1.direction = flP1.directions[2]
        break
      case 'ArrowDown':
        if (flP1.direction === flP1.directions[3]) return
        flP1.direction = flP1.directions[1]
        break
      case 'ArrowRight':
        if (flP1.direction === flP1.directions[2]) return
        flP1.direction = flP1.directions[0]
        break
    }
  }

  function flKeyDown2() {
    if (!flPlaying) return
    switch (event.key) {
      case 'w':
        if (flP2.direction === flP2.directions[1]) return
        flP2.direction = flP2.directions[3]
        break
      case 'a':
        if (flP2.direction === flP2.directions[0]) return
        flP2.direction = flP2.directions[2]
        break
      case 's':
        if (flP2.direction === flP2.directions[3]) return
        flP2.direction = flP2.directions[1]
        break
      case 'd':
        if (flP2.direction === flP2.directions[2]) return
        flP2.direction = flP2.directions[0]
        break
    }
  }

  function flKeyDown3() {
    if (!flPlaying) return
    if (!arrayOfFlPlayers.includes(flP3)) return
    switch (event.key) {
      case 't':
        if (flP3.direction === flP3.directions[1]) return
        flP3.direction = flP3.directions[3]
        break
      case 'f':
        if (flP3.direction === flP3.directions[0]) return
        flP3.direction = flP3.directions[2]
        break
      case 'g':
        if (flP3.direction === flP3.directions[3]) return
        flP3.direction = flP3.directions[1]
        break
      case 'h':
        if (flP3.direction === flP3.directions[2]) return
        flP3.direction = flP3.directions[0]
        break
    }
  }

  function flKeyDown4() {
    if (!flPlaying) return
    if (!arrayOfFlPlayers.includes(flP4)) return
    switch (event.key) {
      case 'o':
        if (flP4.direction === flP4.directions[1]) return
        flP4.direction = flP4.directions[3]
        break
      case 'k':
        if (flP4.direction === flP4.directions[0]) return
        flP4.direction = flP4.directions[2]
        break
      case 'l':
        if (flP4.direction === flP4.directions[3]) return
        flP4.direction = flP4.directions[1]
        break
      case ';':
        if (flP4.direction === flP4.directions[2]) return
        flP4.direction = flP4.directions[0]
        break
    }
  }

  function tick() {
    flPaint()
    arrayOfFlPlayers.forEach(flplayer => {
      flplayer.x = flplayer.direction()
      flplayer.playerCollision()
      flplayer.wallCollision()
      flplayer.active.push(flplayer.x)
    })
    flPlayerCountCheck()
  }

  function flMessage() {
    flPlayerName.innerHTML = arrayOfFlPlayers[0].player
    flRoundDom.innerHTML = flRound
    if (arrayOfFlPlayers[0].score === 3) {
      flRoundMatch.innerHTML = 'Match'
      flRoundDom.innerHTML = ''
    }
  }

  function winCondition() {
    if (arrayOfFlPlayers[0].score === 3) {
      flResetGame()
    }
  }

  function flResetGame() {
    numPlayers.disabled = false
    flPoint.forEach(point => point.classList.remove('fl_point_fill'))
    arrayOfAllFlPlayers.forEach(player => player.score = 0)
    flRound = 1
    flRoundMatch.innerHTML = 'Round'
  }

  function flResetMatch() {
    flWinMessage.style.display = 'none'
    clearFlPaint()
    resetPlayers()
    flResetPaint()
    flRound++
    winCondition()
    flResetScreen = false
    arrayOfFlPlayers = []
    arrayOfAllFlPlayers.forEach(player => arrayOfFlPlayers.push(player))
  }

  function resetPlayers() {
    arrayOfAllFlPlayers.forEach(player => {
      player.x = player.active[0]
      player.active = [player.x]
    })
  }

  function flStartFunc() {
    if (flPlaying || flResetScreen) return
    if (flRound === 1) {
      arrayOfAllFlPlayers = []
      arrayOfFlPlayers.forEach(player => arrayOfAllFlPlayers.push(player))
    }
    flPlaying = true
    timerId = setInterval(tick, flSpeed)
    numPlayers.disabled = true
  }

  function createPlayer1(position) {
    flP1 = null
    switch (position) {
      case 1:
        flP1 = new FlPlayer(fl2PStart, [fl2PStart], 'flP1', flP1Points, 'Player 1')
        break
      case 2:
        flP1 = new FlPlayer(fl3PStart, [fl3PStart], 'flP1', flP1Points, 'Player 1')
        break
    }
    arrayOfFlPlayers.push(flP1)
  }

  function createPlayer2(position) {
    flP2 = null
    switch (position) {
      case 1:
        flP2 = new FlPlayer(fl2PStart2, [fl2PStart2], 'flP2', flP2Points, 'Player 2')
        break
      case 2:
        flP2 = new FlPlayer(fl3PStart2, [fl3PStart2], 'flP2', flP2Points, 'Player 2')
        break
    }
    arrayOfFlPlayers.push(flP2)
  }

  function createPlayer3(position) {
    flP3 = null
    switch (position) {
      case 1:
        flP3 = new FlPlayer(fl3PStart3, [fl3PStart3], 'flP3', flP3Points, 'Player 3')
        break
      case 2:
        flP3 = new FlPlayer(fl4PStart3, [fl4PStart3], 'flP3', flP3Points, 'Player 3')
        break
    }
    arrayOfFlPlayers.push(flP3)
  }

  function createPlayer4() {
    flP4 = null
    flP4 = new FlPlayer(fl4PStart4, [fl4PStart4], 'flP4', flP4Points, 'Player 4')
    arrayOfFlPlayers.push(flP4)
  }

  function flUpdateScore() {
    for (let i = 0; i < arrayOfFlPlayers[0].score; i++) {
      arrayOfFlPlayers[0].pointsList[i].classList.add('fl_point_fill')
    }
  }

  function colourChange() {
    const flColour = event.target.value
    document.documentElement.style.setProperty(`--${this.dataset.name}`, flColour)
    flPaint()
  }

  function setplayerStarting() {
    switch (numPlayers.value) {
      case '2':
        arrayOfFlPlayers = []
        createPlayer1(1)
        createPlayer2(1)
        break
      case '3':
        arrayOfFlPlayers = []
        createPlayer1(2)
        createPlayer2(2)
        createPlayer3(1)
        break
      case '4':
        arrayOfFlPlayers = []
        createPlayer1(2)
        createPlayer2(2)
        createPlayer3(2)
        createPlayer4()
        break
    }
  }

  function changeNumPlayers() {
    numPlayersSpan.innerHTML = numPlayers.value
    players.forEach(player => player.style.visibility = 'hidden')
    for (let i = 0; i < numPlayers.value; i++) {
      players[i].style.visibility = 'visible'
    }
    clearFlPaint()
    setplayerStarting()
    flPaint()
  }

  function displayFlTron() {
    selectorContainer.style.display = 'none'
    flTron.style.display = 'flex'
    back.style.display = 'block'
  }

  createPlayer1(1)
  createPlayer2(1)

  tronGridCreate()
  flPaint()

  // Event Handlers

  window.addEventListener('keydown', flKeyDown)
  window.addEventListener('keydown', flKeyDown2)
  window.addEventListener('keydown', flKeyDown3)
  window.addEventListener('keydown', flKeyDown4)
  flStart.addEventListener('click', flStartFunc)
  numPlayers.addEventListener('change', changeNumPlayers)
  flReset.addEventListener('click', flResetMatch)
  colourInputs.forEach(colourInput => colourInput.addEventListener('change', colourChange))
  flTronPlay.addEventListener('click', displayFlTron)
  

  // FL TRON END

  // FROGGER

  // DOM VARIABLES

  const froggerPlay = document.querySelector('.frogger_selector')
  const frogger = document.querySelector('#frogger')
  const froggerGameContainer = document.querySelector('.frogger_game_container')
  const froggerStart = document.querySelector('#frogger_start')

  // VARIABLES

  let froggerPlaying = false

  const froggerHeight = 13
  const froggerWidth = 11
  const froggerSquares = []
  const frogs = []
  let activeFrog = null
  const froggerStartingPos = Math.floor((froggerWidth * froggerHeight) - (froggerWidth / 2))
  let frogLives = 3

  const allCars = []

  class RowTraits {
    constructor(time, row, speed) {
      this.cars = [],
      this.time = time,
      this.speed = speed
      this.createId = null,
      this.moveId = null,
      this.startingPosition = (froggerWidth * froggerHeight) - (froggerWidth * row)
    }
  }

  const row1 = new RowTraits(1500, 1, 250)
  const row2 = new RowTraits(1000, 3, 250)
  const row3 = new RowTraits(2000, 3, 500)
  const row4 = new RowTraits(1000, 4, 250)
  const row5 = new RowTraits(1250, 4, 250)

  const froggerRows = {
    left: [row1, row3, row5],
    right: [row2, row4]
  }

  const car1StartPos = (froggerWidth * froggerHeight) - (froggerWidth)
  let cars1 = []
  const car1Time = 1000
  let cars1CreateTimerId = null
  let cars1MoveTimerId = null

  let pavementArray = null
  let lilyPadArray = null
  let roadArray = null
  let waterArray = null


  class Frog {
    constructor(position, active) {
      this.position = position,
      this.active = active
    }
  }

  class Car {
    constructor(position, leng) {
      this.position = position,
      this.leng = leng
    }
  }



  // FUNCTIONS

  function froggerPaint() {
    froggerSquares.forEach(square => square.classList.remove('frog'))
    froggerSquares[activeFrog.position].classList.add('frog')
  }

  function carPaint() {
    froggerSquares.forEach(square => square.classList.remove('car1'))
    row1.cars.forEach(car => froggerSquares[car.position].classList.add('car1'))
    row2.cars.forEach(car => froggerSquares[car.position].classList.add('car1'))
    row3.cars.forEach(car => froggerSquares[car.position].classList.add('car1'))
  }

  function createFrog() {
    activeFrog = new Frog(froggerStartingPos, true)
    frogs.push(activeFrog)
  }

  function createCar(row) {
    row.cars.push(new Car(row.startingPosition, 1))
  }

  function moveCar(row) {
    if (froggerRows.left.includes(row)) {
      row.cars.forEach(car => car.position--)
      row.cars = row.cars.filter(car => car.position > row.startingPosition - (froggerWidth + 1))
    } else if (froggerRows.right.includes(row)) {
      row.cars.forEach(car => car.position++)
      row.cars = row.cars.filter(car => car.position < row.startingPosition + (froggerWidth + 1))
    }
    if (froggerCarCollisionCheck()) frogDead(), froggerPaint()
    carPaint()
  }

  // BOARD CREATION

  function froggerGridCreate() {
    for (let i = 0; i < froggerHeight; i++) {
      for (let i = 0; i < froggerWidth; i++) {
        const square = document.createElement('div')
        square.classList.add('frogger_game_square')
        froggerGameContainer.appendChild(square)
        froggerSquares.push(square)
      }
    }
  }

  function froggerPavement() {
    pavementArray = froggerSquares.filter((square, index) => {
      return index >= (froggerWidth * froggerHeight) - froggerWidth ||
      (index >= (froggerHeight * froggerWidth / 2) - (froggerWidth / 2) && 
      index < (froggerHeight * froggerWidth / 2) + (froggerWidth / 2)
      )
    })
    pavementArray.forEach(square => square.classList.add('frogger_pavement'))
  }

  function froggerLilyPad() {
    lilyPadArray = froggerSquares.filter((square, index) => {
      return index < froggerWidth && 
      (index + 1) % 2 === 0
    })
    lilyPadArray.forEach(square => square.classList.add('frogger_pad'))
  }

  function froggerRoad() {
    roadArray = froggerSquares.filter((square, index) => {
      return index < (froggerWidth * froggerHeight) - froggerWidth &&
      index >= (froggerHeight * froggerWidth / 2) + (froggerWidth / 2)
    })
    roadArray.forEach(square => square.classList.add('frogger_road'))
  }
  
  function froggerWater() {
    waterArray = froggerSquares.filter((square, index) => {
      return index < (froggerHeight * froggerWidth / 2) - (froggerWidth / 2) &&
      index >= froggerWidth || 
      (index < froggerWidth &&
      (index + 1) % 2 !== 0)
    })
    waterArray.forEach(square => square.classList.add('frogger_water'))
  }

  function frogDead() {
    activeFrog.position = froggerStartingPos
    frogLives--
  }


  // TIMERS 

  function cars1Timer() {
    row1.createId = setInterval(function() {
      createCar(row1)
    }, row1.time)
    row1.moveId = setInterval(function() {
      moveCar(row1)
    }, row1.speed)
  }
  
  function cars2Timer() {
    row2.createId = setInterval(function() {
      createCar(row2)
    }, row2.time)
    row2.moveId = setInterval(function() {
      moveCar(row2)
    }, row2.speed)
  }

  function cars3Timer() {
    row3.createId = setInterval(function() {
      createCar(row3)
    }, row3.time)
    row3.moveId = setInterval(function() {
      moveCar(row3)
    }, row3.speed)
  }

  // function cars4Timer() {
  //   cars4CreateTimerId = setInterval(createCar, 1000)
  //   cars4MoveTimerId = setInterval(moveCar1, 250)
  // }

  // function cars5Timer() {
  //   cars5CreateTimerId = setInterval(createCar, 1000)
  //   cars5MoveTimerId = setInterval(moveCar1, 250)
  // }

  // COLLISION CHECKERS

  function froggerCarCollisionCheck() {
    return cars1.some(car => car.position === activeFrog.position)
  }

  function froggerBottomCheck() {
    return (activeFrog.position + froggerWidth) > (froggerWidth * froggerHeight) - 1 ? true : false
  }

  function froggerWaterCheck() {
    if (waterArray.some(square => froggerSquares.indexOf(square) === activeFrog.position)) {
      frogDead()
    }
  }

  function froggerTopCheck() {
    return (activeFrog.position - froggerWidth) < 0 ? true : false
  }

  function froggerRightCheck() {
    return (activeFrog.position + 1) % froggerWidth === 0
  }

  function froggerLeftCheck() {
    return activeFrog.position % froggerWidth === 0
  }

  function froggerMove() {
    if (!froggerPlaying) return 
    switch (event.key) {
      case 'ArrowUp':
        if (froggerTopCheck()) return
        activeFrog.position -= (froggerWidth)
        break
      case 'ArrowDown':
        if (froggerBottomCheck()) return
        activeFrog.position += (froggerWidth)
        break
      case 'ArrowLeft':
        if (froggerLeftCheck()) return
        activeFrog.position -= 1
        break
      case 'ArrowRight':
        if (froggerRightCheck()) return
        activeFrog.position += 1
        break
    }
    froggerWaterCheck()
    froggerPaint()
  }

  function froggerStartFunc() {
    froggerPlaying = true
  }

  froggerGridCreate()
  froggerPavement()
  froggerLilyPad()
  froggerRoad()
  froggerWater()
  createFrog()
  froggerPaint()

  function displayFrogger() {
    selectorContainer.style.display = 'none'
    frogger.style.display = 'flex'
    back.style.display = 'block'
    cars1Timer()
    cars2Timer()
    cars3Timer()
  }

  // EVENT LISTENERS

  froggerPlay.addEventListener('click', displayFrogger)
  window.addEventListener('keydown', froggerMove)
  froggerStart.addEventListener('click', froggerStartFunc)


  // FROGGER END


  function returnToMain() {
    resetFunc()
    tetrisDomPause.style.display = 'none'
    selectorContainer.style.display = 'flex'
    tetris.style.display = 'none'
    flTron.style.display = 'none'
    back.style.display = 'none'
    frogger.style.display = 'none'
  }
  
  back.addEventListener('click', returnToMain)
}

window.addEventListener('DOMContentLoaded', init)