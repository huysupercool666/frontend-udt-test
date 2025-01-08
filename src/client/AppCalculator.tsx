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

const OPERATORS = ['+', '-', '×', '÷']
const MAX_INPUT_LENGTH = 9
const MAX_DECIMAL_PLACES = 10

function formatInput(input: string): string {
  return input.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT': {
      let currentValue = action.value.replace(/,/g, '')
      if (currentValue.length > MAX_INPUT_LENGTH) return state

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

  function checkDecimalToLong(value: number): string {
    if (value === 0) {
      return '0'
    }
    const parts = value.toString().split('.')
    if (parts[1] && parts[1].length > MAX_DECIMAL_PLACES) {
      return value.toExponential(0)
    } else if (Math.abs(value) < 1e-10 || Math.abs(value) > 1e10) {
      return value.toExponential(0)
    }
    return value.toString()
  }

  function handleSpecialButton(value: string) {
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
          const currentValue = parseFloat(state.input.replace(/,/g, ''))
          dispatch({ type: 'SET_INPUT', value: (-currentValue).toString() })
          break
        case '%':
          const numValue = parseFloat(state.input.replace(/,/g, ''))
          const percentValue = numValue / 100
          dispatch({ type: 'SET_INPUT', value: checkDecimalToLong(percentValue) })
          break
        case ',':
          if (!state.input.includes('.')) {
            try {
              const decimalValue = eval(state.input + '.0')
              dispatch({ type: 'SET_INPUT', value: state.input + '.' })
            } catch (error) {
              dispatch({ type: 'SET_INPUT', value: 'Error' })
            }
          }
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
          if (nextValue === 0) return 'Error'
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

      return checkDecimalToLong(result)
    } catch (error) {
      console.error('Error in handleOperatorButton:', error)
      return 'Error'
    }
  }

  function handleDisplay(value: string) {
    try {
      const currentValue = parseFloat(state.input.replace(/,/g, ''))
      if (OPERATORS.includes(value)) {
        setOperator(value)
        setPrevValue(currentValue)
        setNextValue(currentValue)
        dispatch({ type: 'SET_INPUT', value: '0' })
        setLastOperation(false)
        return
      }
      if (value !== '=') {
        if (lastOperation) {
          dispatch({ type: 'SET_INPUT', value: value })
          setLastOperation(false)
        } else if (state.input === '0') {
          dispatch({ type: 'SET_INPUT', value: value })
        } else {
          const newInput = state.input.replace(/,/g, '') + value
          dispatch({ type: 'SET_INPUT', value: newInput })
        }
      }
      if (value === '=') {
        if (!operator) {
          dispatch({ type: 'SET_INPUT', value: currentValue.toString() })
          setLastOperation(true)
          return
        }

        const result = lastOperation
          ? handleOperatorButton(operator, currentValue, nextValue)
          : handleOperatorButton(operator, prevValue, currentValue)

        if (!lastOperation) {
          setNextValue(currentValue)
        }

        if (result === 'Error') {
          dispatch({ type: 'SET_INPUT', value: 'Error' })
        } else {
          dispatch({ type: 'SET_INPUT', value: result })
        }

        setLastOperation(true)
        return
      }
    } catch (error) {
      console.error('Error in handleDisplay:', error)
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
    </div>
  )
}

export default App
