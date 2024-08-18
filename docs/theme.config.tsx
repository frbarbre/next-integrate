import { useRouter } from 'next/router';
import { DocsThemeConfig } from 'nextra-theme-docs';
import LinkedIn from './components/linkedin';
import Logo from './components/logo';
import { Separator } from './components/ui/separator';
import { providers } from './constants';
import Image from 'next/image';
import { cn } from './lib/utils';

const config: DocsThemeConfig = {
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Next Integrate',
      };
    }
  },
  head: function useHead() {
    const { asPath } = useRouter();
    if (asPath === '/') {
      return (
        <>
          <title>Next Integrate</title>
          <link
            href="/icons/favicon.svg"
            rel="icon"
            media="(prefers-color-scheme: light)"
          />
          <link
            href="/icons/favicon-dark.svg"
            rel="icon"
            media="(prefers-color-scheme: dark)"
          />
        </>
      );
    }
    return (
      <>
        <link
          href="/icons/favicon.svg"
          rel="icon"
          media="(prefers-color-scheme: light)"
        />
        <link
          href="/icons/favicon-dark.svg"
          rel="icon"
          media="(prefers-color-scheme: dark)"
        />
      </>
    );
  },
  logo: <Logo />,
  project: {
    link: 'https://github.com/frbarbre/next-integrate',
  },
  chat: {
    icon: <LinkedIn />,
    link: 'https://linkedin.com/in/frbarbre',
  },
  docsRepositoryBase:
    'https://github.com/frbarbre/next-integrate/tree/main/docs',
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: true,
    // @ts-ignore
    titleComponent({ title, type }) {
      if (type === 'separator' && title === '--') {
        return <Separator />;
      }

      const provider = providers.find(
        (provider) => provider.name.toLowerCase() === title.toLowerCase(),
      );

      const providerNames = providers.map((provider) =>
        provider.name.toLocaleLowerCase(),
      );

      if (providerNames.includes(title.toLowerCase())) {
        return (
          <div className="flex items-center space-x-2">
            <Image
              src={'/icons/' + provider?.path}
              alt={title}
              width={16}
              height={16}
              className={cn('mr-2', provider?.invert && 'dark:invert')}
            />
            <span>{title}</span>
          </div>
        );
      }

      return title;
    },
  },
  footer: {
    text: 'Next Integrate © 2024',
  },
};

export default config;
