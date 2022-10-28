import { useState } from "react";

const RatingButton = ({ text, onClick }) => (
  <button onClick={onClick}>{text}</button>
);

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const total = () => good + neutral + bad;
  if (total() === 0) {
    return <p>No feedback given</p>;
  }
  const average = () => {
    let output = (good * 1 + bad * -1) / (good + bad);

    return isNaN(output) ? 0 : output;
  };
  const positivePercentage = () => (good / total()) * 100;

  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticsLine text="good" value={good} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="all" value={total()} />
          <StatisticsLine text="average" value={average()} />
          <StatisticsLine text="positive" value={positivePercentage() + "%"} />
        </tbody>
      </table>
    </>
  );
};

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <RatingButton text="good" onClick={() => setGood(good + 1)} />
      <RatingButton text="neutral" onClick={() => setNeutral(neutral + 1)} />
      <RatingButton text="bad" onClick={() => setBad(bad + 1)} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
