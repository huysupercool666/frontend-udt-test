import React from 'react'

interface HistoryProps {
  history: string[]
}

const AppHistory: React.FC<HistoryProps> = ({ history }) => {
  return (
    <div>
      <h1>Calculator History</h1>
      <ul></ul>
    </div>
  )
}

export default AppHistory
