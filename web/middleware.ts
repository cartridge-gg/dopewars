import { geolocation } from "@vercel/functions";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const blockedStates = ["AZ", "AR", "CT", "DE", "LA", "MT", "SC", "SD", "TN"];

const blockingHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Not Available in Your Region</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            padding: 60px 40px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .icon {
            font-size: 64px;
            margin-bottom: 20px;
        }

        h1 {
            color: #2d3748;
            font-size: 32px;
            margin-bottom: 16px;
            font-weight: 700;
        }

        p {
            color: #718096;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 12px;
        }

        .divider {
            height: 1px;
            background: #e2e8f0;
            margin: 30px 0;
        }

        .info {
            background: #f7fafc;
            padding: 20px;
            border-radius: 10px;
            margin-top: 30px;
        }

        .info p {
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🚫</div>
        <h1>Not Available in Your Region</h1>
        <p>We're sorry, but this service is not available in your state.</p>
        <div class="divider"></div>
        <p style="font-size: 16px;">This restriction is in place because skill-based real money gaming is illegal in certain jurisdictions.</p>
        <div class="info">
            <p>If you believe this is an error, please contact support.</p>
        </div>
    </div>
</body>
</html>
`;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets and favicon
  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const { country, region } = geolocation(request);

  if (country === "US" && region && blockedStates.includes(region)) {
    return new NextResponse(blockingHtml, {
      status: 451,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
