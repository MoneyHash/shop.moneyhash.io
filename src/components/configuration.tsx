import { MoneyHashLogo } from '@/components/moneyHashLogo';
import useConfiguration from '@/store/useConfiguration';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useTheme } from '@/context/themeProvider';

export function Configuration() {
  const { layout, cardForm, fontFamily, setConfiguration } = useConfiguration(
    state => state,
  );
  const { theme, setTheme } = useTheme();
  return (
    <div className="bg-muted">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 py-3 px-4 flex items-center justify-between">
        <MoneyHashLogo />
        <div className="flex items-center gap-3 ml-3 overflow-y-auto *:shrink-0">
          <div className="flex items-center">
            <Label htmlFor="theme" className="text-subtler">
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

          <div className="flex items-center">
            <Label
              htmlFor="cardForm"
              className="text-subtler whitespace-nowrap"
            >
              Card Form:
            </Label>
            <Select
              id="cardForm"
              value={cardForm}
              onChange={value => setConfiguration({ cardForm: value })}
            >
              <option value="compact">Compact</option>
              <option value="expanded">Expanded</option>
            </Select>
          </div>

          <div className="flex items-center whitespace-nowrap">
            <Label htmlFor="font-family" className="text-subtler">
              Font Family:
            </Label>
            <Select
              id="fontFamily"
              value={fontFamily}
              onChange={value => setConfiguration({ fontFamily: value })}
              style={{ fontFamily }}
            >
              <option value="">Default</option>
              <option
                value="Arial,Helvetica,sans-serif"
                style={{ fontFamily: 'Arial,Helvetica,sans-serif' }}
              >
                Arial
              </option>
              <option
                value="Georgia,serif"
                style={{ fontFamily: 'Georgia,serif' }}
              >
                Georgia
              </option>
              <option value="monospace" style={{ fontFamily: 'monospace' }}>
                Monospace
              </option>
              <option
                value="Palatino Linotype,Book Antiqua,Palatino,serif"
                style={{
                  fontFamily: 'Palatino Linotype,Book Antiqua,Palatino,serif',
                }}
              >
                Palatino Linotype
              </option>
              <option
                value="Times New Roman,Times,serif"
                style={{ fontFamily: 'Times New Roman,Times,serif' }}
              >
                Times New Roman
              </option>
              <option
                value="Comic Sans MS,cursive,sans-serif"
                style={{ fontFamily: 'Comic Sans MS,cursive,sans-serif' }}
              >
                Comic Sans MS
              </option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
