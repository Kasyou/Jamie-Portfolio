import { useState } from 'react';

export default function MiniTerminal() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [visible, setVisible] = useState(false);

  const handleCommand = (cmd: string) => {
    switch (cmd.toLowerCase().trim()) {
      case 'help': setOutput('Available: help | contact | github | projects | about | clear'); break;
      case 'github': setOutput('→ https://github.com/Kasyou'); break;
      case 'contact': setOutput('Email: via GitHub  |  Location: Guangzhou'); break;
      case 'projects': setOutput('16 projects across 5 domains. Click "Projects" in nav.'); break;
      case 'about': setOutput('Full-stack developer & vibecoder. 1yr of Claude Code collaboration. From React to STM32 firmware.'); break;
      case 'clear': setOutput(''); break;
      default: setOutput(`Command not found: ${cmd}. Type "help" for options.`);
    }
    setInput('');
  };

  return (
    <div className="text-center py-10">
      <div className="inline-block bg-surface border border-border rounded-lg overflow-hidden max-w-md w-full text-left">
        <div className="bg-elevated px-4 py-1.5 flex items-center gap-2 border-b border-border">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"/><div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"/><div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"/>
          <span className="text-[10px] text-text-muted ml-3">terminal@jamie</span>
        </div>
        {visible && output && <div className="px-4 py-3 font-mono text-xs text-text-secondary whitespace-pre-wrap">{output}</div>}
        <div className="px-4 py-3 font-mono text-sm cursor-text flex items-center" onClick={()=>setVisible(true)}>
          <span className="text-frontend font-medium">~ $ </span>
          {visible ? <input type="text" value={input} onChange={e=>setInput(e.target.value)} className="bg-transparent border-none outline-none text-text-secondary flex-1 ml-2" placeholder="type help" autoFocus onKeyDown={e=>{if(e.key==='Enter')handleCommand(input);if(e.key==='Escape'){setVisible(false);setOutput('');}}}/> : <span className="text-text-muted text-xs ml-2">点撃输入...</span>}
          <span className="text-frontend animate-[blink_1s_infinite] ml-1">▌</span>
        </div>
      </div>
      <p className="text-border text-[10px] mt-4">React · Vite · Tailwind · Netlify</p>
    </div>
  );
}
