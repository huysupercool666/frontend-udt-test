import React, { useReducer } from 'react'

// Định nghĩa các hành động
type Action = { type: 'SET_INPUT'; value: string } | { type: 'CLEAR' }

// Định nghĩa trạng thái
interface State {
  input: string
  inputClassName: string
}

// Trạng thái khởi tạo
const initialState: State = {
  input: '',
  inputClassName: 'display'
}

// Reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT': {
      let currentValue = action.value.replace(/,/g, '')
      if (currentValue.length > 16) return state

      const lengthToClassName: Record<number, string> = {
        11: 'display display-small',
        12: 'display display-smaller',
        13: 'display display-tiny',
        14: 'display display-minimal',
        15: 'display display-min',
        16: 'display display-miner'
      }

      const newClassName = lengthToClassName[currentValue.length] || 'display'
      const formattedInput = currentValue.replace(/(\d{3})(?=\d)/g, '$1,')

      return { ...state, input: formattedInput, inputClassName: newClassName }
    }
    case 'CLEAR':
      return { ...state, input: '', inputClassName: 'display' }
    default:
      return state
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

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
    dispatch({ type: 'SET_INPUT', value: state.input + value })
  }

  function handleClear() {
    dispatch({ type: 'CLEAR' })
  }

  function renderButton(button: string, index: number) {
    const isOperator = ['÷', '×', '-', '+', '='].includes(button)
    const isSpecial = ['AC', '+/-', '%'].includes(button)
    const buttonClassName = isOperator ? 'operator-button' : isSpecial ? 'special-button' : ''

    return (
      <button
        key={index}
        onClick={() => (button === 'AC' ? handleClear() : handleDisplay(button))}
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
