import { parseHoursFiles, reconcile } from "@/features/hours-cross-check/hours-reconciliation";
import type { HoursWorkerRequest, HoursWorkerResponse } from "@/features/hours-cross-check/types";

self.onmessage = async (event: MessageEvent<HoursWorkerRequest>) => {
  const request = event.data;
  try {
    if (request.type === "parse") {
      const { parsed, review } = await parseHoursFiles(request.tngFile, request.classListFile, request.mappings);
      postWorkerMessage({ parsed, requestId: request.requestId, review, type: "parse" });
      return;
    }

    const results = reconcile(request.parsed, request.review, request.mappings);
    postWorkerMessage({ requestId: request.requestId, results, type: "reconcile" });
  } catch (err) {
    postWorkerMessage({
      message: err instanceof Error ? err.message : "Hours Cross-Check processing failed.",
      requestId: request.requestId,
      type: "error",
    });
  }
};

function postWorkerMessage(message: HoursWorkerResponse) {
  self.postMessage(message);
}
