import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useRef } from "react";
import { useGeminiAi } from "@/common/hooks/useGeminiAi";
import Button from "@/common/components/Button";
import InputCustom from "@/common/components/InputCustom";

const ChatMessage = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, input, isTyping, setInput, sendMessage } = useGeminiAi();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="chat-tabs h-screen flex flex-col justify-between">
        <div className="text-center p-4 bg-white shadow-md rounded-lg">
          <h4 className="font-bold text-xl text-black">Gemini AI Chat</h4>
        </div>
        <div className="flex flex-col p-4">
          {/* Message list */}
          <div className="flex-1 overflow-y-auto mb-4 pr-2">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <ReactMarkdown
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ))}
            {/* Scroll anchor */}
            <div ref={scrollRef} />
          </div>

          {/* Input box */}
          <div className="flex gap-2 p-2 border rounded-xl shadow-sm">
            <InputCustom
              type="text"
              className="flex-1 outline-none"
              placeholder="Can I help you with something?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              disabled={isTyping}
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={isTyping}
              variant="primary"
            >
              {isTyping ? "Typing..." : "AI Search"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
