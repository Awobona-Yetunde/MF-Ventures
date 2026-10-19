import { useState } from "react";
import { Button } from "@/components/ui";
import type { ApprovalDecision } from "@/dashboard/types";

interface ApprovalPanelProps {
  stage: "Supervisor" | "MD";
  onDecide: (decision: ApprovalDecision, comment: string) => void;
}

/**
 * The Approve / Reject or Return / Request More Information action used on
 * the Repair Request Detail page. Shown only when the signed-in user is the
 * one authorised to act on this request at its current stage — that check
 * happens in the parent, this component just renders the decision itself.
 */
export function ApprovalPanel({ stage, onDecide }: ApprovalPanelProps) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<ApprovalDecision | null>(null);

  function handleDecide(decision: ApprovalDecision) {
    if (decision !== "Approved" && comment.trim().length === 0) {
      setError("Add a comment so the mechanic knows what to fix or clarify.");
      return;
    }
    setError(null);
    setPending(decision);
    onDecide(decision, comment.trim());
  }

  if (pending) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm font-medium text-emerald-800">
        Decision recorded: {pending}.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-5">
      <h2 className="text-sm font-semibold text-ink">{stage} Decision Required</h2>
      <p className="mt-1 text-sm text-muted">
        Approve to move this request forward, or send it back with a comment explaining what's needed.
      </p>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">Comment</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Required for Reject / Return or Request More Information"
          className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
      </label>

      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="md" onClick={() => handleDecide("Approved")}>
          Approve Repair
        </Button>
        <Button variant="secondary" size="md" className="border border-amber-300" onClick={() => handleDecide("Request More Information")}>
          Request More Information
        </Button>
        <Button variant="danger" size="md" onClick={() => handleDecide("Rejected / Returned")}>
          Reject / Return
        </Button>
      </div>
    </div>
  );
}
