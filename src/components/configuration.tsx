import { MoneyHashLogo } from '@/components/moneyHashLogo';
import useConfiguration from '@/store/useConfiguration';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useTheme } from '@/context/themeProvider';

export function Configuration() {
  const { layout, setConfiguration } = useConfiguration(state => state);
  const { theme, setTheme } = useTheme();
  return (
    <div className="bg-muted">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 py-3 px-4 flex items-center justify-between">
        <MoneyHashLogo />
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Label htmlFor="Theme" className="text-subtler">
              Theme:
            </Label>
            <Select
              id="theme"
              value={theme}
              onChange={value => setTheme(value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </Select>
          </div>
          <div className="flex items-center">
            <Label htmlFor="layout" className="text-subtler">
              Layout:
            </Label>
            <Select
              id="layout"
              value={layout}
              onChange={value => setConfiguration({ layout: value })}
            >
              <option value="accordion">Accordion</option>
              <option value="tabs">Tabs</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
