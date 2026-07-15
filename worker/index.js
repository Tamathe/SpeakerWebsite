const siteMetadata = {
  title: "Tama Thé, MD | Physician, Educator, Builder, Speaker",
  description:
    "Talks, teaching, and public work from Tama Thé on useful AI in healthcare, education, and Kentucky.",
};

const legacyRedirects = {
  "/speaking": "/#featured-talk",
  "/healthcare": "/#featured-talk",
  "/medical-education": "/#tek100",
  "/incubator": "/#incubator",
  "/ai-literacy": "/#tek100",
};

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return `/${pathname.split("/").filter(Boolean).join("/")}`;
}

class ContentAttributeHandler {
  constructor(content) {
    this.content = content;
  }

  element(element) {
    element.setAttribute("content", this.content);
  }
}

class HrefAttributeHandler {
  constructor(href) {
    this.href = href;
  }

  element(element) {
    element.setAttribute("href", this.href);
  }
}

class TitleHandler {
  constructor(title) {
    this.title = title;
  }

  element(element) {
    element.setInnerContent(this.title);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = normalizePath(url.pathname);
    const redirectTarget = legacyRedirects[pathname];

    if (redirectTarget) {
      return Response.redirect(new URL(redirectTarget, url.origin), 301);
    }

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html")) {
      return response;
    }

    const isHome = pathname === "/";
    const metadata = isHome
      ? siteMetadata
      : {
          title: "Page not found | Tama Thé, MD",
          description: "The requested page could not be found.",
        };
    const canonicalUrl = isHome ? `${url.origin}/` : `${url.origin}${pathname}`;
    const socialImageUrl = `${url.origin}/og.png`;
    const htmlResponse = new Response(response.body, {
      headers: response.headers,
      status: isHome ? response.status : 404,
      statusText: isHome ? response.statusText : "Not Found",
    });

    return new HTMLRewriter()
      .on("title", new TitleHandler(metadata.title))
      .on('meta[name="description"]', new ContentAttributeHandler(metadata.description))
      .on('meta[property="og:title"]', new ContentAttributeHandler(metadata.title))
      .on('meta[property="og:description"]', new ContentAttributeHandler(metadata.description))
      .on('meta[property="og:url"]', new ContentAttributeHandler(canonicalUrl))
      .on('meta[property="og:image"]', new ContentAttributeHandler(socialImageUrl))
      .on('meta[name="twitter:title"]', new ContentAttributeHandler(metadata.title))
      .on('meta[name="twitter:description"]', new ContentAttributeHandler(metadata.description))
      .on('meta[name="twitter:image"]', new ContentAttributeHandler(socialImageUrl))
      .on('link[rel="canonical"]', new HrefAttributeHandler(canonicalUrl))
      .transform(htmlResponse);
  },
};
