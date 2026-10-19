import { Link, useParams } from "react-router-dom";
import { PageHeader, StatusBadge, PriorityBadge, EmptyState } from "@/dashboard/components";
import { useDashboardData } from "@/dashboard/state/DashboardProvider";
import { getEquipmentById, getRepairRequestsForEquipment, formatDate, formatNaira } from "@/dashboard/data/selectors";

export default function EquipmentProfile() {
  const { equipmentId } = useParams<{ equipmentId: string }>();
  const { equipment: equipmentList, repairRequests: allRequests } = useDashboardData();
  const equipment = equipmentId ? getEquipmentById(equipmentList, equipmentId) : undefined;
  const repairRequests = equipmentId ? getRepairRequestsForEquipment(allRequests, equipmentId) : [];

  if (!equipment) {
    return <EmptyState message="Equipment record not found." />;
  }

  const fields: Array<[string, string]> = [
    ["Type", equipment.type],
    ["Registration Number", equipment.registrationNumber],
    ["Serial Number", equipment.serialNumber],
    ["Model Number", equipment.modelNumber],
    ["Capacity / Specification", equipment.capacity ?? "—"],
    ["Current Location", equipment.location],
    ["Site", equipment.site],
    ["Last Maintenance Date", formatDate(equipment.lastMaintenanceDate)],
    ["Next Maintenance Date", formatDate(equipment.nextMaintenanceDate)],
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={equipment.name}
        description={`Equipment profile · ${equipment.site}`}
        actions={<StatusBadge status={equipment.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink">Equipment details</h2>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium tracking-wide text-muted uppercase">{label}</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">Total Maintenance Cost</h2>
          <p className="mt-3 text-2xl font-extrabold text-ink">{formatNaira(equipment.totalMaintenanceCost)}</p>
          <p className="mt-1 text-sm text-muted">{repairRequests.length} linked repair request(s)</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Linked repair requests</h2>
        {repairRequests.length === 0 ? (
          <EmptyState message="No repair requests have been logged for this equipment yet." />
        ) : (
          <div className="space-y-3">
            {repairRequests.map((rr) => (
              <Link
                key={rr.id}
                to={`/dashboard/repair-requests/${rr.id}`}
                className="flex flex-col gap-2 rounded-lg border border-black/5 bg-white p-4 shadow-sm transition-colors hover:bg-surface/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{rr.id}</p>
                  <p className="mt-0.5 text-sm text-muted">{rr.faultDescription}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={rr.priority} />
                  <StatusBadge status={rr.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
