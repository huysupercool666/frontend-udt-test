import { Route, Routes } from 'react-router-dom'
import React, { useState } from 'react'

const buttons = ['AC', '+/-', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', ',', '=']
const App: React.FC = () => {
  const [input, setInput] = useState<string>('')
  const handleButtonClick = (value: string) => {
    setInput((prevInput) => prevInput + value)
  }
  const handleClear = () => {
    setInput('')
  }
  const renderButton = (button: string, index: number) => {
    if (button === 'AC') {
      return (
        <button key={button} onClick={handleClear}>
          {button}
        </button>
      )
    } else if (button === '+/-') {
      return (
        <button
          key={button}
          onClick={() => {
            handleButtonClick('+/-')
          }}
          className='plus-and-minus'
        >
          {button}
        </button>
      )
    } else if (button === '0') {
      return (
        <button
          key={button}
          onClick={() => handleButtonClick(button)}
          className={`${button === '0' ? 'double-width' : ''}`}
        >
          {button}
        </button>
      )
    }
  }
  return (
    <div>
      <h1>Calculator</h1>
      <div className='wrapper'>
        <div className='board'>
          <input type='text' value={input} readOnly className='display' />
          {buttons.map((button, index) => renderButton(button, index))}
        </div>
      </div>
    </div>
  )
}

export default App
