import { useEffect, useState } from 'react';
import { epilot } from '@epilot/app-bridge';
import { apiClient } from './api';
import { useQuery } from '@tanstack/react-query';
import { Select, Text, Button } from '@epilot/core-ui';
import AddIcon from '@epilot360/icons/react/Add';
import OpenInNewIcon from '@epilot360/icons/react/OpenInNew';
import RefreshIcon from '@epilot360/icons/react/Refresh';
import InfoIcon from '@epilot360/icons/react/Info';
import zapierLogo from './zapier.svg';
import './App.css';
import { Trans, useTranslation } from 'react-i18next';

const ZAPIER_INVITE_URL = 'https://zapier.com/developer/public-invite/224131/943ee60e5209137a26dfda91898237af/';
const ZAPIER_SETUP_URL = 'https://zapier.com/webintent/create-zap?referrer=platform-visual-builder&steps%5B0%5D%5Btitle%5D=Test%20Zap%20for%20Automation%20Action%20Trigger%20from%20epilot%20Version%201.0.0&steps%5B0%5D%5Bapp%5D=App224131CLIAPI%401.0.0&steps%5B0%5D%5Btype%5D=read&steps%5B0%5D%5Baction%5D=automation_action';
const DOCS_LINK_DE = 'https://help.epilot.cloud/de_DE/zapier';
const DOCS_LINK_EN = 'https://docs.epilot.io/docs/integrations/zapier'; 

function App() {
  const { t, i18n } = useTranslation();
  const docsLink = i18n.language === 'de' ? DOCS_LINK_DE : DOCS_LINK_EN;

  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  const subscriptionsQuery = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => apiClient.listHookSubscriptions().then((res) => res.data),
  });

  const subscriptions = subscriptionsQuery.data?.subscriptions ?? [];
  const currentSubscription = subscriptions.find((sub) => sub.id === subscriptionId);

  useEffect(() => {
    const unsubscribe = epilot.subscribeToParentMessages('init-action-config', (message) => {
      const config = message.data?.config?.custom_action_config;
      if (config) {
        setSubscriptionId(config.subscriptionId);
      }
    });

    epilot.sendMessageToParent('init-action-config', {});

    return () => {
      unsubscribe();
    }
  }, []);

  const handleChange = (selectedId: string) => {
    if (selectedId === 'new') {
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
    <div className="min-h-screen flex flex-col gap-2 p-1">

      {/* Step 1 */}
      <div className="bg-white p-6 border border-gray-200 rounded-xl">
        <h3 className="text-md font-bold mb-2">1. {t('title_step_one', 'Set up Zapier with the epilot App')}</h3>
        <Button variant="outline" className="cursor-pointer" onClick={() => window.open(ZAPIER_INVITE_URL, '_blank')}>
          {t('settings', 'Use epilot on Zapier')}
        </Button>
      </div>

      {/* Step 2 */}
      <div className="bg-white p-6 border border-gray-200 rounded-xl"> 
        <h3  className="text-md font-bold mb-2">2. {t('title_step_two', 'Create a Trigger for epilot in Zapier')}</h3>
        <Button variant="outline" className="mt-2 cursor-pointer" onClick={() => window.open(ZAPIER_SETUP_URL, '_blank')}>
          {t('button_new_integration', 'New Zapier Integration')}
        </Button>
      </div>

      {/* Step 3 */}
      <div className="bg-white p-6 border border-gray-200 rounded-xl">
        <h3 className="text-md font-bold mb-2">3. {t('title_step_three', 'Select the Zapier Trigger you created')}</h3>
        {subscriptionsQuery.isLoading ? (
          <Text>{t('loading', 'Loading...')}</Text>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <Select.Root size="2" onValueChange={handleChange} value={currentSubscription ? subscriptionId! : undefined}>
              <Select.Trigger
                placeholder={t('select_trigger', 'Select a trigger')}
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
                      <a href={ZAPIER_SETUP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                        <AddIcon />
                        <span>{t('option_new_integration', 'New Zapier Integration')}</span>
                      </a>
                    </Select.Group>
                  </>
                )}
                {!subscriptions.length && (
                  <Select.Item value="new" className="hidden">
                    <div className="flex items-center gap-2">
                      <AddIcon />
                      <span>{t('option_new_integration', 'New Zapier Integration')}</span>
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

            <button onClick={() => subscriptionsQuery.refetch()} disabled={subscriptionsQuery.isFetching} className="cursor-pointer">
              <RefreshIcon className="w-6 h-6" fill={subscriptionsQuery.isFetching ? 'var(--gray-10)' : 'var(--blue-10)'} />
            </button>
          </div>

          
        )}
      </div>

      <div className="">
        <a href={docsLink} target="_blank" rel="noreferrer" className="text-blue-500"><InfoIcon className="inline-block" fill="var(--blue-10)" /> <span className="underline">{t('documentation', 'Zapier App Documentation')}</span></a>
      </div>

      <a href="https://zapier.com" target="_blank" rel="noreferrer">
        <div className="flex flex-col items-center justify-center gap-1 m-4">
          <img src={zapierLogo} alt="zapier" className="w-12" />
          <Text as="div" size="1">
            <Trans t={t} i18nKey="powered_by_zapier">
              Powered by <span className="underline">Zapier.com</span>
            </Trans>
          </Text>
        </div>
      </a>
    </div>
  );
}

export default App;
