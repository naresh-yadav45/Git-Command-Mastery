import { comparisons } from '../data/compare';
import { CodeBlock, Page, PageHead, PrintButton } from '../components/shared';

export default function Compare() {
  return (
    <Page>
      <PageHead title="Compare commands" intro="Side-by-side answers to the questions beginners ask most."><PrintButton /></PageHead>
      <div className="mb-8 flex flex-wrap gap-2 no-print">{comparisons.map((c) => <button key={c.id} className="chip" onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth' })}>{c.title}</button>)}</div>
      <div className="space-y-8">
        {comparisons.map((c) => (
          <section id={c.id} key={c.id} className="card scroll-mt-40 space-y-4 p-5 sm:p-6">
            <h2 className="text-xl font-extrabold">{c.title}</h2><p className="text-sm text-muted">{c.summary}</p>
            <div className="table-wrap"><table><thead><tr>{c.cols.map((h, i) => <th key={i}>{h}</th>)}</tr></thead><tbody>{c.rows.map((r, i) => <tr key={i}>{r.map((x, k) => <td key={k} className={k === 0 ? 'font-semibold text-ink' : ''}>{x}</td>)}</tr>)}</tbody></table></div>
            <div className="grid gap-4 md:grid-cols-2"><CodeBlock code={c.example} title="example" /><CodeBlock code={c.diagram} title="diagram" /></div>
          </section>
        ))}
      </div>
    </Page>
  );
}
