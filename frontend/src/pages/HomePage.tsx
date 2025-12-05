const HomePage = () => (
    <div style={{ padding: '20px' }}>
        <h1>Добро пожаловать в CleanPro</h1>
        <p>Лучший клининг в вашем городе.</p>

        <h3>Последняя статья блога</h3>
        <div className="card" style={{ border: '1px solid #ccc', padding: '15px', maxWidth: '400px' }}>
            <h4>Как подготовить дом к весне?</h4>
            <p>5 простых советов от наших экспертов...</p>
            <button className="btn">Читать далее</button>
        </div>
    </div>
);

export default HomePage;
