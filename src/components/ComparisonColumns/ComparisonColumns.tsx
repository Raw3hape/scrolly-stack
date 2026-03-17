/**
 * ComparisonColumns — Foundation Projects
 *
 * Two-column comparison layout ("The Broken System" vs "The Better Way").
 * Server component — no client-side JS needed.
 */

import './ComparisonColumns.css';

interface ColumnData {
  title: string;
  body: string;
}

interface ComparisonColumnsProps {
  left: ColumnData;
  right: ColumnData;
}

/** Side-by-side comparison with visual distinction between negative/positive */
export default function ComparisonColumns({ left, right }: ComparisonColumnsProps) {
  return (
    <div className="comparison">
      <article className="comparison__column comparison__column--negative">
        <h3 className="comparison__title">{left.title}</h3>
        <p className="comparison__body">{left.body}</p>
      </article>
      <article className="comparison__column comparison__column--positive">
        <h3 className="comparison__title">{right.title}</h3>
        <p className="comparison__body">{right.body}</p>
      </article>
    </div>
  );
}
