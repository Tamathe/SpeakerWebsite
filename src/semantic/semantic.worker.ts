/// <reference lib="webworker" />

import { env, pipeline } from "@huggingface/transformers";
import type { WorkerRequest, WorkerResponse } from "./types";

const workerScope = self as unknown as DedicatedWorkerGlobalScope;
const modelId = "Xenova/all-MiniLM-L6-v2";

env.allowRemoteModels = true;
env.useBrowserCache = true;

type Extractor = Awaited<ReturnType<typeof pipeline<"feature-extraction">>>;
let extractorPromise: Promise<Extractor> | null = null;
let activeRequestId = 0;

function post(message: WorkerResponse) {
  workerScope.postMessage(message);
}

function getExtractor(requestId: number) {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", modelId, {
      device: "wasm",
      dtype: "q8",
      progress_callback: (info) => {
        if (requestId !== activeRequestId) return;

        if (info.status === "progress") {
          post({
            type: "status",
            requestId,
            status: "loading",
            progress: Math.max(1, Math.min(100, Math.round(info.progress))),
          });
        }
      },
    });
  }

  return extractorPromise;
}

function dotProduct(a: number[], b: number[]) {
  let total = 0;
  for (let index = 0; index < a.length; index += 1) {
    total += (a[index] ?? 0) * (b[index] ?? 0);
  }
  return total;
}

workerScope.addEventListener("message", async (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;

  if (message.type === "dispose") {
    if (extractorPromise) {
      const extractor = await extractorPromise.catch(() => null);
      await extractor?.dispose();
      extractorPromise = null;
    }
    workerScope.close();
    return;
  }

  activeRequestId = message.requestId;
  post({
    type: "status",
    requestId: message.requestId,
    status: "loading",
  });

  try {
    const extractor = await getExtractor(message.requestId);

    if (message.requestId !== activeRequestId) return;
    post({
      type: "status",
      requestId: message.requestId,
      status: "embedding",
    });

    const inputs = [message.query, ...message.documents.map((item) => item.text)];
    const output = await extractor(inputs, {
      pooling: "mean",
      normalize: true,
    });
    const vectors = output.tolist() as number[][];

    if (message.requestId !== activeRequestId) return;

    const queryVector = vectors[0] ?? [];
    const rankedIds = message.documents
      .map((document, index) => ({
        id: document.id,
        score: dotProduct(queryVector, vectors[index + 1] ?? []),
      }))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.id);

    post({
      type: "result",
      requestId: message.requestId,
      rankedIds,
    });
  } catch (error) {
    post({
      type: "error",
      requestId: message.requestId,
      message: error instanceof Error ? error.message : "Semantic model unavailable",
    });
  }
});
