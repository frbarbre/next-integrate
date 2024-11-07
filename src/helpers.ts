import {
  getAccurankerAccessToken,
  getAccurankerAuthorizeUrl,
} from "./providers/accuranker";
import {
  getDiscordAccessToken,
  getDiscordAuthorizeUrl,
} from "./providers/discord";
import {
  getFacebookAccessToken,
  getFacebookAuthorizeUrl,
} from "./providers/facebook";
import {
  getGithubAccessToken,
  getGithubAuthorizeUrl,
} from "./providers/github";
import {
  getGoogleAccessToken,
  getGoogleAuthorizeUrl,
} from "./providers/google";
import {
  getKlaviyoAccessToken,
  getKlaviyoAuthorizeUrl,
} from "./providers/klaviyo";
import {
  getNotionAccessToken,
  getNotionAuthorizeUrl,
} from "./providers/notion";
import {
  getPinterestAccessToken,
  getPinterestAuthorizeUrl,
} from "./providers/pinterest";
import { getSlackAccessToken, getSlackAuthorizeUrl } from "./providers/slack";
import {
  getSnapchatAccessToken,
  getSnapchatAuthorizeUrl,
} from "./providers/snapchat";
import {
  getSpotifyAccessToken,
  getSpotifyAuthorizeUrl,
} from "./providers/spotify";
import {
  getTiktokAccessToken,
  getTiktokAuthorizeUrl,
} from "./providers/tiktok";
import {
  getTrustpilotAccessToken,
  getTrustpilotAuthorizeUrl,
} from "./providers/trustpilot";
import { Tokens } from "./types";

export async function generateAuthURL({
  params,
  base_url,
  client_id,
  scope,
  code_challenge,
  ...props
}: {
  params: string;
  base_url: string | undefined;
  client_id: string | undefined;
  scope?: string;
  code_challenge: string | undefined;
  [key: string]: string | undefined;
}) {
  if (!base_url) {
    throw new Error("base_url is required");
  }

  if (!client_id) {
    throw new Error("client_id is required");
  }

  if (params.includes("integration/google")) {
    const url = getGoogleAuthorizeUrl({
      client_id,
      scope,
      base_url,
      ...props,
    });

    return url;
  }

  if (params.includes("integration/pinterest")) {
    const url = getPinterestAuthorizeUrl({
      client_id,
      scope,
      base_url,
      ...props,
    });

    return url;
  }

  if (params.includes("integration/facebook")) {
    const url = getFacebookAuthorizeUrl({
      client_id,
      scope,
      base_url,
      ...props,
    });

    return url;
  }

  if (params.includes("integration/snapchat")) {
    const url = getSnapchatAuthorizeUrl({
      client_id,
      scope,
      base_url,
      ...props,
    });

    return url;
  }

  if (params.includes("integration/spotify")) {
    const url = getSpotifyAuthorizeUrl({
      client_id,
      scope,
      base_url,
      ...props,
    });

    return url;
  }

  if (params.includes("integration/slack")) {
    const url = getSlackAuthorizeUrl({
      client_id,
      scope,
      base_url,
      ...props,
    });

    return url;
  }

  if (params.includes("integration/klaviyo")) {
    const url = await getKlaviyoAuthorizeUrl({
      client_id,
      scope,
      base_url,
      code_challenge,
      ...props,
    });

    return url;
  }

  if (params.includes("integration/notion")) {
    const url = getNotionAuthorizeUrl({
      client_id,
      scope,
      base_url,
      ...props,
    });

    return url;
  }

  if (params.includes("integration/discord")) {
    const url = getDiscordAuthorizeUrl({
      client_id,
      scope,
      base_url,
      ...props,
    });

    return url;
  }

  if (params.includes("integration/github")) {
    const url = getGithubAuthorizeUrl({
      client_id,
      scope,
      base_url,
      ...props,
    });

    return url;
  }

  if (params.includes("integration/tiktok")) {
    const url = getTiktokAuthorizeUrl({
      client_id,
      scope,
      base_url,
      code_challenge,
      ...props,
    });

    return url;
  }

  if (params.includes("integration/trustpilot")) {
    const url = getTrustpilotAuthorizeUrl({
      client_id,
      scope,
      base_url,
      code_challenge,
      ...props,
    });

    return url;
  }

  if (params.includes("integration/accuranker")) {
    const url = getAccurankerAuthorizeUrl({
      client_id,
      scope,
      base_url,
      ...props,
    });

    return url;
  }
}

export async function generateTokens({
  code,
  params,
  base_url,
  client_id,
  client_secret,
  callback,
  code_verifier,
}: {
  code: string;
  params: string;
  base_url: string | undefined;
  client_id: string | undefined;
  client_secret: string | undefined;
  callback: (tokens: Tokens) => void;
  code_verifier: string | undefined;
}) {
  if (!base_url) {
    throw new Error("base_url is required");
  }

  if (!client_id) {
    throw new Error("client_id is required");
  }

  if (!client_secret) {
    throw new Error("client_secret is required");
  }

  if (params.includes("integration/google")) {
    const tokens = await getGoogleAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      callback,
    });

    return tokens;
  }

  if (params.includes("integration/pinterest")) {
    const tokens = await getPinterestAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      callback,
    });

    return tokens;
  }

  if (params.includes("integration/facebook")) {
    const tokens = await getFacebookAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      callback,
    });

    return tokens;
  }

  if (params.includes("integration/snapchat")) {
    const tokens = await getSnapchatAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      callback,
    });

    return tokens;
  }

  if (params.includes("integration/spotify")) {
    const tokens = await getSpotifyAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      callback,
    });

    return tokens;
  }

  if (params.includes("integration/slack")) {
    const tokens = await getSlackAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      callback,
    });

    return tokens;
  }

  if (params.includes("integration/klaviyo")) {
    const tokens = await getKlaviyoAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      code_verifier,
      callback,
    });

    return tokens;
  }

  if (params.includes("integration/notion")) {
    const tokens = await getNotionAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      callback,
    });

    return tokens;
  }

  if (params.includes("integration/discord")) {
    const tokens = await getDiscordAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      callback,
    });

    return tokens;
  }

  if (params.includes("integration/github")) {
    const tokens = await getGithubAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      callback,
    });

    return tokens;
  }

  if (params.includes("integration/tiktok")) {
    const tokens = await getTiktokAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      callback,
      code_verifier,
    });

    return tokens;
  }

  if (params.includes("integration/trustpilot")) {
    const tokens = await getTrustpilotAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      callback,
    });

    return tokens;
  }

  if (params.includes("integration/accuranker")) {
    const tokens = await getAccurankerAccessToken({
      base_url,
      client_id,
      client_secret,
      code,
      callback,
    });

    return tokens;
  }
}
