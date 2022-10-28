const Header = (props) => <h1>{props.course}</h1>;

const Content = (props) => (
  <div>
    {props.parts.map((p) => (
      <Part part={p} />
    ))}
  </div>
);
const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
);
const Total = (props) => {
  let total = 0;
  props.parts.forEach((p) => (total += p.exercises));
  return <p>Number of excercises {total}</p>;
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />

      <Total parts={course.parts} />
    </div>
  );
};

export default App;
