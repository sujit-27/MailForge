import Logo from '../LandingPage/Logo';

export default function LogoExample() {
  return (
    <div className="p-8 bg-background space-y-6">
      <Logo size="small" />
      <Logo size="default" />
      <Logo size="large" />
    </div>
  );
}
