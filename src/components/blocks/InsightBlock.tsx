import { useId } from "react";

interface InsightBlockProps {
  title: string;
  body?: string;
}

export default function InsightBlock({ title, body }: InsightBlockProps) {
  const titleId = useId();

  return (
    <section className="block-card" aria-labelledby={titleId}>
      <div className="block-heading">
        <div>
          <h3 id={titleId}>{title}</h3>
          {body ? <p className="block-body">{body}</p> : null}
        </div>
        <span className="block-kind">洞察</span>
      </div>
    </section>
  );
}
