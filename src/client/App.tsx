import React, { useReducer, useState } from 'react'

type Action = { type: 'SET_INPUT'; value: string } | { type: 'CLEAR' }

interface State {
  input: string
  inputClassName: string
}

const initialState: State = {
  input: '0',
  inputClassName: 'display'
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT': {
      let currentValue = action.value.replace(/,/g, '')
      if (currentValue.length > 16) {
        return state
      }
      const lengthToClassName: Record<number, string> = {
        11: 'display display-small',
        12: 'display display-smaller',
        13: 'display display-tiny',
        14: 'display display-minimal',
        15: 'display display-min',
        16: 'display display-miner'
      }

      const newInputClassName = lengthToClassName[currentValue.length] || 'display'
      const formattedInput = currentValue.replace(/(\d{3})(?=\d)/g, '$1,')

      return { ...state, input: formattedInput, inputClassName: newInputClassName }
    }
    case 'CLEAR':
      return { ...state, input: '0', inputClassName: 'display' }
    default:
      return state
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [prevValue, setPrevValue] = useState<number>(0)
  const [operator, setOperator] = useState<string>('')
  const [nextValue, setNextValue] = useState<number>(0)

  const buttonValues = [
    'AC',
    '+/-',
    '%',
    '÷',
    '7',
    '8',
    '9',
    '×',
    '4',
    '5',
    '6',
    '-',
    '1',
    '2',
    '3',
    '+',
    '0',
    ',',
    '='
  ]

  function handleDisplay(value: string) {
    if (['+', '-', '×', '÷'].includes(value)) {
      if (prevValue !== null && operator) {
        const result = handleOperatorButton(operator, prevValue, parseFloat(state.input))
        dispatch({ type: 'SET_INPUT', value: result.toString() })
      }
      setPrevValue(parseFloat(state.input))
      setOperator(value)
    } else {
      const newValue = state.input === '0' ? value : state.input + value
      dispatch({ type: 'SET_INPUT', value: newValue })
    }
  }

  function handleSpecialButton(value: string) {
    if (value === 'AC') {
      dispatch({ type: 'CLEAR' })
    } else if (value === '+/-') {
      dispatch({ type: 'SET_INPUT', value: (parseFloat(state.input) * -1).toString() })
    } else if (value === '%') {
      dispatch({ type: 'SET_INPUT', value: (parseFloat(state.input) / 100).toString() })
    } else if (value === ',') {
      dispatch({ type: 'SET_INPUT', value: state.input + ',' })
    }
  }

  function handleOperatorButton(value: string, prevValue: number, nextValue: number) {
    switch (value) {
      case '÷':
        return prevValue / nextValue
      case '×':
        return prevValue * nextValue
      case '+':
        return prevValue + nextValue
      case '-':
        return prevValue - nextValue
      case '=':
        return nextValue
      default:
        return prevValue
    }
  }

  function renderButton(button: string, index: number) {
    const isOperator = ['÷', '×', '-', '+', '='].includes(button)
    const isSpecial = ['AC', '+/-', '%'].includes(button)
    const buttonClassName = isOperator ? 'operator-button' : isSpecial ? 'special-button' : ''

    return (
      <button
        key={index}
        onClick={() => {
          if (isSpecial) {
            handleSpecialButton(button)
          } else if (isOperator) {
            handleDisplay(button)
          } else {
            handleDisplay(button)
          }
        }}
        className={`${button === '0' ? 'double-width' : ''} ${buttonClassName}`}
      >
        {button}
      </button>
    )
  }

  return (
    <div>
      <h1>Calculator</h1>
      <div className='wrapper'>
        <div className='board'>
          <input type='text' value={state.input} readOnly className={state.inputClassName} />
          {buttonValues.map((button, index) => renderButton(button, index))}
        </div>
      </div>
    </div>
  )
}

export default App
