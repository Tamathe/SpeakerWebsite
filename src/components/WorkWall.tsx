import {
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSemanticSearch } from "../hooks/useSemanticSearch";
import {
  wallItems,
  type WallItem,
  type WallMedia,
} from "../wallContent";

const WALL_WIDTH = 3600;
const WALL_HEIGHT = 2400;
const START_ITEM = "kentucky-stage";

type Camera = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function useMotionAllowed() {
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const update = () => setAllowed(!media.matches && !connection?.saveData);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return allowed;
}

function SpritePreview({
  media,
  active,
  motionAllowed,
}: {
  media: Extract<WallMedia, { kind: "sprite" }>;
  active: boolean;
  motionAllowed: boolean;
}) {
  const firstFrame = media.startFrame ?? 0;
  const [frame, setFrame] = useState(firstFrame);

  useEffect(() => {
    setFrame(firstFrame);
    if (!active || !motionAllowed) return;

    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % media.frames);
    }, media.frameMs ?? 180);

    return () => window.clearInterval(timer);
  }, [active, firstFrame, media.frameMs, media.frames, motionAllowed]);

  const column = frame % media.columns;
  const row = Math.floor(frame / media.columns);
  const x = (column / (media.columns - 1)) * 100;
  const y = (row / (media.rows - 1)) * 100;

  return (
    <div
      className="wall-sprite"
      role="img"
      aria-label={media.alt}
      style={{
        backgroundImage: `url(${media.src})`,
        backgroundPosition: `${x}% ${y}%`,
        backgroundSize: `${media.columns * 100}% ${media.rows * 100}%`,
      }}
    />
  );
}

function VideoPreview({
  media,
  active,
  detail = false,
  motionAllowed,
}: {
  media: Extract<WallMedia, { kind: "video" }>;
  active: boolean;
  detail?: boolean;
  motionAllowed: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !detail;
    if (detail) video.currentTime = 0;

    if (active && motionAllowed) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }

    return () => video.pause();
  }, [active, detail, motionAllowed]);

  if ((!active || !motionAllowed) && !detail) {
    return <img src={media.poster} alt={media.alt} loading="lazy" />;
  }

  return (
    <video
      ref={videoRef}
      src={media.src}
      poster={media.poster}
      muted={!detail}
      loop={!detail}
      playsInline
      autoPlay={motionAllowed}
      controls={detail}
      preload={detail ? "auto" : "metadata"}
      aria-label={media.alt}
    />
  );
}

function WallMediaView({
  item,
  active,
  detail = false,
  motionAllowed,
}: {
  item: WallItem;
  active: boolean;
  detail?: boolean;
  motionAllowed: boolean;
}) {
  const { media } = item;

  if (media.kind === "text") return null;
  if (media.kind === "sprite") {
    return (
      <SpritePreview
        media={media}
        active={active}
        motionAllowed={motionAllowed}
      />
    );
  }
  if (media.kind === "video") {
    return (
      <VideoPreview
        media={media}
        active={active}
        detail={detail}
        motionAllowed={motionAllowed}
      />
    );
  }

  return (
    <img
      src={media.src}
      alt={media.alt}
      loading={item.id === START_ITEM ? "eager" : "lazy"}
      style={{
        objectFit: detail ? "contain" : (media.fit ?? "cover"),
        objectPosition: media.position ?? "center",
      }}
    />
  );
}

const WallTile = memo(function WallTile({
  item,
  index,
  active,
  motionAllowed,
  onFocus,
  onOpen,
}: {
  item: WallItem;
  index: number;
  active: boolean;
  motionAllowed: boolean;
  onFocus: (id: string) => void;
  onOpen: (item: WallItem) => void;
}) {
  const style = {
    "--tile-x": `${item.x}px`,
    "--tile-y": `${item.y}px`,
    "--tile-width": `${item.w}px`,
    "--tile-height": `${item.h}px`,
  } as CSSProperties;

  return (
    <button
      className={`wall-tile theme-${item.theme} ${
        item.media.kind === "text" ? "is-text" : "has-media"
      } ${
        item.media.kind === "video" && item.media.captioned
          ? "is-captioned-feature"
          : ""
      } ${active ? "is-active" : ""}`}
      style={style}
      type="button"
      data-wall-item={item.id}
      aria-label={`${item.title}. ${item.kicker}. Open story.`}
      onFocus={() => onFocus(item.id)}
      onClick={() => onOpen(item)}
    >
      <span className="tile-media" aria-hidden={item.media.kind === "text"}>
        <WallMediaView
          item={item}
          active={active}
          motionAllowed={motionAllowed}
        />
      </span>
      <span className="tile-shade" />
      <span className="tile-number">{String(index + 1).padStart(2, "0")}</span>
      {item.media.kind === "video" && (
        <span className="tile-live">
          <i />
          {item.media.captioned
            ? "CAPTIONED LOOP · OPEN WITH SOUND"
            : "SILENT LOOP"}
        </span>
      )}
      {item.media.kind === "sprite" && (
        <span className="tile-live"><i /> MOVING FRAMES</span>
      )}
      <span className="tile-copy">
        <span className="tile-kicker">{item.kicker}</span>
        <strong>{item.title}</strong>
        <span className="tile-body">{item.body}</span>
        <span className="tile-open">
          {item.media.kind === "video" ? "OPEN CLIP + SOUND" : "OPEN"} ↗
        </span>
      </span>
    </button>
  );
});

function DetailOverlay({
  item,
  index,
  motionAllowed,
  onClose,
}: {
  item: WallItem;
  index: number;
  motionAllowed: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div
      className="detail-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`detail-card theme-${item.theme}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <header>
          <span>{String(index + 1).padStart(2, "0")} / {String(wallItems.length).padStart(2, "0")}</span>
          <button ref={closeRef} type="button" onClick={onClose}>
            CLOSE ×
          </button>
        </header>
        <div className="detail-layout">
          <div className="detail-media">
            <WallMediaView
              item={item}
              active
              detail
              motionAllowed={motionAllowed}
            />
            {item.media.kind === "text" && (
              <p className="detail-statement">{item.title}</p>
            )}
          </div>
          <div className="detail-copy">
            <span>{item.kicker}</span>
            <h2 id="detail-title">{item.title}</h2>
            <p>{item.body}</p>
            <a href={item.href} target={item.href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer">
              {item.linkLabel} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function basicRank(query: string) {
  const terms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 1);

  return wallItems
    .map((item, originalIndex) => {
      const searchable = [
        item.title,
        item.kicker,
        item.body,
        ...item.keywords,
      ].join(" ").toLowerCase();
      const score = terms.reduce((total, term) => {
        const exact = searchable.split(/\s+/).filter((word) => word === term).length;
        return total + exact * 3 + (searchable.includes(term) ? 1 : 0);
      }, 0);
      return { item, score, originalIndex };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)
    .slice(0, 4)
    .map(({ item }) => item.id);
}

function Finder({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [fallbackIds, setFallbackIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const semantic = useSemanticSearch();
  const documents = useMemo(
    () =>
      wallItems.map((item) => ({
        id: item.id,
        text: [item.title, item.kicker, item.body, ...item.keywords].join(". "),
      })),
    [],
  );

  useEffect(() => inputRef.current?.focus(), []);

  const resultIds =
    semantic.status === "ready" && semantic.rankedIds.length > 0
      ? semantic.rankedIds.slice(0, 4)
      : fallbackIds;

  useEffect(() => {
    if (semantic.status === "ready" && semantic.rankedIds[0]) {
      onNavigate(semantic.rankedIds[0]);
    }
  }, [onNavigate, semantic.rankedIds, semantic.status]);

  const search = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    const ranked = basicRank(clean);
    setFallbackIds(ranked);
    setSubmitted(true);
    if (ranked[0]) onNavigate(ranked[0]);
    semantic.search(clean, documents);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search(query);
  };

  const status = (() => {
    if (!submitted) return "Describe the problem. I’ll move the wall.";
    if (semantic.status === "loading") {
      return semantic.progress
        ? `Loading the on-device model · ${semantic.progress}%`
        : "Loading the on-device model · first search only";
    }
    if (semantic.status === "embedding") return "Comparing your question with the wall";
    if (semantic.status === "ready") return "Best match centered behind this panel";
    if (semantic.status === "guided" || semantic.status === "unavailable") {
      return fallbackIds.length > 0
        ? "Basic search centered the wall"
        : "No obvious match. Try a few different words.";
    }
    return "Searching";
  })();

  return (
    <section className="wall-panel finder-panel" role="dialog" aria-modal="true" aria-labelledby="finder-title">
      <header>
        <span>FIND SOMETHING</span>
        <button type="button" onClick={onClose}>CLOSE ×</button>
      </header>
      <div className="finder-body">
        <p>Search the work, not a list of pages.</p>
        <h2 id="finder-title">What are you trying to figure out?</h2>
        <form onSubmit={submit}>
          <label htmlFor="wall-query">Your question</label>
          <div>
            <input
              ref={inputRef}
              id="wall-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="How do we get patients from screening into care?"
              maxLength={240}
              autoComplete="off"
            />
            <button type="submit">FIND →</button>
          </div>
        </form>
        <div className="finder-presets" aria-label="Example searches">
          {[
            "AI literacy for clinicians",
            "Cancer screening in rural Kentucky",
            "Using AI for assessment",
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setQuery(preset);
                search(preset);
              }}
            >
              {preset}
            </button>
          ))}
        </div>
        <p className={`finder-status status-${semantic.status}`} aria-live="polite">
          <i /> {status}
        </p>
        {resultIds.length > 0 && (
          <ol className="finder-results">
            {resultIds.map((id, index) => {
              const item = wallItems.find((candidate) => candidate.id === id);
              if (!item) return null;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(id);
                      onClose();
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item.title}</strong>
                    <em>GO THERE →</em>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}

function WallIndex({
  activeId,
  onClose,
  onNavigate,
}: {
  activeId: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);

  return (
    <section className="wall-panel index-panel" role="dialog" aria-modal="true" aria-labelledby="index-title">
      <header>
        <span id="index-title">THE WHOLE WALL</span>
        <button ref={closeRef} type="button" onClick={onClose}>CLOSE ×</button>
      </header>
      <ol>
        {wallItems.map((item, index) => (
          <li key={item.id} className={item.id === activeId ? "is-current" : ""}>
            <button
              type="button"
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{item.kicker}</span>
              <strong>{item.title}</strong>
              <em>→</em>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

function MiniMap({ camera, activeId }: { camera: Camera; activeId: string }) {
  const visibleLeft = Math.max(0, camera.left);
  const visibleTop = Math.max(0, camera.top);
  const visibleRight = Math.min(WALL_WIDTH, camera.left + camera.width);
  const visibleBottom = Math.min(WALL_HEIGHT, camera.top + camera.height);
  const viewportStyle = {
    left: `${(visibleLeft / WALL_WIDTH) * 100}%`,
    top: `${(visibleTop / WALL_HEIGHT) * 100}%`,
    width: `${Math.max(0, ((visibleRight - visibleLeft) / WALL_WIDTH) * 100)}%`,
    height: `${Math.max(0, ((visibleBottom - visibleTop) / WALL_HEIGHT) * 100)}%`,
  };

  return (
    <div className="wall-minimap" aria-hidden="true">
      {wallItems.map((item) => (
        <i
          key={item.id}
          className={item.id === activeId ? "is-active" : ""}
          style={{
            left: `${(item.x / WALL_WIDTH) * 100}%`,
            top: `${(item.y / WALL_HEIGHT) * 100}%`,
            width: `${Math.max(2, (item.w / WALL_WIDTH) * 100)}%`,
            height: `${Math.max(2, (item.h / WALL_HEIGHT) * 100)}%`,
          }}
        />
      ))}
      <span style={viewportStyle} />
    </div>
  );
}

export function WorkWall() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    scrollLeft: number;
    scrollTop: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const initializedRef = useRef(false);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const motionAllowed = useMotionAllowed();
  const [activeId, setActiveId] = useState(START_ITEM);
  const [camera, setCamera] = useState<Camera>({ left: 0, top: 0, width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);
  const [detailItem, setDetailItem] = useState<WallItem | null>(null);
  const [panel, setPanel] = useState<"finder" | "index" | null>(null);

  const rememberFocus = useCallback(() => {
    lastFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
  }, []);

  const restoreFocus = useCallback(() => {
    window.requestAnimationFrame(() => lastFocusRef.current?.focus());
  }, []);

  const openDetail = useCallback((item: WallItem) => {
    rememberFocus();
    setDetailItem(item);
  }, [rememberFocus]);

  const closeDetail = useCallback(() => {
    setDetailItem(null);
    restoreFocus();
  }, [restoreFocus]);

  const openPanel = useCallback((next: "finder" | "index") => {
    rememberFocus();
    setPanel(next);
  }, [rememberFocus]);

  const closePanel = useCallback(() => {
    setPanel(null);
    restoreFocus();
  }, [restoreFocus]);

  const activeIndex = Math.max(0, wallItems.findIndex((item) => item.id === activeId));
  const activeItem = wallItems[activeIndex] ?? wallItems[0]!;

  const updateCamera = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const next: Camera = {
      left: viewport.scrollLeft - viewport.clientWidth / 2,
      top: viewport.scrollTop - viewport.clientHeight / 2,
      width: viewport.clientWidth,
      height: viewport.clientHeight,
    };
    setCamera(next);

    const centerX = next.left + next.width / 2;
    const centerY = next.top + next.height / 2;
    let nearest = wallItems[0]!;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const item of wallItems) {
      const dx = item.x + item.w / 2 - centerX;
      const dy = item.y + item.h / 2 - centerY;
      const distance = dx * dx + dy * dy;
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = item;
      }
    }

    setActiveId((current) => (current === nearest.id ? current : nearest.id));
  }, []);

  const handleScroll = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      updateCamera();
    });
  }, [updateCamera]);

  const centerItem = useCallback(
    (id: string, behavior?: ScrollBehavior) => {
      const viewport = viewportRef.current;
      const item = wallItems.find((candidate) => candidate.id === id);
      if (!viewport || !item) return;

      viewport.scrollTo({
        left: item.x + item.w / 2,
        top: item.y + item.h / 2,
        behavior: behavior ?? (motionAllowed ? "smooth" : "auto"),
      });
      setActiveId(id);
    },
    [motionAllowed],
  );

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const frame = window.requestAnimationFrame(() => {
      centerItem(START_ITEM, "auto");
      updateCamera();
      viewportRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [centerItem, updateCamera]);

  useEffect(() => {
    const resize = () => updateCamera();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [updateCamera]);

  useEffect(() => {
    if (!detailItem && !panel) return;
    const background = [
      viewportRef.current,
      document.querySelector<HTMLElement>(".wall-header"),
      document.querySelector<HTMLElement>(".wall-footer"),
    ].filter((node): node is HTMLElement => Boolean(node));

    for (const node of background) {
      node.setAttribute("inert", "");
      node.setAttribute("aria-hidden", "true");
    }

    return () => {
      for (const node of background) {
        node.removeAttribute("inert");
        node.removeAttribute("aria-hidden");
      }
    };
  }, [detailItem, panel]);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (detailItem) closeDetail();
      else if (panel) closePanel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeDetail, closePanel, detailItem, panel]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.button !== 0) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
      moved: false,
    };
    viewport.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const viewport = viewportRef.current;
    if (!drag || !viewport || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > 6) drag.moved = true;
    viewport.scrollLeft = drag.scrollLeft - dx;
    viewport.scrollTop = drag.scrollTop - dy;
  };

  const pointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const viewport = viewportRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (viewport?.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
    if (drag.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
    dragRef.current = null;
    setDragging(false);
  };

  const keyboardPan = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const amount = event.shiftKey ? 360 : 160;
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [-amount, 0],
      ArrowRight: [amount, 0],
      ArrowUp: [0, -amount],
      ArrowDown: [0, amount],
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();
    viewport.scrollBy({ left: delta[0], top: delta[1], behavior: motionAllowed ? "smooth" : "auto" });
  };

  return (
    <main className="wall-shell" id="field">
      <div
        ref={viewportRef}
        className={`wall-viewport ${dragging ? "is-dragging" : ""}`}
        tabIndex={0}
        aria-label="Interactive wall of Tama Thé's work. Drag, scroll, swipe, or use arrow keys to explore."
        onScroll={handleScroll}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        onKeyDown={keyboardPan}
        onClickCapture={(event) => {
          if (!suppressClickRef.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <div
          className="wall-canvas"
          style={{
            width: `calc(${WALL_WIDTH}px + 100vw)`,
            height: `calc(${WALL_HEIGHT}px + 100vh)`,
          }}
        >
          <div
            className="wall-stage"
            style={{ width: WALL_WIDTH, height: WALL_HEIGHT }}
          >
            <span className="wall-coordinate coordinate-a">38.0464° N / 84.4970° W</span>
            <span className="wall-coordinate coordinate-b">THE WORK IS ALL OVER THIS WALL</span>
            <span className="wall-coordinate coordinate-c">KENTUCKY / 2026</span>
            {wallItems.map((item, index) => (
              <WallTile
                key={item.id}
                item={item}
                index={index}
                active={item.id === activeId && !detailItem && !panel}
                motionAllowed={motionAllowed}
                onFocus={centerItem}
                onOpen={openDetail}
              />
            ))}
          </div>
        </div>
      </div>

      <header className="wall-header">
        <a className="wall-brand" href="#field" onClick={(event) => { event.preventDefault(); centerItem(START_ITEM); }}>
          <strong>TAMA THÉ</strong>
        </a>
        <div className="wall-now" aria-live="polite">
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(wallItems.length).padStart(2, "0")}</span>
          <strong>{activeItem.title}</strong>
        </div>
        <nav aria-label="Wall controls">
          <button type="button" onClick={() => openPanel("finder")}>FIND</button>
          <button type="button" onClick={() => openPanel("index")}>INDEX</button>
          <a href="mailto:Tama.the@uky.edu?subject=Healthcare%20AI%20conversation">EMAIL ME ↗</a>
        </nav>
      </header>

      <div className="center-reticle" aria-hidden="true"><i /></div>
      <footer className="wall-footer">
        <p><strong>DRAG</strong> / SCROLL / SWIPE <span>·</span> CLICK ANYTHING</p>
        <MiniMap camera={camera} activeId={activeId} />
      </footer>

      {panel === "finder" && (
        <Finder onClose={closePanel} onNavigate={centerItem} />
      )}
      {panel === "index" && (
        <WallIndex activeId={activeId} onClose={closePanel} onNavigate={centerItem} />
      )}
      {detailItem && (
        <DetailOverlay
          item={detailItem}
          index={wallItems.findIndex((item) => item.id === detailItem.id)}
          motionAllowed={motionAllowed}
          onClose={closeDetail}
        />
      )}
    </main>
  );
}
