export type Tokens = {
  provider: Provider;
  [key: string]: any;
};

export type Provider =
  | "google"
  | "pinterest"
  | "facebook"
  | "snapchat"
  | "spotify"
  | "slack"
  | "klaviyo"
  | "notion"
  | "discord"
  | "github"
  | "tiktok"
  | "trustpilot"
  | "accuranker"
  | "click-up"
  | "linkedin"
  | "reddit"
  | "azure"
  | "tesla"
  | "shopify";

export type IntegrateOptions = {
  name: string;
  redirect: string;
  base_path?: string;
} & (
    | { provider: "shopify"; shop: string }
    | { provider: Exclude<Provider, "shopify">; shop?: never }
  );

export type Auth = {
  base_url: string;
  providers: {
    provider: Provider;
    client_id: string;
    client_secret: string;
    integrations: {
      name: string;
      options?: {
        scope?: string;
        response_type?: string;
        [key: string]: any;
      };
      callback: (tokens: Tokens) => void;
    }[];
  }[];
};
