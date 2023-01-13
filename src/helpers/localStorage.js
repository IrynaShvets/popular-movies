export default function appendValueToStorage(key, value) {
    const values = JSON.parse(localStorage.getItem(key));
    if (values === null) {
      values = [];
    }
    
if (!values.includes(value)) {
      values.push(value)
    } 
    localStorage.setItem(key, JSON.stringify(values));
    
  }
  