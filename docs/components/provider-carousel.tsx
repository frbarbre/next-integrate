import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { providers } from '@/constants';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ProviderCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 1500);
  }, [api, current]);

  return (
    <div className="w-full py-6 sm:py-20">
      <div className="mx-auto max-w-[100svw] lg:container">
        <div className="flex flex-col gap-10">
          <h2 className="font-regular text-left text-xl tracking-tighter md:text-3xl lg:max-w-xl">
            Support for various providers
          </h2>
          <Carousel
            setApi={setApi}
            className="w-full rounded-lg bg-foreground/[1%] py-6"
          >
            <CarouselContent>
              {providers.map((provider) => (
                <CarouselItem
                  className="basis-1/4 sm:basis-1/6 lg:basis-[12.5%]"
                  key={provider.name}
                >
                  <div className="flex aspect-square items-center justify-center rounded-md bg-muted p-3 sm:p-6">
                    <Image
                      src={`/icons/${provider.path}`}
                      width={64}
                      height={64}
                      alt={`${provider.name} logo`}
                      className={cn(provider.invert && 'dark:invert')}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
