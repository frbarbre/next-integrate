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
  | "tiktok";

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
