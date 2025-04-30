import { useEffect, useState } from 'react'
import './App.css'
import { epilot } from '@epilot/app-bridge';

function App() {
  const [selectedZap, setSelectedZap] = useState<number | null>(null)
  const zaps = [
    { id: 1, name: 'New Email to Google Sheets' },
    { id: 2, name: 'New Trello Card from Slack Message' },
    { id: 3, name: 'New Shopify Order to Slack' },
  ]

  useEffect(() => {
    const unsubscribe = epilot.subscribeToParentMessages('init-action-config', (message) => {
      const config = message.data?.config?.custom_action_config;

      if (config) {
        setSelectedZap(config.selectedZap)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleChange = (zap: typeof zaps[number]) => {
    setSelectedZap(zap.id);

    epilot.sendMessageToParent('update-action-config', { config: { selectedZap: zap.id } });
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Select a Zap</h1>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <ul>
          {zaps.map((zap) => (
            <li
              key={zap.id}
              className={`p-4 border-b hover:bg-gray-100 cursor-pointer ${
                selectedZap === zap.id ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleChange(zap)}
            >
              {zap.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
