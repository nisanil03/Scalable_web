/*
  Avatar component
  - Renders an <img> when `src` is provided.
  - Otherwise renders a deterministic SVG circle with initials.
*/

type Props = {
  name?: string | null;
  src?: string | null;
  size?: number; // px
  className?: string;
  alt?: string;
};

export default function Avatar({ name, src, size = 40, className = '', alt }: Props) {
  // If a remote image src is provided, show it. Otherwise use the static default avatar
  // Use import.meta.env.BASE_URL so the path works when the app is served from a sub-path
  const base = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.BASE_URL ? (import.meta as any).env.BASE_URL : '/';
  const defaultSrc = `${base}default-avatar.svg`;

  if (src) {
    return (
      // eslint-disable-next-line jsx-a11y/img-redundant-alt
      <img src={src} alt={alt || name || 'avatar'} className={className} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/img-redundant-alt
    <img src={defaultSrc} alt={alt || name || 'avatar'} className={className} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />
  );
}
