const Header = ({ name }) => <h1>{name}</h1>;

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Total = ({ exercises }) => (
  <strong>total of {exercises} exercises</strong>
);

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      {course.parts.map((part) => (
        <Part
          key={course.id.toString() + "-" + part.id.toString()}
          part={part}
        />
      ))}

      <Total exercises={course.parts.reduce((_, p2) => p2.exercises, 0)} />
    </div>
  );
};

export default Course;
