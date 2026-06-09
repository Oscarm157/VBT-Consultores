import { notFound } from "next/navigation";
import { Link2, Mail, Phone, Globe, CalendarClock, Lock } from "lucide-react";
import { Breadcrumb } from "@/components/crm/Breadcrumb";
import { getLead, getComments, getFiles, getEvents, getActiveUsers, getUserById } from "@/lib/crm-data";
import { getCurrentUser } from "@/lib/crm-session";
import { canEditLead, isReadOnly } from "@/lib/crm-permissions";
import { fmtDateTime } from "@/lib/crm-format";
import { StatusControl } from "@/components/crm/StatusControl";
import { OwnerControl } from "@/components/crm/OwnerControl";
import { SourceBadge } from "@/components/crm/status";
import { CommentForm } from "@/components/crm/CommentForm";
import { Files } from "@/components/crm/Files";
import { Activity } from "@/components/crm/Activity";
import { LeadDetailsForm } from "@/components/crm/LeadDetailsForm";
import { DeleteLeadButton } from "@/components/crm/DeleteLeadButton";
import { addLeadComment, updateLeadDetails } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Lead", robots: { index: false } };

const LOCALE_LABEL: Record<string, string> = { en: "English", es: "Spanish" };

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getCurrentUser();
  if (!viewer) notFound();

  const lead = await getLead(id, viewer);
  if (!lead) notFound();

  const [comments, files, events, usersList] = await Promise.all([
    getComments(id),
    getFiles(id),
    getEvents(id),
    getActiveUsers(),
  ]);

  const canEdit = canEditLead(viewer, lead);
  const readOnly = isReadOnly(viewer.role);
  const editable = canEdit && !readOnly;

  const addComment = addLeadComment.bind(null, lead.id);
  const saveDetails = updateLeadDetails.bind(null, lead.id);

  // Ensure the current owner shows in the picker even if they were deactivated.
  let ownerUsers = usersList;
  if (lead.assignedTo && !usersList.some((u) => u.id === lead.assignedTo)) {
    const owner = await getUserById(lead.assignedTo);
    if (owner) ownerUsers = [...usersList, owner];
  }
  const ownerName = lead.assignedTo
    ? ownerUsers.find((u) => u.id === lead.assignedTo)?.name ?? "Assigned"
    : null;

  return (
    <div>
      <Breadcrumb items={[{ label: "Leads", href: "/admin" }, { label: lead.name ?? "Lead" }]} />

      {/* Header card */}
      <header className="crm-card mt-4 overflow-hidden">
        <div className="bg-[var(--crm-wine)] px-5 py-5 text-white sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-serif text-[26px] leading-none tracking-tight text-white sm:text-[30px]">
                  {lead.name ?? "No name"}
                </h1>
                <SourceBadge source={lead.source} onDark />
                {!editable && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white">
                    <Lock className="size-3" strokeWidth={2} />
                    Solo lectura
                  </span>
                )}
              </div>
              <dl className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-white/85">
                {lead.email && (
                  <Meta icon={Mail} href={`mailto:${lead.email}`}>{lead.email}</Meta>
                )}
                {lead.phone && (
                  <Meta icon={Phone} href={`tel:${lead.phone}`}>{lead.phone}</Meta>
                )}
                {lead.locale && (
                  <Meta icon={Globe}>{LOCALE_LABEL[lead.locale] ?? lead.locale}</Meta>
                )}
                <Meta icon={CalendarClock}>Received {fmtDateTime(lead.createdAt)}</Meta>
              </dl>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <OwnerControl
                leadId={lead.id}
                assignedTo={lead.assignedTo}
                users={ownerUsers}
                viewerRole={viewer.role}
                ownerName={ownerName}
              />
              <StatusControl leadId={lead.id} status={lead.status} editable={editable} onDark />
              {viewer.role === "admin" && <DeleteLeadButton id={lead.id} />}
            </div>
          </div>
        </div>
      </header>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Main column */}
        <div className="flex flex-col gap-5">
          {lead.summary && (
            <Section title="AI summary" accent>
              <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[var(--crm-ink-soft)]">
                {lead.summary}
              </p>
            </Section>
          )}

          <Section title="Qualification">
            <LeadDetailsForm
              action={saveDetails}
              editable={editable}
              lead={{
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                locale: lead.locale,
                source: lead.source,
                summary: lead.summary,
                qualification: lead.qualification,
                valueAmount: lead.valueAmount,
              }}
            />
          </Section>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-5">
          <Section title="Files">
            <Files
              leadId={lead.id}
              editable={editable}
              files={files.map((f) => ({ id: f.id, name: f.name, contentType: f.contentType, size: f.size }))}
            />
          </Section>

          <Section title="Notes">
            {editable && <CommentForm action={addComment} />}
            {comments.length > 0 ? (
              <ul className={`space-y-2.5 ${editable ? "mt-5" : ""}`}>
                {comments.map((c) => (
                  <li key={c.id} className="rounded-lg border border-[var(--crm-line)] bg-[var(--crm-surface-2)] px-3.5 py-3">
                    <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-[var(--crm-ink-soft)]">{c.body}</p>
                    <p className="mt-1.5 text-[11.5px] text-[var(--crm-ink-mute)]">
                      {(c.authorName ?? "Sistema")} · {fmtDateTime(c.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              !editable && <p className="text-[13px] text-[var(--crm-ink-mute)]">No notes yet.</p>
            )}
          </Section>

          <Section title="Source">
            <div className="flex items-start gap-2 text-[12.5px] text-[var(--crm-ink-soft)]">
              <Link2 className="mt-0.5 size-3.5 shrink-0 text-[var(--crm-ink-mute)]" strokeWidth={1.75} />
              {lead.sourceUrl ? (
                <span className="break-all">{lead.sourceUrl}</span>
              ) : (
                <span>Agregado manualmente</span>
              )}
            </div>
          </Section>

          <Section title="Activity">
            <Activity events={events} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Meta({
  icon: Icon,
  href,
  children,
}: {
  icon: typeof Mail;
  href?: string;
  children: React.ReactNode;
}) {
  const inner = (
    <>
      <Icon className="size-3.5 shrink-0 text-white/60" strokeWidth={1.75} />
      <span className="truncate">{children}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
        {inner}
      </a>
    );
  }
  return <span className="inline-flex items-center gap-1.5">{inner}</span>;
}

function Section({
  title,
  children,
  accent = false,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
  icon?: typeof Mail;
}) {
  return (
    <section className="crm-card p-5">
      <h2
        className={`mb-4 flex items-center gap-1.5 text-[14px] font-semibold tracking-tight ${
          accent ? "text-[var(--crm-wine)]" : "text-[var(--crm-ink)]"
        }`}
      >
        {Icon && <Icon className="size-3.5" strokeWidth={2} />}
        {title}
      </h2>
      {children}
    </section>
  );
}
