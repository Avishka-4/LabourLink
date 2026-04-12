import { Moon, Sun, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTheme } from '../contexts/theme-context';
import { useLanguage } from '../contexts/language-context';

export function ThemeLanguageToggle() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Select value={language} onValueChange={(val) => setLanguage(val as any)}>
        <SelectTrigger className="w-32">
          <Globe className="size-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="si">සිංහල</SelectItem>
          <SelectItem value="ta">தமிழ்</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </Button>
    </div>
  );
}
