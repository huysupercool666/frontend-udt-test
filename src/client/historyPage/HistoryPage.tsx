import React, { useState, useEffect } from 'react'

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const storedHistory = localStorage.getItem('history')
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
  }, [])

  return (
    <>
      <style>
        {`
          .history-page {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            min-height: 100vh;
            font-family: Arial, sans-serif;
          }

          .history-page h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 2.5rem;
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          .history-list {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .history-list p {
            text-align: center;
            color: #666;
            font-style: italic;
            padding: 20px 0;
          }

          .history-list ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .history-list ul li {
            padding: 15px;
            border-bottom: 1px solid #eee;
            color: #444;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            transition: background-color 0.3s ease;
            animation: fadeIn 0.5s ease forwards;
            opacity: 0;
          }

          .history-list ul li:last-child {
            border-bottom: none;
          }

          .history-list ul li:hover {
            background-color: #f8f8f8;
          }

          .history-list ul li::before {
            content: "→";
            margin-right: 10px;
            color: #666;
          }

          button {
            display: block;
            margin: 30px auto 0;
            padding: 12px 25px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          }

          button:hover {
            background-color: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          button:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 600px) {
            .history-page {
              padding: 10px;
            }
            .history-page h1 {
              font-size: 2rem;
            }
            .history-list {
              padding: 15px;
            }
            .history-list li {
              font-size: 1rem;
              padding: 12px;
            }
            button {
              width: 100%;
              padding: 15px;
            }
          }

          .history-list ul li:nth-child(1) { animation-delay: 0.1s; }
          .history-list ul li:nth-child(2) { animation-delay: 0.2s; }
          .history-list ul li:nth-child(3) { animation-delay: 0.3s; }
          .history-list ul li:nth-child(4) { animation-delay: 0.4s; }
          .history-list ul li:nth-child(5) { animation-delay: 0.5s; }
        `}
      </style>
      <div className='history-page'>
        <h1>Lịch Sử Tính Toán</h1>
        <div className='history-list'>
          {history.length === 0 ? (
            <p>Không có lịch sử tính toán</p>
          ) : (
            <ul>
              {history.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={() => (window.location.href = 'http://localhost:3001')}>Quay lại máy tính</button>
      </div>
    </>
  )
}

export default HistoryPage
