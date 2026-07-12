export interface SemanticDocument {
  id: string;
  text: string;
}

export interface SearchRequest {
  type: "search";
  requestId: number;
  query: string;
  documents: SemanticDocument[];
}

export interface DisposeRequest {
  type: "dispose";
}

export type WorkerRequest = SearchRequest | DisposeRequest;

export type WorkerResponse =
  | {
      type: "status";
      requestId: number;
      status: "loading" | "embedding";
      progress?: number;
    }
  | {
      type: "result";
      requestId: number;
      rankedIds: string[];
    }
  | {
      type: "error";
      requestId: number;
      message: string;
    };
