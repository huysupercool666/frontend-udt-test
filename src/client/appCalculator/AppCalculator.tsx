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
  const isNegative = input.startsWith('-')
  const numberWithoutSign = isNegative ? input.slice(1) : input
  const [integerPart, decimalPart] = numberWithoutSign.split('.')
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const finalInteger = isNegative ? `-${formattedInteger}` : formattedInteger
  return decimalPart !== undefined ? `${finalInteger}.${decimalPart}` : finalInteger
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
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
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
  function viewHistory() {
    window.location.href = '/history'
  }

  function formatDecimalNumber(value: number): string {
    if (value === 0) return '0'

    if (Math.abs(value) >= 1e9 || Math.abs(value) < 1e-9) {
      return value.toExponential(1)
    }

    const stringValue = value.toString()
    const [integerPart, decimalPart] = stringValue.split('.')

    if (integerPart.length > MAX_INPUT_LENGTH) {
      return value.toExponential(1)
    }

    if (!decimalPart) {
      return stringValue
    }

    const maxDecimalPlaces = MAX_INPUT_LENGTH - integerPart.length - 1
    if (maxDecimalPlaces <= 0) {
      return integerPart
    }

    const roundedValue = Number(value.toFixed(Math.min(maxDecimalPlaces, MAX_DECIMAL_PLACES)))
    return roundedValue.toString()
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
      const prev = Number(prevValue)
      const next = Number(nextValue)

      switch (operator) {
        case '÷':
          if (next === 0) return 'Error'
          result = prev / next
          break
        case '×':
          result = prev * next
          break
        case '+':
          result = prev + next
          break
        case '-':
          result = prev - next
          break
        default:
          return nextValue.toString()
      }

      const formattedResult = formatDecimalNumber(result)
      setPrevValue(result)
      setNextValue(next)

      const historyEntry = `${prev} ${operator} ${next} = ${formattedResult}`
      setHistory((prevHistory) => [...prevHistory, historyEntry])

      return formattedResult
    } catch (error) {
      return 'Operation went wrong!'
    }
  }

  function handleDisplay(value: string) {
    try {
      const currentInput = state.input.replace(/,/g, '')

      if (OPERATORS.includes(value)) {
        if (operator && !lastOperation) {
          const nextVal = parseFloat(currentInput)
          const result = handleOperatorButton(operator, prevValue, nextVal)
          if (result === 'Error') {
            dispatch({ type: 'SET_INPUT', value: 'Error' })
            return
          }
          setPrevValue(parseFloat(result))
          dispatch({ type: 'SET_INPUT', value: result })
        } else {
          setPrevValue(parseFloat(currentInput))
        }

        setNextValue(0)
        setOperator(value)
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
        if (!operator) return

        const nextVal = parseFloat(state.input.replace(/,/g, ''))
        if (!lastOperation) {
          setNextValue(nextVal)
        }

        const result = handleOperatorButton(operator, prevValue, nextValue || nextVal)

        if (result === 'Error') {
          dispatch({ type: 'SET_INPUT', value: 'Error' })
          setOperator('')
          setPrevValue(0)
          setNextValue(0)
          setLastOperation(false)
          return
        }

        dispatch({ type: 'SET_INPUT', value: result })
        setPrevValue(parseFloat(result))
        setLastOperation(true)
      }
    } catch (error) {
      dispatch({ type: 'SET_INPUT', value: 'Error' })
    }
  }

  function handleDisplayClick(e: React.MouseEvent) {
    e.stopPropagation()
    setIsEditing(true)
    if (state.input === '0') {
      dispatch({ type: 'SET_INPUT', value: '' }) 
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/[^\d.-]/g, '')
    if (value.length <= MAX_INPUT_LENGTH) {
      dispatch({ type: 'SET_INPUT', value })
    }
  }

  function handleClickOutside() {
    setIsEditing(false)
  }

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

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
          <input
            ref={inputRef}
            type='text'
            value={state.input}
            className={`${state.inputClassName} ${isEditing ? 'editing' : ''}`}
            onClick={handleDisplayClick}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          {buttonValues.map((button, index) => renderButton(button, index))}
        </div>
      </div>
      <br />
      <div className='header-actions'>
        <button onClick={viewHistory} className='view-history-btn'>
          View History
        </button>
      </div>
    </div>
  )
}

export default App
