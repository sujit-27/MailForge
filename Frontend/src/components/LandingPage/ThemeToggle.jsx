import { Sun, Moon, Terminal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../redux/slices/themeSlice';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  const handleThemeChange = (theme) => {
    dispatch(setTheme(theme));
  };

  const getIcon = () => {
    switch (currentTheme) {
      case 'classic-dark':
        return <Terminal className="h-5 w-5" />;
      default:
        return <Moon className="h-5 w-5" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-theme-toggle">
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange('dark')} data-testid="theme-dark">
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('classic-dark')} data-testid="theme-classic">
          <Terminal className="mr-2 h-4 w-4" />
          <span>Classic Dark</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
