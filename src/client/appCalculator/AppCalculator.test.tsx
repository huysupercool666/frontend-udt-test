import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import App from '../../client/appCalculator/AppCalculator'
import '@testing-library/jest-dom'

describe('Calculator App', () => {
  beforeEach(() => {
    render(<App />)
  })

  describe('Initial Display', () => {
    test('should display zero as default value', () => {
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('0')
    })

    test('should render all calculator buttons', () => {
      const buttons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '×', '÷', '=', 'AC', '+/-', '%']
      buttons.forEach((button) => {
        expect(screen.getByText(button)).toBeInTheDocument()
      })
    })

    test('should limit input to 9 digits', () => {
      const longNumber = '1234567890'
      longNumber.split('').forEach((num) => {
        fireEvent.click(screen.getByText(num))
      })
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('123,456,789')
    })
  })

  describe('Basic Arithmetic Operations', () => {
    describe('Addition', () => {
      test('should perform basic addition', () => {
        fireEvent.click(screen.getByText('2'))
        fireEvent.click(screen.getByText('+'))
        fireEvent.click(screen.getByText('3'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('5')
      })

      test('should perform basic addition with negative number', () => {
        fireEvent.click(screen.getByText('2'))
        fireEvent.click(screen.getByText('+'))
        fireEvent.click(screen.getByText('3'))
        fireEvent.click(screen.getByText('+/-'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('-1')
      })

      test('should perform basic addition with decimal', () => {
        fireEvent.click(screen.getByText('2'))
        fireEvent.click(screen.getByText('+'))
        fireEvent.click(screen.getByText('3'))
        fireEvent.click(screen.getByText(','))
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('5.5')
      })

      test('should perform basic addition with negative decimal', () => {
        fireEvent.click(screen.getByText('2'))
        fireEvent.click(screen.getByText('+'))
        fireEvent.click(screen.getByText('3'))
        fireEvent.click(screen.getByText('+/-'))
        fireEvent.click(screen.getByText(','))
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('-1.5')
      })

      test('should handle empty addition', () => {
        fireEvent.click(screen.getByText('+'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('0')
      })
    })

    describe('Subtraction', () => {
      test('should perform basic subtraction', () => {
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('-'))
        fireEvent.click(screen.getByText('3'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('2')
      })

      test('should perform basic subtraction with negative number', () => {
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('-'))
        fireEvent.click(screen.getByText('3'))
        fireEvent.click(screen.getByText('+/-'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('8')
      })

      test('should perform basic subtraction with decimal', () => {
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('-'))
        fireEvent.click(screen.getByText('3'))
        fireEvent.click(screen.getByText(','))
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('1.5')
      })

      test('should perform basic subtraction with negative decimal', () => {
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('-'))
        fireEvent.click(screen.getByText('3'))
        fireEvent.click(screen.getByText('+/-'))
        fireEvent.click(screen.getByText(','))
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('8.5')
      })
    })

    describe('Multiplication', () => {
      test('should perform basic multiplication', () => {
        fireEvent.click(screen.getByText('4'))
        fireEvent.click(screen.getByText('×'))
        fireEvent.click(screen.getByText('3'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('12')
      })

      test('should perform basic multiplication with decimal', () => {
        fireEvent.click(screen.getByText('4'))
        fireEvent.click(screen.getByText('×'))
        fireEvent.click(screen.getByText('3'))
        fireEvent.click(screen.getByText(','))
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('14')
      })

      test('should perform basic multiplication with negative decimal', () => {
        fireEvent.click(screen.getByText('4'))
        fireEvent.click(screen.getByText('×'))
        fireEvent.click(screen.getByText('3'))
        fireEvent.click(screen.getByText('+/-'))
        fireEvent.click(screen.getByText(','))
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('-14')
      })
    })

    describe('Division', () => {
      test('should perform basic division', () => {
        fireEvent.click(screen.getByText('6'))
        fireEvent.click(screen.getByText('÷'))
        fireEvent.click(screen.getByText('2'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('3')
      })

      test('should perform division with decimal', () => {
        fireEvent.click(screen.getByText('6'))
        fireEvent.click(screen.getByText('÷'))
        fireEvent.click(screen.getByText('2'))
        fireEvent.click(screen.getByText(','))
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('2.4')
      })

      test('should handle division by zero', () => {
        fireEvent.click(screen.getByText('0'))
        fireEvent.click(screen.getByText('÷'))
        fireEvent.click(screen.getByText('6'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('0')
      })

      test('should handle division by zero', () => {
        fireEvent.click(screen.getByText('6'))
        fireEvent.click(screen.getByText('÷'))
        fireEvent.click(screen.getByText('0'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('Error')
      })
    })
  })

  describe('Scientific Notation', () => {
    test('should display positive scientific notation for large numbers', () => {
      for (let i = 0; i < 10; i++) {
        fireEvent.click(screen.getByText('9'))
      }
      fireEvent.click(screen.getByText('×'))
      for (let i = 0; i < 9; i++) {
        fireEvent.click(screen.getByText('9'))
      }
      fireEvent.click(screen.getByText('='))
      expect(screen.getByRole('textbox')).toHaveValue('1.0e+18')
    })

    test('should display negative scientific notation for large numbers', () => {
      for (let i = 0; i < 10; i++) {
        fireEvent.click(screen.getByText('9'))
      }
      fireEvent.click(screen.getByText('+/-'))
      fireEvent.click(screen.getByText('×'))
      for (let i = 0; i < 9; i++) {
        fireEvent.click(screen.getByText('9'))
      }
      fireEvent.click(screen.getByText('='))
      expect(screen.getByRole('textbox')).toHaveValue('-1.0e+18')
    })

    test('should display positive scientific notation for large numbers', () => {
      for (let i = 0; i < 10; i++) {
        fireEvent.click(screen.getByText('9'))
      }
      fireEvent.click(screen.getByText('×'))
      for (let i = 0; i < 9; i++) {
        fireEvent.click(screen.getByText('9'))
      }
      for (let i = 0; i < 34; i++) {
        fireEvent.click(screen.getByText('='))
      }
      expect(screen.getByRole('textbox')).toHaveValue('Infinity')
    })

    test('should display positive scientific notation for large numbers', () => {
      for (let i = 0; i < 10; i++) {
        fireEvent.click(screen.getByText('9'))
      }
      fireEvent.click(screen.getByText('+/-'))
      fireEvent.click(screen.getByText('×'))
      for (let i = 0; i < 9; i++) {
        fireEvent.click(screen.getByText('9'))
      }
      for (let i = 0; i < 34; i++) {
        fireEvent.click(screen.getByText('='))
      }
      expect(screen.getByRole('textbox')).toHaveValue('-Infinity')
    })
  })

  describe('Special Operations', () => {
    describe('Percentage', () => {
      test('should convert single digit to percentage', () => {
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('%'))
        expect(screen.getByRole('textbox')).toHaveValue('0.05')
      })

      test('should convert multi-digit number to percentage', () => {
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('0'))
        fireEvent.click(screen.getByText('0'))
        fireEvent.click(screen.getByText('1'))
        fireEvent.click(screen.getByText('%'))
        expect(screen.getByRole('textbox')).toHaveValue('50.01')
      })

      test('should handle repeated equals', () => {
        fireEvent.click(screen.getByText('4'))
        fireEvent.click(screen.getByText('×'))
        fireEvent.click(screen.getByText('2'))
        fireEvent.click(screen.getByText('='))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('16')
      })

      test('should choose last operation', () => {
        fireEvent.click(screen.getByText('4'))
        fireEvent.click(screen.getByText('+'))
        fireEvent.click(screen.getByText('-'))
        fireEvent.click(screen.getByText('×'))
        fireEvent.click(screen.getByText('='))
        expect(screen.getByRole('textbox')).toHaveValue('0')
      })
    })

    describe('Sign Toggle', () => {
      test('should toggle positive to negative', () => {
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('+/-'))
        expect(screen.getByRole('textbox')).toHaveValue('-5')
      })

      test('should toggle negative to positive', () => {
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('+/-'))
        fireEvent.click(screen.getByText('+/-'))
        expect(screen.getByRole('textbox')).toHaveValue('5')
      })
    })

    describe('Clear Button', () => {
      test('should change AC to C when number is entered', () => {
        const clearButton = screen.getByText('AC')
        expect(clearButton).toHaveTextContent('AC')
        fireEvent.click(screen.getByText('5'))
        expect(clearButton).toHaveTextContent('C')
      })

      test('should change C back to AC after clearing', () => {
        fireEvent.click(screen.getByText('5'))
        const clearButton = screen.getByText('C')
        fireEvent.click(clearButton)
        expect(clearButton).toHaveTextContent('AC')
      })

      test('should clear display to zero', () => {
        fireEvent.click(screen.getByText('5'))
        fireEvent.click(screen.getByText('C'))
        expect(screen.getByRole('textbox')).toHaveValue('0')
      })
    })
  })

  describe('History Feature', () => {
    test('should render history button', () => {
      expect(screen.getByText('View History')).toBeInTheDocument()
    })

    test('should store calculations in localStorage', () => {
      localStorage.clear()
      fireEvent.click(screen.getByText('2'))
      fireEvent.click(screen.getByText('+'))
      fireEvent.click(screen.getByText('3'))
      fireEvent.click(screen.getByText('='))
      const history = JSON.parse(localStorage.getItem('history') || '[]')
      expect(history).toContain('2 + 3 = 5')
    })
  })

  describe('Continuous Operations', () => {
    test('should process multiple operations sequentially', () => {
      fireEvent.click(screen.getByText('2'))
      fireEvent.click(screen.getByText('+'))
      fireEvent.click(screen.getByText('3'))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('×'))
      fireEvent.click(screen.getByText('4'))
      fireEvent.click(screen.getByText('='))
      expect(screen.getByRole('textbox')).toHaveValue('20')
    })
  })

  describe('Memory Operations', () => {
    test('should maintain last operation memory', () => {
      fireEvent.click(screen.getByText('5'))
      fireEvent.click(screen.getByText('+'))
      fireEvent.click(screen.getByText('3'))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      expect(screen.getByRole('textbox')).toHaveValue('14')
    })

    test('should reset memory after AC', () => {
      const clearButton = screen.getByText('AC')
      fireEvent.click(screen.getByText('5'))
      fireEvent.click(screen.getByText('+'))
      fireEvent.click(screen.getByText('3'))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('C'))
      fireEvent.click(screen.getByText('='))
      expect(screen.getByRole('textbox')).toHaveValue('0')
      expect(clearButton).toHaveTextContent('AC')
    })
  })

  describe('Input Validation', () => {
    test('should handle multiple zeros at start', () => {
      fireEvent.click(screen.getByText('0'))
      fireEvent.click(screen.getByText('0'))
      fireEvent.click(screen.getByText('0'))
      expect(screen.getByRole('textbox')).toHaveValue('0')
    })

    test('should handle zero followed by number', () => {
      fireEvent.click(screen.getByText('0'))
      fireEvent.click(screen.getByText('5'))
      expect(screen.getByRole('textbox')).toHaveValue('5')
    })

    test('should handle decimal starting with zero', () => {
      fireEvent.click(screen.getByText('0'))
      fireEvent.click(screen.getByText(','))
      fireEvent.click(screen.getByText('5'))
      expect(screen.getByRole('textbox')).toHaveValue('0.5')
    })
  })

  describe('History Feature Extended', () => {
    test('should store complex calculations in history', () => {
      localStorage.clear()
      fireEvent.click(screen.getByText('2'))
      fireEvent.click(screen.getByText('+'))
      fireEvent.click(screen.getByText('3'))
      fireEvent.click(screen.getByText('×'))
      fireEvent.click(screen.getByText('4'))
      fireEvent.click(screen.getByText('='))
      const history = JSON.parse(localStorage.getItem('history') || '[]')
      expect(history[history.length - 1]).toContain('20')
    })

    test('should handle history with scientific notation', () => {
      localStorage.clear()
      Array(9)
        .fill('9')
        .forEach((num) => {
          fireEvent.click(screen.getByText(num))
        })
      fireEvent.click(screen.getByText('×'))
      fireEvent.click(screen.getByText('2'))
      fireEvent.click(screen.getByText('='))
      const history = JSON.parse(localStorage.getItem('history') || '[]')
      expect(history[history.length - 1]).toMatch(/e\+/)
    })
  })

  describe('UI Interaction', () => {
    test('should handle keyboard input', () => {
      const display = screen.getByRole('textbox')
      fireEvent.click(display)
      fireEvent.change(display, { target: { value: '123' } })
      expect(display).toHaveValue('123')
    })

    test('should handle click outside display', () => {
      const display = screen.getByRole('textbox')
      fireEvent.click(display)
      fireEvent.click(document.body)
      expect(display).not.toHaveClass('editing')
    })
  })
})
