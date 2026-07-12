import { useCallback, useEffect, useRef, useState } from "react";
import type {
  SemanticDocument,
  WorkerRequest,
  WorkerResponse,
} from "../semantic/types";

export type SemanticStatus =
  | "idle"
  | "guided"
  | "loading"
  | "embedding"
  | "ready"
  | "unavailable";

interface SemanticState {
  status: SemanticStatus;
  rankedIds: string[];
  progress?: number;
}

function prefersDataSaving() {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return Boolean(connection?.saveData);
}

export function useSemanticSearch() {
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const [state, setState] = useState<SemanticState>({
    status: "idle",
    rankedIds: [],
  });

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../semantic/semantic.worker.ts", import.meta.url),
        { type: "module" },
      );

      workerRef.current.addEventListener(
        "message",
        (event: MessageEvent<WorkerResponse>) => {
          const message = event.data;
          if (message.requestId !== requestIdRef.current) return;

          if (message.type === "status") {
            setState((current) =>
              message.progress === undefined
                ? { ...current, status: message.status }
                : {
                    ...current,
                    status: message.status,
                    progress: message.progress,
                  },
            );
            return;
          }

          if (message.type === "result") {
            setState({ status: "ready", rankedIds: message.rankedIds });
            return;
          }

          setState((current) => ({
            ...current,
            status: "unavailable",
          }));
        },
      );

      workerRef.current.addEventListener("error", () => {
        setState((current) => ({
          ...current,
          status: "unavailable",
        }));
      });
    }

    return workerRef.current;
  }, []);

  const search = useCallback(
    (query: string, documents: SemanticDocument[]) => {
      requestIdRef.current += 1;

      if (prefersDataSaving() || typeof Worker === "undefined") {
        setState({ status: "guided", rankedIds: [] });
        return;
      }

      setState({ status: "loading", rankedIds: [] });
      const request: WorkerRequest = {
        type: "search",
        requestId: requestIdRef.current,
        query,
        documents,
      };
      getWorker().postMessage(request);
    },
    [getWorker],
  );

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        const request: WorkerRequest = { type: "dispose" };
        workerRef.current.postMessage(request);
        workerRef.current = null;
      }
    };
  }, []);

  return { ...state, search };
}
