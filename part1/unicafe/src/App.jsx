import { useState } from 'react'

const Button = (props) => {
    return (
        <button onClick={props.handleClick}>
            {props.text}
        </button>
    )
}

const StatisticLine = (props) => {
    const {text, value} = props;

    return (
        <>
            <td>{text}</td>
            <td>{value}</td>
        </>
    )
}

const Statistics = (props) => {
    const { good, neutral, bad } = props
    if (good === 0 && neutral === 0 && bad === 0) {
        return (
            <>
                <h1>statistics</h1>
                <div>No feedback given</div>
            </>
        )
    }

    return (
        <>
            <h1>statistics</h1>
            <table>
                <tbody>
                    <tr>
                        <StatisticLine text="good" value={good} />
                    </tr>
                    <tr>
                        <StatisticLine text="neutral" value={neutral} />
                    </tr>
                    <tr>
                        <StatisticLine text="bad" value={bad} />
                    </tr>
                    <tr>
                        <StatisticLine text="all" value={good + neutral + bad} />
                    </tr>
                    <tr>
                        <StatisticLine text="average" value={(good - bad) / (good + neutral + bad)} />
                    </tr>
                    <tr>
                        <StatisticLine text="positive" value={((good) / (good + neutral + bad)) * 100 + " %"} />
                    </tr>
                </tbody>
            </table>
        </>
    )
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <>
            <h1>give feedback</h1>
            <Button handleClick={() => setGood(good + 1)} text="good" />
            <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
            <Button handleClick={() => setBad(bad + 1)} text="bad" />
            <Statistics good={good} neutral={neutral} bad={bad} />
        </>
    )
}

export default App