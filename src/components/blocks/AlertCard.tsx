import { useId } from "react";

interface AlertCardProps {
  title: string;
  body?: string;
}

export default function AlertCard({ title, body }: AlertCardProps) {
  const titleId = useId();

  return (
    <section className="block-card" data-tone="alert" aria-labelledby={titleId}>
      <div className="block-heading">
        <div>
          <h3 id={titleId}>{title}</h3>
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
