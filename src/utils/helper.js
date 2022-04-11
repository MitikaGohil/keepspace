import { format, parseISO } from 'date-fns';
/**
 * Create new contact data object
 * @param {Object} person contain API data 
 * @param {Number} index contain index number for unique ID
 * @returns {Object} Formatted API data object
 */
const newContact = (person, index) => {
    return {
      id: index,
      name: `${person.name.first} ${person.name.last}`,
      email: `${person.email}`,
      phone: `${person.phone}`,
      date: format(parseISO(person.dob.date), 'dd/mm/yyyy'),
      image: `${person.picture.thumbnail}`,
      pageImage: `${person.picture.medium}`,
      age: `${person.dob.age}`,
      gender: `${person.gender}`,
      city:`${person.location.city}`,
      country: `${person.location.country}`,
      postcode: `${person.location.postcode}`,
      street: `${person.location.street.name}`,
    };
  };
  
  /**
   * Implement for manipulate data
   * @param {Array<Object>} data Contain API Response
   * @returns {Array<Object>} Formatted API data 
   */
  export const formatData = (data) => {
    return data.map((d, index) => {
      return {
        ...newContact(d, index+1),
      };
    });
  }

const desc = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export const stableSort = (array, cmp) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

  
export const getSorting = (order, orderBy) => {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}