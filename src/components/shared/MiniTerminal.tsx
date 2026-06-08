import { useState } from 'react';

export default function MiniTerminal() {
  const [input, setInput] = useState('');
  const [visible, setVisible] = useState(false);

  return (
    <div className="text-center py-16">
      <div
        className="inline-block bg-surface border border-border rounded-lg px-5 py-3 font-mono text-sm cursor-text"
        onClick={() => setVisible(!visible)}
      >
        <span className="text-frontend">~ $ </span>
        {visible ? (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-text-secondary w-40"
            placeholder="type 'help'..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setInput('');
              }
            }}
          />
        ) : (
          <span className="text-text-muted">点击输入...</span>
        )}
        <span className="text-frontend animate-[blink_1s_infinite]">█</span>
      </div>
      <p className="text-border text-xs mt-5">基于 React · Vite · Tailwind 构建 · 部署于 Netlify</p>
    </div>
  );
}
