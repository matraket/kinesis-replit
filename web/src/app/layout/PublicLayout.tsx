import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { FooterSection } from '../../../../shared/components/sections';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterSection />
    </div>
  );
}
