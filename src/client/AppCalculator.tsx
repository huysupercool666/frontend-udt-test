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

function formatInput(input: string): string {
  if (input.includes('.')) {
    const decimalParts = input.split('.')
    return decimalParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + decimalParts[1]
  } else {
    return input.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT': {
      let currentValue = action.value.replace(/,/g, '')
      if (currentValue.length === 16) {
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
      const formattedInput = formatInput(currentValue)
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
  const [nextValue, setNextValue] = useState<number>(0)
  const [operator, setOperator] = useState<string>('')
  const [lastOperation, setLastOperation] = useState<boolean>(false)
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

  function checkDecimalToLong(value: number) {
    const parts = value.toString().split('.')
    if (parts[1] && parts[1].length > 10) {
      return value.toExponential(0)
    } else if (Math.abs(value) < 1e-10 || Math.abs(value) > 1e10) {
      return value.toExponential(1)
    }
    return value.toString()
  }

  function handleSpecialButton(value: string) {
    if (value === 'AC') {
      dispatch({ type: 'CLEAR' })
    } else if (value === '+/-') {
      const newValue = parseFloat(state.input.replace(/,/g, '')) * -1
      dispatch({ type: 'SET_INPUT', value: newValue.toString() })
    } else if (value === '%') {
      const newValue = parseFloat(state.input.replace(/,/g, '')) / 100
      dispatch({ type: 'SET_INPUT', value: checkDecimalToLong(newValue).toString() })
    } else if (value === ',') {
      if (!state.input.includes('.')) {
        const currentValue = state.input.replace(/,/g, '')
        dispatch({ type: 'SET_INPUT', value: currentValue + '.' })
      }
    }
  }

  function handleOperatorButton(operator: string, prevValue: number, nextValue: number) {
    let result: number
    switch (operator) {
      case '÷':
        if (nextValue === 0) {
          return 'Cannot divide by zero'
        }
        result = prevValue / nextValue
        break
      case '×':
        result = prevValue * nextValue
        break
      case '+':
        result = prevValue + nextValue
        break
      case '-':
        result = prevValue - nextValue
        break
      default:
        result = nextValue
    }
    return checkDecimalToLong(result)
  }

  function handleDisplay(value: string) {
    const operators = ['+', '-', '×', '÷']
    const currentValue = parseFloat(state.input.replace(/,/g, ''))
    const currentInput = state.input.replace(/,/g, '')
    dispatch({ type: 'SET_INPUT', value: currentInput + value })

    if (lastOperation) {
      dispatch({ type: 'SET_INPUT', value: value })
      setLastOperation(false)
      return
    }

    if (state.input === '0') {
      dispatch({ type: 'SET_INPUT', value: value })
      return
    }
    
    if (operators.includes(value)) {
      setOperator(value)
      setPrevValue(currentValue)
      setNextValue(currentValue)
      dispatch({ type: 'SET_INPUT', value: '0' })
      setLastOperation(false)
      return
    }
  
    if (value === '=' && operator) {
      const result = lastOperation
        ? handleOperatorButton(operator, currentValue, nextValue)
        : handleOperatorButton(operator, prevValue, currentValue)
      
      if (!lastOperation) {
        setNextValue(currentValue)
      }
      
      dispatch({ type: 'SET_INPUT', value: result.toString() })
      setLastOperation(true)
      return
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
