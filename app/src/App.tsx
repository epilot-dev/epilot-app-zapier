import { useEffect, useState } from 'react'
import { epilot } from '@epilot/app-bridge';
import { apiClient } from './api';
import { useQuery } from '@tanstack/react-query';
import { Select, Text, Tooltip } from '@epilot/core-ui';
import AddIcon from '@epilot360/icons/react/Add'
import InfoIcon from '@epilot360/icons/react/Info'
import OpenInNewIcon from '@epilot360/icons/react/OpenInNew'
import RefreshIcon from '@epilot360/icons/react/Refresh'
import zapierLogo from './zapier.svg'
import './App.css'

const ZAPIER_SETUP_URL = 'https://zapier.com/webintent/create-zap?referrer=platform-visual-builder&steps%5B0%5D%5Btitle%5D=Test%20Zap%20for%20Automation%20Action%20Trigger%20from%20epilot%20Version%201.0.0&steps%5B0%5D%5Bapp%5D=App224131CLIAPI%401.0.0&steps%5B0%5D%5Btype%5D=read&steps%5B0%5D%5Baction%5D=automation_action';

function App() {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null)

  const subscriptionsQuery = useQuery({
    queryKey: ['subscriptions'], 
    queryFn: () => apiClient.listHookSubscriptions().then((res) => res.data),
  });

  const subscriptions = subscriptionsQuery.data?.subscriptions ?? []
  const currentSubscription = subscriptions.find((sub) => sub.id === subscriptionId);

  useEffect(() => {
    const unsubscribe = epilot.subscribeToParentMessages('init-action-config', (message) => {
      console.log('*** init-action-config', message)
      const config = message.data?.config?.custom_action_config;
      if (config) {
        setSubscriptionId(config.subscriptionId)
      }
    })

    epilot.sendMessageToParent('init-action-config', {});

    return () => {
      unsubscribe()
    }
  }, [])

  const handleChange = (selectedId: string) => {
    if (selectedId === 'new') {
      // open new tab to zapier
      window.open(ZAPIER_SETUP_URL, '_blank');
      return;
    }

    if (subscriptionId === selectedId) {
      setSubscriptionId(null);
      epilot.sendMessageToParent('update-action-config', { config: { subscriptionId: null } });

      return;
    }

    setSubscriptionId(selectedId);
    epilot.sendMessageToParent('update-action-config', { config: { subscriptionId: selectedId } });
  };

  return (
    <div className="min-h-screen flex flex-col gap-8 justify-between">
      <div>
      {!subscriptionsQuery.isLoading && (
        <div className='flex flex-col gap-1'>
          <Text as="label">Select Zapier Trigger: <Tooltip content="Install the epilot App on Zapier to create a Trigger"><InfoIcon className="inline-block" /></Tooltip></Text>
          
          <div className="flex items-center gap-2">
              <Select.Root size="3" onValueChange={handleChange} value={currentSubscription ? subscriptionId! : undefined}>
                <Select.Trigger
                  placeholder="Select a trigger"
                  variant="surface"
                  className="w-full"
                  disabled={subscriptionsQuery.isFetching}
                />

                <Select.Content variant="solid" className="shadow-none">
                  {subscriptions?.map((sub) => (
                    <Select.Item key={sub.id} value={sub.id}>{sub.triggerName} ({sub.zapId})</Select.Item>
                  ))}

                  {!!subscriptions.length && (
                    <>
                      <Select.Separator />
                      <Select.Group className="py-2 px-1 pr-4">
                        <a href={ZAPIER_SETUP_URL} target="_blank" rel="noreferrer">
                          <div className="flex items-center gap-2">
                            <AddIcon />
                            <span>Create Zapier Integration</span>
                          </div>
                        </a>
                      </Select.Group>
                    </>
                  )}

                  {!subscriptions.length && (
                    <Select.Item value="new" className="hidden">
                      <div className="flex items-center gap-2">
                        <AddIcon />
                        <span>Create Zapier Integration</span>
                      </div>
                    </Select.Item>
                  )}
                  
                </Select.Content>
              </Select.Root>

              {currentSubscription && (
                <a href={`https://zapier.com/app/zaps`} target="_blank" rel="noreferrer">
                  <OpenInNewIcon className="w-6 h-6" fill="var(--blue-10)" />
                </a>
              )}

              <button onClick={() => subscriptionsQuery.refetch()} disabled={subscriptionsQuery.isFetching}>
                <RefreshIcon className="w-6 h-6" fill={subscriptionsQuery.isFetching ? 'var(--gray-10)' : 'var(--blue-10)'} />
              </button>
          </div>
        </div>
      )}
      </div>
      

      <a href="https://zapier.com" target="_blank" rel="noreferrer">
        <div className="flex flex-col items-center justify-center gap-1 m-4">
          <img src={zapierLogo} alt="zapier" className="w-12" />
          <Text as="div" size="1">Powered by <span className="underline">Zapier.com</span></Text>
        </div>
      </a>
    </div>
  )
}

export default App
