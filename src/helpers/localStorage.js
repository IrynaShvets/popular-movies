export default function appendValueToStorage(key, value) {
  try {
    let values = JSON.parse(localStorage.getItem(key));
    if (values === null) {
      values = [];
    }

    if (!values.includes(value)){
        values.push(value);
        localStorage.setItem(key, JSON.stringify(values));
        alert("Ваш фільм успішно додано.")
      }

    // if (values.includes(value)) {
    //   alert("Вже є" + value)
      
    // } else {
    //   values.push(value);
    //   localStorage.setItem(key, JSON.stringify(values));
    // }
  } catch (error) {
    console.log(error)
  }
    
}
