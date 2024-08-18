import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQ() {
  return (
    <Accordion type="single" collapsible className="mt-4 w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it open source?</AccordionTrigger>
        <AccordionContent>
          Yes, the libary is fully open source and free to use. You're more than
          welcome to contribute{' '}
          <a
            className="underline"
            target="_blank"
            href="https://github.com/frbarbre/next-integrate"
          >
            here
          </a>
          .
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Can i request a provider?</AccordionTrigger>
        <AccordionContent>
          Yes, you can request any OAuth 2.0 provider right{' '}
          <a
            className="underline"
            target="_blank"
            href="https://github.com/frbarbre/next-integrate"
          >
            here
          </a>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Are any data stored?</AccordionTrigger>
        <AccordionContent>
          No, the library purely handles the necessary redirects and API calls,
          for the OAuth flows to work. You'll handle any storage of the data
          yourself.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger>
          Does it support both the App and Pages router?
        </AccordionTrigger>
        <AccordionContent>
          Yes, Next Integrate works with both the App and Pages Router.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5">
        <AccordionTrigger>Does it support TypeScript?</AccordionTrigger>
        <AccordionContent>
          Yes, the libary is written in TypeScript and supports it out of the
          box. If you're using JavaScript, you'll just have to ignore the types.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
