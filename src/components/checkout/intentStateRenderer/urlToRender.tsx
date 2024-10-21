import { useEffect } from 'react';
import { type IntentStateDetails } from '@moneyhash/js-sdk/headless';

import { moneyHash } from '@/utils/moneyHash';
import { Button } from '@/components/ui/button';
import Loader from '@/components/loader';

export function UrlToRender({
  intentId,
  url,
  renderStrategy,
}: { intentId: string } & IntentStateDetails<'URL_TO_RENDER'>) {
  useEffect(() => {
    moneyHash.renderUrl({
      intentId,
      renderStrategy: renderStrategy === 'IFRAME' ? 'REDIRECT' : renderStrategy,
      url,
    });
  }, [intentId, url, renderStrategy]);

  if (renderStrategy === 'POPUP_IFRAME')
    return (
      <div className="p-4 flex gap-3">
        <Button
          size="sm"
          onClick={() =>
            moneyHash.renderUrl({
              intentId,
              renderStrategy,
              url,
            })
          }
        >
          Continue payment
        </Button>
        <p className="text-xs text-subtle">
          A new window should be open to continue your payment if it didn&apos;t
          open please click the button.
        </p>
      </div>
    );

  if (renderStrategy === 'IFRAME') {
    return <div className="h-96" id="rendered-url-iframe-container" />;
  }

  return (
    <div className="h-96 bg-black/30 flex items-center justify-center">
      <Loader />
    </div>
  );
}
