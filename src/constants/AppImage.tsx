import Image, { ImageProps } from 'next/image';
import { useApp } from '@/app/providers';

interface AppImageProps extends ImageProps {
  src: string;
}

export default function AppImage({ src, ...rest }: AppImageProps) {
  const { imgBaseUrl } = useApp();

  const srcPath = `${imgBaseUrl}${src}`;

  return <Image {...rest} src={srcPath} alt={rest?.alt || 'image'} />;
}
