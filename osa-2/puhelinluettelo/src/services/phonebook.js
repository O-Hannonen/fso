import axios from "axios";
const baseUrl = "/api/persons";

const getAllEntries = () => {
  return axios.get(baseUrl).then(({ data }) => data);
};

const createEntry = (person) => {
  return axios.post(baseUrl, person).then(({ data }) => data);
};

const deleteEntry = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(({ data }) => data);
};

const editEntry = (id, person) => {
  return axios.put(`${baseUrl}/${id}`, person).then(({ data }) => data);
};

export default { getAllEntries, createEntry, deleteEntry, editEntry };
