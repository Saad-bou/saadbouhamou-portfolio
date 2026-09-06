// ─── Single source of truth for contact channels ─────────────────────────────

export const CONTACT_EMAIL = 'bouhamousaad@gmail.com';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/saad-bouhamou-59278a3bb/';

export const GITHUB_URL = 'https://github.com/Saad-bou';

// WhatsApp: +212 649 40 99 14 (Morocco)
export const WHATSAPP_URL = 'https://wa.me/212649409914';

export interface ProjectInquiry {
  name?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
}

// Builds a pre-filled WhatsApp message; empty fields are omitted entirely.
export function buildWhatsAppUrl(inquiry: ProjectInquiry): string {
  const orOmitted = (value?: string) => (value?.trim() ? value.trim() : null);

  const lines = [
    "Hello Saad,",
    "",
    "I'd like to discuss a new project.",
    "",
  ];

  const fields: Array<[string, string | null]> = [
    ['Name / Company', orOmitted(inquiry.name)],
    ['Project Type', orOmitted(inquiry.projectType)],
    ['Budget', orOmitted(inquiry.budget)],
    ['Timeline', orOmitted(inquiry.timeline)],
  ];

  for (const [label, value] of fields) {
    if (value) lines.push(`${label}:`, value, '');
  }

  lines.push("I'd like to connect and discuss the project details.", "", "Thanks.");

  return `${WHATSAPP_URL}?text=${encodeURIComponent(lines.join('\n'))}`;
}
