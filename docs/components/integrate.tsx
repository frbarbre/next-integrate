import { integrate, Provider } from 'next-integrate';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnchorHTMLAttributes } from 'react';

export default function Integrate({
  provider, // The provider defined in the auth.ts file
  name, // The name of the integration defined in the auth.ts file
  children, // The children of the component
  redirect, // Optional, the URL to redirect to after the integration
  className, // Optional, the class name of the component
  ...props // The rest of the props
}: {
  provider: Provider;
  name: string;
  children?: React.ReactNode;
  redirect?: string;
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { asPath } = useRouter(); // The current URL, to redirect back to after the integration

  // This function generates the integration URL, which is used in the Link component
  const integration = integrate({
    name,
    provider,
    redirect: redirect || asPath,
    // base_path: "/something", The path to the integration route if it's different from the default: (api/auth/[...integration]/route.ts)
  });

  return (
    <Link href={integration} className={className} {...props}>
      {children}
    </Link>
  );
}
