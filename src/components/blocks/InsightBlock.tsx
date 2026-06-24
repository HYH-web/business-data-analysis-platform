interface InsightBlockProps {
  title: string;
  body?: string;
}

export default function InsightBlock({ title, body }: InsightBlockProps) {
  return (
    <section className="block-card" aria-labelledby={`${title}-title`}>
      <div className="block-heading">
        <div>
          <h3 id={`${title}-title`}>{title}</h3>
          {body ? <p className="block-body">{body}</p> : null}
        </div>
        <span className="block-kind">洞察</span>
      </div>
    </section>
  );
}
