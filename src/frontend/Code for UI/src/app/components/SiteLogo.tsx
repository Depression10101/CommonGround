import logoImage from '../../imports/Untitled_design_(1).png';

export function SiteLogo() {
  return (
    <img
      src={logoImage}
      alt="Common Ground Logo"
      className="w-10 h-10 object-contain"
    />
  );
}
