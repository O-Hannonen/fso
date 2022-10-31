const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      find countries <input value={filter} onChange={setFilter} />
    </div>
  );
};

export default Filter;
