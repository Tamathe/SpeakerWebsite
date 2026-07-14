const routeMetadata = {
  "/": {
    title: "Tama Thé, MD | Physician, Educator, Builder",
    description:
      "Tama Thé works across healthcare, medical education, public health, and practical artificial intelligence in Kentucky.",
  },
  "/healthcare": {
    title: "AI in Healthcare | Tama Thé, MD",
    description:
      "Healthcare AI initiatives spanning cancer screening, diabetic retinopathy, rural access, and whole-blood drone delivery.",
  },
  "/medical-education": {
    title: "AI in Medical Education | Tama Thé, MD",
    description:
      "Research and practical work on clinical reasoning, assessment, SEEF, and formative clinical-performance evaluation.",
  },
  "/incubator": {
    title: "AI Incubator | Tama Thé, MD",
    description:
      "A brief introduction to the University of Kentucky AI Incubator and Tama Thé's role in building the cross-campus community.",
  },
  "/ai-literacy": {
    title: "AI Literacy | Tama Thé, MD",
    description:
      "Practice-based AI literacy for clinicians, educators, staff, students, and institutions learning to test output, recognize limits, and use AI with judgment.",
  },
  "/speaking": {
    title: "Speaking | Tama Thé, MD",
    description:
      "Selected talks, workshops, and public conversations about useful AI in healthcare, medical education, and Kentucky.",
  },
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
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html")) {
      return response;
    }

    const url = new URL(request.url);
    const pathname = normalizePath(url.pathname);
    const metadata = routeMetadata[pathname] ?? {
      title: "Page not found | Tama Thé, MD",
      description: "The requested page could not be found.",
    };
    const canonicalUrl = `${url.origin}${pathname}`;
    const socialImageUrl = `${url.origin}/og.png`;
    const htmlResponse = new Response(response.body, {
      headers: response.headers,
      status: routeMetadata[pathname] ? response.status : 404,
      statusText: routeMetadata[pathname] ? response.statusText : "Not Found",
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
