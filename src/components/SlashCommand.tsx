const commands = [
  "/接入数据",
  "/生成漏斗图",
  "/生成同期群热力图",
  "/生成双轴趋势图",
  "/生成帕累托图",
  "/呼叫大模型追问",
];

interface SlashCommandProps {
  onCommand: (command: string) => void;
}

export default function SlashCommand({ onCommand }: SlashCommandProps) {
  return (
    <section className="slash-command" aria-label="快捷命令">
      {commands.map((command) => (
        <button type="button" key={command} onClick={() => onCommand(command)}>
          {command}
        </button>
      ))}
    </section>
  );
}
