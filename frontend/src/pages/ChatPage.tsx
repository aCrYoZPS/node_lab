import React, { Component } from 'react';

interface ChatState {
    messages: { text: string; sender: 'user' | 'bot' }[];
    inputText: string;
    isTyping: boolean;
}

// Требование: Классовый компонент
class ChatPage extends Component<{}, ChatState> {
    constructor(props: {}) {
        super(props);
        // Требование: Использование state в классе
        this.state = {
            messages: [{ text: "Здравствуйте! Я AI-помощник CleanPro. Чем помочь?", sender: 'bot' }],
            inputText: '',
            isTyping: false
        };
    }

    componentDidMount() {
        console.log("Чат инициализирован");
    }

    componentWillUnmount() {
        console.log("Чат закрыт");
    }

    // Обработчик изменения ввода
    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ inputText: e.target.value });
    };

    // Отправка сообщения
    handleSendMessage = () => {
        const { inputText, messages } = this.state;
        if (!inputText.trim()) return;

        const newMessages = [...messages, { text: inputText, sender: 'user' as const }];

        this.setState({
            messages: newMessages,
            inputText: '',
            isTyping: true
        });

        // Имитация ответа LLM
        setTimeout(() => {
            this.setState((prevState) => ({
                messages: [...prevState.messages, { text: "Спасибо за вопрос! Оператор свяжется с вами.", sender: 'bot' }],
                isTyping: false
            }));
        }, 1500);
    };

    // Отправка по Enter
    handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') this.handleSendMessage();
    };

    render() {
        return (
            <div style={{ maxWidth: '600px', margin: '20px auto', border: '1px solid #ccc', padding: '20px' }}>
                <h2>Чат с поддержкой</h2>
                <div style={{ height: '300px', overflowY: 'auto', marginBottom: '10px', background: '#fff' }}>
                    {this.state.messages.map((msg, idx) => (
                        <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '5px' }}>
                            <span style={{ background: msg.sender === 'user' ? '#dcf8c6' : '#eee', padding: '5px 10px', borderRadius: '10px' }}>
                                {msg.text}
                            </span>
                        </div>
                    ))}
                    {this.state.isTyping && <p><i>Бот печатает...</i></p>}
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
