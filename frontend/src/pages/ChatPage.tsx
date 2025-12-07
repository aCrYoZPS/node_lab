import React, { Component } from 'react';
import { OpenRouter } from "@openrouter/sdk";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const openrouter = new OpenRouter({
    apiKey: OPENROUTER_API_KEY
});

interface Message {
    content: string;
    role: 'user' | 'assistant';
    id: number;
}

interface ChatState {
    messages: Message[];
    inputText: string;
    isGenerating: boolean;
}

class ChatPage extends Component<{}, ChatState> {
    private messageIdCounter: number = 1;
    private chatContainerRef = React.createRef<HTMLDivElement>();

    constructor(props: {}) {
        super(props);
        this.state = {
            messages: [{ content: "Здравствуйте! Я AI-помощник CleanPro. Чем помочь?", role: 'assistant', id: this.messageIdCounter++ }],
            inputText: '',
            isGenerating: false,
        };
    }

    componentDidMount() {
        console.log("Чат инициализирован");
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        if (this.chatContainerRef.current) {
            this.chatContainerRef.current.scrollTop = this.chatContainerRef.current.scrollHeight;
        }
    };

    componentWillUnmount() {
        console.log("Чат закрыт");
    }

    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ inputText: e.target.value });
    };

    handleSendMessage = () => {
        const { inputText, messages, isGenerating } = this.state;
        if (isGenerating) return;
        if (!inputText.trim()) return;

        const newUserMessage: Message = { content: inputText, role: 'user', id: this.messageIdCounter++ };

        const newBotMessageId = this.messageIdCounter++;
        const newBotMessage: Message = { content: '', role: 'assistant', id: newBotMessageId };

        this.setState({
            messages: [...messages, newUserMessage, newBotMessage],
            inputText: '',
            isGenerating: true,
        }, () => {
            this.fetchStreamingResponse(newBotMessageId, newUserMessage.content);
        });
    };

    handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') this.handleSendMessage();
    };

    fetchStreamingResponse = async (botMessageId: number, userText: string) => {
        this.setState(prevState => ({
            messages: prevState.messages.map(msg =>
                msg.id === botMessageId ? { ...msg, content: "..." } : msg
            )
        }));

        try {
            const chatHistory = [
                {
                    role: 'system' as const,
                    content: "Вы являетесь прямым и лаконичным ботом поддержки для CleanPro. Не давайте объяснений, обоснований или сложных анализов. Давайте только прямой ответ или следующий шаг для пользователя. Все ответы должны состоять не более чем из двух предложений."
                },
                ...this.state.messages
                    .filter(msg => msg.id < botMessageId)
                    .map(msg => ({
                        role: msg.role as "user" | "assistant",
                        content: msg.content
                    })),
                { role: 'user' as const, content: userText }
            ];

            const stream = await openrouter.chat.send({
                model: "tngtech/deepseek-r1t2-chimera:free",
                messages: chatHistory,
                stream: true,
            });

            let fullContent = '';

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;

                if (content) {
                    fullContent += content;

                    this.setState(prevState => ({
                        messages: prevState.messages.map(msg =>
                            msg.id === botMessageId ? { ...msg, content: fullContent.trimStart() } : msg
                        )
                    }));
                }
            }

        } catch (error) {
            console.error("Ошибка при получении потока:", error);
            this.setState(prevState => ({
                messages: prevState.messages.map(msg =>
                    msg.id === botMessageId ? { ...msg, content: `Ошибка: Не удалось получить ответ.` } : msg
                )
            }));
        }
        finally {
            this.setState({ isGenerating: false });
        }
    };

    render() {
        return (
            <div style={{ maxWidth: '600px', margin: '20px auto', border: '1px solid #ccc', padding: '20px' }}>
                <h2>Чат с поддержкой</h2>
                <div
                    ref={this.chatContainerRef} // Ref attached here for auto-scroll
                    style={{ height: '300px', overflowY: 'auto', marginBottom: '10px', background: '#fff' }}
                >
                    {this.state.messages.map((msg, idx) => (
                        <div key={idx} style={{
                            textAlign: msg.role === 'user' ? 'right' : 'left',
                            // Increased margin for better separation
                            margin: '15px 5px'
                        }}>
                            <span style={{
                                background: msg.role === 'user' ? '#dcf8c6' : '#eee',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                // CSS specifically for multiline support
                                whiteSpace: 'pre-wrap',
                                display: 'inline-block',
                                textAlign: 'left', // Keep text inside bubble left-aligned for readability
                                maxWidth: '85%',   // Prevent bubble from touching the other edge
                                wordBreak: 'break-word'
                            }}>
                                {msg.content}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex-center">
                    <input
                        type="text"
                        value={this.state.inputText}
                        onChange={this.handleInputChange}
                        onKeyPress={this.handleKeyPress}
                        placeholder="Введите сообщение..."
                        style={{ padding: '10px', flex: 1 }}
                    />
                    <button className="btn" onClick={this.handleSendMessage}>Отправить</button>
                </div>
            </div>
        );
    }
}

export default ChatPage;
