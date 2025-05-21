import { useEffect, useState } from 'react'
import './App.css'
import { epilot } from '@epilot/app-bridge';
import { apiClient } from './api';
import { useQuery } from '@tanstack/react-query';
import { Subscription } from './openapi';

function App() {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null)

  const subscriptionsQuery = useQuery({
    queryKey: ['subscriptions'], 
    queryFn: () => apiClient.listHookSubscriptions().then((res) => res.data),
  });

  useEffect(() => {
    const unsubscribe = epilot.subscribeToParentMessages('init-action-config', (message) => {
      const config = message.data?.config?.custom_action_config;

      if (config) {
        setSubscriptionId(config.selectedSubscription)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleChange = (sub: Subscription) => {
    setSubscriptionId(sub.id);

    epilot.sendMessageToParent('update-action-config', { config: { subscriptionId: sub.id } });
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Select a Trigger</h1>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <ul>
          {subscriptionsQuery.data?.subscriptions?.map((sub) => (
            <li
              key={sub.id}
              className={`p-4 border-b hover:bg-gray-100 cursor-pointer ${
                subscriptionId === sub.id ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleChange(sub)}
            >
              {sub.triggerName || sub.zapId || sub.id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
