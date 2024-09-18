import useConfiguration from '@/store/useConfiguration';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/context/themeProvider';

function Divide() {
  return (
    <div className="w-0.5 h-4 bg-gray-300 dark:bg-gray-500 rounded-md mr-3" />
  );
}
export function Configuration() {
  const { layout, cardForm, fontFamily, setConfiguration } = useConfiguration(
    state => state,
  );

  const { theme, setTheme } = useTheme();
  return (
    <div className="bg-muted">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8  py-3 px-4 flex items-center justify-end">
        <div className="flex items-center ml-3 overflow-x-auto py-3 -my-3 px-3 -mx-3 *:shrink-0">
          <div className="flex items-center">
            <Label htmlFor="theme" className="text-subtler">
              Theme:
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Divide />
          <div className="flex items-center">
            <Label htmlFor="layout" className="text-subtler">
              Layout:
            </Label>
            <Select
              value={layout}
              onValueChange={value =>
                setConfiguration({ layout: value as any })
              }
            >
              <SelectTrigger id="layout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accordion">Accordion</SelectItem>
                <SelectItem value="tabs">Tabs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Divide />
          <div className="flex items-center">
            <Label
              htmlFor="cardForm"
              className="text-subtler whitespace-nowrap"
            >
              Card Form:
            </Label>
            <Select
              value={cardForm}
              onValueChange={value =>
                setConfiguration({ cardForm: value as any })
              }
            >
              <SelectTrigger id="cardForm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="expanded">Expanded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Divide />
          <div className="flex items-center">
            <Label
              htmlFor="font-family"
              className="text-subtler  whitespace-nowrap"
            >
              Font Family:
            </Label>
            <Select
              value={fontFamily}
              onValueChange={value =>
                setConfiguration({ fontFamily: value as any })
              }
            >
              <SelectTrigger id="fontFamily" style={{ fontFamily }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Default">Default</SelectItem>
                <SelectItem
                  value="Arial,Helvetica,sans-serif"
                  style={{ fontFamily: 'Arial,Helvetica,sans-serif' }}
                >
                  Arial
                </SelectItem>
                <SelectItem
                  value="Georgia,serif"
                  style={{ fontFamily: 'Georgia,serif' }}
                >
                  Georgia
                </SelectItem>
                <SelectItem
                  value="monospace"
                  style={{ fontFamily: 'monospace' }}
                >
                  Monospace
                </SelectItem>
                <SelectItem
                  value="Palatino Linotype,Book Antiqua,Palatino,serif"
                  style={{
                    fontFamily: 'Palatino Linotype,Book Antiqua,Palatino,serif',
                  }}
                >
                  Palatino Linotype
                </SelectItem>
                <SelectItem
                  value="Times New Roman,Times,serif"
                  style={{ fontFamily: 'Times New Roman,Times,serif' }}
                >
                  Times New Roman
                </SelectItem>
                <SelectItem
                  value="Comic Sans MS,cursive,sans-serif"
                  style={{ fontFamily: 'Comic Sans MS,cursive,sans-serif' }}
                >
                  Comic Sans MS
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
