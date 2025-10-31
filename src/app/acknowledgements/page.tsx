import type { Metadata } from 'next';
import AcknowledgementsClient from './AcknowledgementsClient';

export const metadata: Metadata = {
  title: 'Acknowledgements - Clickfluencer Idle',
  description:
    'Special thanks to the friends, family, and feline assistants who helped shape Clickfluencer Idle.',
  openGraph: { images: ['/og-image.png'] },
};

export default function AcknowledgementsPage() {
  return <AcknowledgementsClient />;
}
