import React, { useReducer, useState, useRef, useEffect } from 'react'
type Action = { type: 'SET_INPUT'; value: string } | { type: 'CLEAR' } | { type: 'SET_HISTORY'; value: string }

interface State {
  input: string
  inputClassName: string
  storeMultiOperator: string[]
}

const initialState: State = {
  input: '0',
  inputClassName: 'display',
  storeMultiOperator: []
}

const OPERATORS = ['+', '-', '×', '÷']
const MAX_INPUT_LENGTH = 9
const MAX_DECIMAL_PLACES = 10

function formatInput(input: string): string {
  const [integerPart, decimalPart] = input.split('.')
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT': {
      let currentValue = action.value.replace(/,/g, '')
      if (currentValue.includes('e')) {
        return { ...state, input: currentValue, inputClassName: 'display display-small' }
      }

      const valueWithoutSign = currentValue.replace(/^-/, '')
      if (valueWithoutSign.length > MAX_INPUT_LENGTH) {
        return state
      }

      const lengthToClassName: Record<number, string> = {
        6: 'display display-small',
        7: 'display display-smaller',
        8: 'display display-tiny',
        9: 'display display-minimal',
        10: 'display display-min'
      }
      const newInputClassName = lengthToClassName[currentValue.length] || 'display'
      const formattedInput = formatInput(currentValue)
      return { ...state, input: formattedInput, inputClassName: newInputClassName }
    }
    case 'CLEAR':
      return initialState
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
  const [history, setHistory] = useState<string[]>([])
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

  function viewHistory() {}

  function formatDecimalNumber(value: number): string {
    if (value === 0) return '0'

    if (Math.abs(value) >= 1e9 || Math.abs(value) < 1e-9) {
      return value.toExponential(1)
    }

    if (Math.abs(value) < 1) {
      const fixedNum = value.toFixed(MAX_DECIMAL_PLACES)
      return parseFloat(fixedNum).toString()
    }

    const parts = value.toString().split('.')
    if (parts[1] && parts[1].length > MAX_DECIMAL_PLACES) {
      return value.toFixed(MAX_DECIMAL_PLACES)
    }

    return value.toString()
  }

  function handleSpecialButton(value: string) {
    let currentValue = parseFloat(state.input.replace(/,/g, ''))
    try {
      switch (value) {
        case 'AC':
          dispatch({ type: 'CLEAR' })
          setOperator('')
          setPrevValue(0)
          setNextValue(0)
          setLastOperation(false)
          break
        case '+/-':
          const newValueNegative = (currentValue * -1).toString()
          const valueWithoutSignNegative = newValueNegative.replace(/^-/, '')
          if (valueWithoutSignNegative.length <= MAX_INPUT_LENGTH) {
            dispatch({ type: 'SET_INPUT', value: newValueNegative })
          }
          break
        case '%':
          const percentValue = currentValue / 100
          const newValuePercent = formatDecimalNumber(percentValue)
          dispatch({ type: 'SET_INPUT', value: newValuePercent })
          break
      }
    } catch (error) {
      dispatch({ type: 'SET_INPUT', value: 'Error' })
    }
  }

  function handleOperatorButton(operator: string, prevValue: number, nextValue: number): string {
    try {
      let result: number
      switch (operator) {
        case '÷':
          if (nextValue === 0) {
            return 'Error'
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
          return nextValue.toString()
      }

      return formatDecimalNumber(result)
    } catch (error) {
      return 'Error'
    }
  }

  function handleDisplay(value: string) {
    try {
      const currentInput = state.input.replace(/,/g, '')

      if (OPERATORS.includes(value)) {
        setOperator(value)
        setPrevValue(parseFloat(currentInput))
        setLastOperation(true)
        return
      }

      if (value === '.') {
        if (currentInput.includes('.')) {
          return
        }
        if (lastOperation) {
          dispatch({ type: 'SET_INPUT', value: '0.' })
          setLastOperation(false)
          return
        }
        dispatch({ type: 'SET_INPUT', value: currentInput + '.' })
        return
      }

      if (value !== '=') {
        if (operator && lastOperation) {
          dispatch({ type: 'SET_INPUT', value: value })
          setLastOperation(false)
        } else if (operator && !lastOperation) {
          const newInput = currentInput + value
          dispatch({ type: 'SET_INPUT', value: newInput })
        } else if (currentInput === '0' && value !== '.') {
          dispatch({ type: 'SET_INPUT', value: value })
        } else {
          const newInput = currentInput + value
          dispatch({ type: 'SET_INPUT', value: newInput })
        }
      }

      if (value === '=') {
        if (!operator) {
          dispatch({ type: 'SET_INPUT', value: currentInput })
          return
        }
        const nextVal = parseFloat(currentInput)
        const result = handleOperatorButton(operator, prevValue, nextVal)
        if (result === 'Error') {
          dispatch({ type: 'SET_INPUT', value: 'Error' })
        } else {
          dispatch({ type: 'SET_INPUT', value: result })
          setPrevValue(parseFloat(result))
          setLastOperation(true)
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_INPUT', value: 'Error' })
    }
  }

  function renderButton(button: string, index: number) {
    const isOperator = ['÷', '×', '-', '+'].includes(button)
    const isSpecial = ['AC', '+/-', '%'].includes(button)
    const isEqual = ['='].includes(button)
    const buttonClassName = `
      ${button === '0' ? 'double-width' : ''}
      ${isOperator ? 'operator-button' : ''}
      ${isSpecial ? 'special-button' : ''}
      ${isEqual ? 'equal-button' : ''}
    `

    return (
      <button
        key={index}
        onClick={() => {
          if (isSpecial) {
            handleSpecialButton(button)
          } else if (button === ',' || button === '.') {
            handleDisplay(button ? '.' : '')
          } else {
            handleDisplay(button)
          }
        }}
        className={buttonClassName}
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
      <div className='header-actions'>
        <button onClick={viewHistory} className='view-history-btn'>
          View History
        </button>
      </div>
    </div>
  )
}

export default App
