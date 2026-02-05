import { ClockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ExpiredState() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleReturnToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-4">
        <ClockIcon className="w-12 h-12 text-orange-600 dark:text-orange-400" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-bolder">
          {t('intentExpired.title')}
        </h3>
        <p className="text-subtle text-sm max-w-md">
          {t('intentExpired.message')}
        </p>
      </div>

      <Button onClick={handleReturnToCart} className="mt-4">
        {t('intentExpired.returnToCart')}
      </Button>
    </div>
  );
}
