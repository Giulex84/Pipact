import React from 'react';
import { Agreement, ServiceCategory, ServiceProfile } from '@pipact/shared/src/models';
import './styles.css';

const mockProfiles: ServiceProfile[] = [
  {
    id: 'sp-1',
    ownerId: 'u-1',
    categories: ['SOFTWARE_DEVELOPMENT', 'DESIGN'],
    title: 'Full-stack prototypes',
    shortNote: 'Rapid implementation of small web tools.',
    preferredContact: 'contact@example.com',
    available: true,
    createdAt: new Date().toISOString(),
  },
];

const mockAgreements: Agreement[] = [
  {
    id: 'a-1',
    title: 'Landing page build',
    summary: 'Create a simple landing page with Pi-friendly messaging.',
    category: 'DESIGN',
    participants: [
      { userId: 'u-1', profileId: 'sp-1', role: 'provider' },
      { userId: 'u-2', role: 'requester' },
    ],
    status: 'DELIVERED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deliveryDate: new Date().toISOString(),
    history: [
      { at: new Date().toISOString(), by: 'u-1', action: 'CREATE' },
      { at: new Date().toISOString(), by: 'u-2', action: 'ACCEPT' },
      { at: new Date().toISOString(), by: 'u-1', action: 'DELIVER', note: 'Link shared privately.' },
    ],
  },
];

const categories: { key: ServiceCategory; label: string; desc: string }[] = [
  { key: 'DIGITAL_SERVICES', label: 'Digital Services', desc: 'Websites, support, remote collaboration.' },
  { key: 'EDUCATION', label: 'Education', desc: 'Tutoring, language practice, course support.' },
  { key: 'COACHING', label: 'Coaching', desc: 'Career, personal organization, mentorship.' },
  { key: 'DESIGN', label: 'Design', desc: 'Visual assets, UI/UX, branding guidance.' },
  { key: 'SOFTWARE_DEVELOPMENT', label: 'Software Development', desc: 'APIs, integrations, automation, testing.' },
  { key: 'CONTENT', label: 'Content', desc: 'Writing, editing, documentation.' },
  { key: 'LOCAL_HELP', label: 'Local Help', desc: 'Errands, on-site assistance when appropriate.' },
  { key: 'OTHER', label: 'Other', desc: 'Conservative use-cases that fit Pi guidelines.' },
];

function App() {
  return (
    <div className="page">
      <header>
        <h1>PiPact</h1>
        <p className="tagline">
          Human agreements for services with optional, manual Pi acknowledgements. No escrow. No guarantees.
        </p>
      </header>

      <section>
        <h2>Compliance Guardrails</h2>
        <ul className="guardrails">
          <li>Agreements represent intent only; people stay in control of each step.</li>
          <li>Payments in Pi are optional and require manual confirmation by the parties.</li>
          <li>No speculation, no yields, no automated enforcement, and no promises of income.</li>
          <li>Badges are derived from completed events, not ratings or scores.</li>
        </ul>
      </section>

      <section>
        <h2>Browse service categories</h2>
        <div className="categories">
          {categories.map((cat) => (
            <article key={cat.key} className="card">
              <h3>{cat.label}</h3>
              <p>{cat.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Featured service profiles</h2>
        <div className="grid">
          {mockProfiles.map((profile) => (
            <article key={profile.id} className="card">
              <header className="card-header">
                <h3>{profile.title}</h3>
                <span className={profile.available ? 'pill pill-green' : 'pill pill-gray'}>
                  {profile.available ? 'Available' : 'Paused'}
                </span>
              </header>
              <p className="muted">Categories: {profile.categories.join(', ')}</p>
              <p>{profile.shortNote}</p>
              <p className="muted">Preferred contact: {profile.preferredContact ?? 'Shared after accept'}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Agreement lifecycle</h2>
        <p className="muted">
          Lifecycle steps are recorded for transparency. Each transition is human-initiated, never automatic or
          enforced by the platform.
        </p>
        <div className="timeline">
          {mockAgreements.map((agreement) => (
            <article key={agreement.id} className="card">
              <header className="card-header">
                <h3>{agreement.title}</h3>
                <span className="pill pill-blue">{agreement.status}</span>
              </header>
              <p>{agreement.summary}</p>
              <ul className="history">
                {agreement.history.map((entry, idx) => (
                  <li key={idx}>
                    <strong>{entry.action}</strong> by {entry.by} · <span className="muted">{entry.at}</span>
                    {entry.note && <div className="muted">{entry.note}</div>}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Manual Pi confirmation</h2>
        <p className="muted">
          Integrate the Pi SDK to authenticate Pioneers and create optional payment intents. Confirmation remains manual
          and bilateral; PiPact does not hold funds or guarantee delivery.
        </p>
        <div className="card">
          <p>
            After a provider marks an agreement as <strong>DELIVERED</strong>, the requester may choose to open a Pi
            payment flow. Both sides manually confirm completion before setting the status to <strong>PAID</strong> or
            <strong>CLOSED_UNPAID</strong>.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
