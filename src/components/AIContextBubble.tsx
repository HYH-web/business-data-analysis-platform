import { Send } from "lucide-react";

interface AIContextBubbleProps {
  visible: boolean;
  onSubmit: () => void;
}

export default function AIContextBubble({ visible, onSubmit }: AIContextBubbleProps) {
  if (!visible) {
    return null;
  }

  return (
    <aside className="ai-bubble" aria-label="AI BP 追问">
      <div className="ai-bubble-copy">
        <strong>AI BP 追问</strong>
        <p>把退货率高的时间段，用户画像拉出来看下</p>
      </div>
      <button type="button" className="ai-bubble-button" onClick={onSubmit}>
        <Send size={16} aria-hidden="true" />
        <span>发送追问</span>
      </button>
    </aside>
  );
}
