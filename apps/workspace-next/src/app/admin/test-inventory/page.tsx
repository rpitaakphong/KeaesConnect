import { PortalPage } from "@/components/app-shell/portal-page";
import { getAllTestDefinitions } from "@/features/tests/content/registry";

export default function TestInventoryPage() {
  const tests = getAllTestDefinitions();
  const totalPoints = tests.reduce((sum, test) => sum + test.totalPoints, 0);

  return (
    <PortalPage shellClassName="admin-shell">
      <section className="dashboard-heading">
        <div>
          <p className="eyebrow">Next.js test inventory</p>
          <h1>Registered test coverage</h1>
          <p className="hero-copy">Every row is loaded from the shared Next.js test registry used by student test routes.</p>
        </div>
        <span className="badge">{tests.length} tests · {totalPoints} points</span>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Catalog audit</p>
            <h2>Registered tests</h2>
          </div>
          <a className="button ghost-button" href="/admin/tests">Back to admin</a>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Title</th>
                <th>Subject</th>
                <th>Level</th>
                <th>Points</th>
                <th>Sections</th>
                <th>Questions</th>
                <th>Status</th>
                <th>Route</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td><code>{test.id}</code></td>
                  <td><strong>{test.title}</strong></td>
                  <td>{test.subject}</td>
                  <td>{test.level}</td>
                  <td>{test.totalPoints}</td>
                  <td>{test.sections.length}</td>
                  <td>{test.sections.reduce((sum, section) => sum + section.questions.length, 0)}</td>
                  <td><span className="badge">{test.status}</span></td>
                  <td>
                    <a href={`/tests/${test.id}/start?assignment=demo`}>Start</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PortalPage>
  );
}
