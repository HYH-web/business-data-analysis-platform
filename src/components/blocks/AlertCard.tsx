interface AlertCardProps {
  title: string;
  body?: string;
}

export default function AlertCard({ title, body }: AlertCardProps) {
  return (
    <section className="block-card" data-tone="alert" aria-labelledby={`${title}-title`}>
      <div className="block-heading">
        <div>
          <h3 id={`${title}-title`}>{title}</h3>
          {body ? <p className="block-body">{body}</p> : null}
        </div>
        <span className="block-kind">高优先级</span>
      </div>
      <div className="health-alert">
        <strong>需要处理</strong> 先确认异常窗口与转化链路，再继续复盘。
      </div>
    </section>
  );
}
