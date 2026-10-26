import { jsPDF } from "jspdf";
import type { Equipment, RepairRequest, User } from "@/dashboard/types";
import { getIdleDays, getUserDisplayName, formatDate, formatDateTime, formatNaira } from "@/dashboard/data/selectors";
import { APPROVAL_DECISION_LABEL, FAULT_TYPE_LABEL, PRIORITY_LABEL, REPAIR_STATUS_LABEL } from "@/dashboard/data/labels";

const PAGE_WIDTH = 595.28; // A4, points
const MARGIN = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

/**
 * Builds a printable PDF covering everything recorded against a completed
 * repair request: fault details, the full approval trail, every repair
 * action with its cost, idle time, and total cost — so a supervisor or MD
 * can hand over or archive a complete record of the repair.
 */
export function generateRepairReportPdf(request: RepairRequest, equipment: Equipment | undefined, users: User[]): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = MARGIN;

  function heading(text: string) {
    ensureSpace(28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(text, MARGIN, y);
    y += 8;
    doc.setDrawColor(210);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 16;
  }

  function row(label: string, value: string) {
    ensureSpace(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(label, MARGIN, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value || "—", CONTENT_WIDTH - 160);
    doc.text(lines, MARGIN + 160, y);
    y += Math.max(14, lines.length * 12);
  }

  function paragraph(label: string, value: string) {
    ensureSpace(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(label, MARGIN, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value || "—", CONTENT_WIDTH);
    ensureSpace(lines.length * 12);
    doc.text(lines, MARGIN, y);
    y += lines.length * 12 + 6;
  }

  function ensureSpace(needed: number) {
    if (y + needed > 780) {
      doc.addPage();
      y = MARGIN;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("MF Ventures Services Limited", MARGIN, y);
  y += 18;
  doc.setFontSize(12);
  doc.text(`Repair Report — ${request.requestNumber}`, MARGIN, y);
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generated ${formatDateTime(new Date().toISOString())}`, MARGIN, y);
  doc.setTextColor(0);
  y += 24;

  heading("Equipment");
  row("Equipment", equipment?.name ?? "—");
  row("Registration No.", equipment?.registrationNumber ?? "—");
  row("Serial No.", equipment?.serialNumber ?? "—");
  row("Site", equipment?.assignedSite ?? "—");

  heading("Fault Details");
  row("Status", REPAIR_STATUS_LABEL[request.status]);
  row("Priority", PRIORITY_LABEL[request.priority]);
  row("Fault Type", FAULT_TYPE_LABEL[request.faultType]);
  row("Reported", formatDateTime(request.faultDatetime));
  row("Reported By", getUserDisplayName(users, request.reportedById));
  row("Detected By", request.faultDetectedBy ?? "—");
  row("Assigned Mechanic", getUserDisplayName(users, request.assignedMechanicId));
  paragraph("Fault Description", request.faultDescription);
  paragraph("Repair Recommendation", request.repairRecommendation ?? "—");

  heading("Approval Trail");
  const approvals = request.approvals ?? [];
  if (approvals.length === 0) {
    row("Approvals", "No approval records.");
  } else {
    for (const approval of approvals) {
      row(
        approval.stage === "supervisor" ? "Supervisor" : "MD",
        `${APPROVAL_DECISION_LABEL[approval.decision]} — ${getUserDisplayName(users, approval.decidedById)} — ${formatDateTime(approval.createdAt)}${approval.comment ? ` — "${approval.comment}"` : ""}`,
      );
    }
  }

  heading("Repair Actions");
  const actions = request.repairActions ?? [];
  if (actions.length === 0) {
    row("Actions", "No repair actions logged.");
  } else {
    for (const action of actions) {
      row(formatDate(action.actionDate), `${action.actionTaken} — ${getUserDisplayName(users, action.performedById)} — ${formatNaira(action.totalCost)}`);
      if (action.partsMaterialsUsed) row("", `Parts: ${action.partsMaterialsUsed}${action.quantity ? ` × ${action.quantity}` : ""}`);
      if (action.notes) row("", `Notes: ${action.notes}`);
    }
  }

  heading("Costs & Downtime");
  row("Estimated Cost", request.estimatedCost ? formatNaira(request.estimatedCost) : "—");
  const totalCost = request.totalRepairCost ?? actions.reduce((sum, a) => sum + a.totalCost, 0);
  row("Total Repair Cost", formatNaira(totalCost));
  const idleDays = getIdleDays(request);
  row("Idle Days", idleDays !== null ? `${idleDays} day${idleDays === 1 ? "" : "s"} (fault reported → repair completed)` : "—");
  row("Completed", formatDateTime(request.updatedAt));

  return doc;
}

export function downloadRepairReportPdf(request: RepairRequest, equipment: Equipment | undefined, users: User[]): void {
  const doc = generateRepairReportPdf(request, equipment, users);
  doc.save(`${request.requestNumber}-repair-report.pdf`);
}
