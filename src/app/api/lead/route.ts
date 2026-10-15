import { handleLead } from "@/lib/handle-lead";

export function POST(request: Request) {
  return handleLead(request);
}
