import { auth } from '@/auth';
import { clearCookies, exchange, handler } from 'next-integrate';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// BASE_URL is the URL of the app, e.g. https://example.com, set in the .env file
const BASE_URL = process.env.BASE_URL;

export async function GET(
  req: NextRequest,
  context: { params: { integration: string[] } },
) {
  const cookieStore = cookies();

  // This function generates the auth URL
  const { auth_url, callback, error, options, redirect } = await handler({
    req,
    context,
    auth,
    cookieStore,
  });

  if (error) NextResponse.redirect(new URL(`?error${error}`, BASE_URL));

  const auth_error = req.nextUrl.searchParams.get('error');

  if (auth_error) {
    clearCookies({ cookieStore });

    return NextResponse.redirect(
      new URL(`${redirect}?error=${auth_error}`, BASE_URL),
    );
  }

  const code = req.nextUrl.searchParams.get('code');

  // If there is no code, redirect to the auth URL
  if (!code) return NextResponse.redirect(auth_url);

  // This function exchanges the code for the tokens,
  // You can handle the tokens in the callback function in the auth.ts file,
  // or here in the route handler like this:

  //const tokens = await exchange({ callback, code, options, cookieStore });

  await exchange({ callback, code, options, cookieStore });

  return NextResponse.redirect(new URL(redirect, BASE_URL));
}
