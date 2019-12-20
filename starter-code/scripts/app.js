function init() {

  // DOM Variables

  const gameContainer = document.querySelector('.game_container')
  const start = document.querySelector('.start')

  // Variables 

  const height = 24
  const width = 10
  const squares = []
  let x
  let currentBlockInit
  let currentBlock
  let timerId = null
  let active = []
  let currentInitId
  let currentRotId
  let score = 0

  // Variables

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
        return [x, x + 1, x + width, x + 1 + width]
      },
      function s() {
        return [x, x + 1, x + width, x + 1 + width]
      },
      function s() {
        return [x, x + 1, x + width, x + 1 + width]
      },
      function s() {
        return [x, x + 1, x + width, x + 1 + width]
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

  // Functions

  function randomBlockGen() {
    return Math.floor(Math.random() * (tetriminos.length))
  }

  function randomRotationGen() {
    return Math.floor(Math.random() * 4)
  }
  
  function rotateBlock() {
    if (currentRotId === tetriminos[currentInitId].length - 1) {
      currentRotId = 0
    } else {
      currentRotId++
    }
    currentBlockInit = tetriminos[currentInitId][currentRotId]
    currentBlock = currentBlockInit()
    if (rightWallRotChecker() || leftWallRotChecker()) {
      removeAndRepaint()
    } else {
      if (currentRotId === 0) {
        currentRotId = tetriminos[currentInitId].length - 1
      } else {
        currentRotId--
      }
      currentBlockInit = tetriminos[currentInitId][currentRotId]
      currentBlock = currentBlockInit()
    }
    removeAndRepaint()
  }

  function blockPick() {
    currentInitId = randomBlockGen()
    currentRotId = randomRotationGen()
    currentBlockInit = tetriminos[currentInitId][currentRotId]
    currentBlock = currentBlockInit()
  }

  function gridCreate() {
    for (let i = 0; i < height; i++) {
      for (let i = 0; i < width; i++) {
        const square = document.createElement('div')
        square.classList.add('game_square')
        gameContainer.appendChild(square)
        squares.push(square)
      }
    }
    squares.forEach((item, index) => {
      if (index < width * 4) {
        item.classList.add('invis')
      }
    })
  }

  function removeAndRepaint() {
    squares.forEach(square => square.classList.remove('active'))
    currentBlock.forEach(index => squares[index].classList.add('active'))
    active.forEach(index => squares[index].classList.add('active'))
  }

  function resetX() {
    x = 15
  }

  function baseCollision() {
    if (baseChecker() || blockChecker()) {
      active = active.concat(currentBlock)
      blockPick()
      resetX()
      scoreFunc()
    }
  }

  function scoreFunc() {
    active.sort((a, b) => a - b)
  }

  function gravityTimer() {
    baseCollision()
    x += width
    currentBlock = currentBlockInit()
    removeAndRepaint()
  }

  function startTimer() {
    timerId = setInterval(gravityTimer, 500)
  }

  function startFunc() {
    resetX()
    blockPick()
    startTimer()
  }

  function rightWallChecker() {
    return !currentBlock.some(index => index % width === width - 1)
  }

  function leftWallChecker() {
    return !currentBlock.some(index => index % width === 0)
  }

  function rightWallRotChecker() {
    return !currentBlock.some(index => index % width === 0)
  }

  function leftWallRotChecker() {
    return !currentBlock.some(index => index % width === width - 1)
  }

  function baseChecker() {
    return currentBlock.some(index => index + width >= height * width)
  }

  function blockChecker() {
    return currentBlock.some(index => active.includes(index + width))
  }

  function rightBlockChecker() {
    return !currentBlock.some(index => active.includes(index + 1))
  }

  function leftBlockChecker() {
    return !currentBlock.some(index => active.includes(index - 1))
  }

  function leftBlockRotChecker() {
    return !currentBlock.some(index => active.includes(index))
  }

  function rightBlockRotChecker() {
    return !currentBlock.some(index => active.includes(index))
  }

  // Event Handlers

  function keyDownEvents(e) {

    if (e.key === 'ArrowRight' && rightWallChecker() && rightBlockChecker()) {
      x++
      currentBlock = currentBlockInit()
      removeAndRepaint()
    } else if (e.key === 'ArrowLeft' && leftWallChecker() && leftBlockChecker()) {
      x--
      currentBlock = currentBlockInit()
      removeAndRepaint()
    } else if (e.key === 'ArrowDown') {
      clearInterval(timerId)
      timerId = setInterval(gravityTimer, 50)
    } else if (e.key === 'ArrowUp') {
      rotateBlock()
    }
  }

  function keyUpEvents(e) {
    if (e.key === 'ArrowDown') {
      clearInterval(timerId)
      gravityTimer()
      startTimer()
    }
  }

  gridCreate()

  window.addEventListener('keyup', keyUpEvents)
  window.addEventListener('keydown', keyDownEvents)
  start.addEventListener('click', startFunc)
}


window.addEventListener('DOMContentLoaded', init)