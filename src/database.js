export const save = (key, list) => {
  localStorage.setItem(key, JSON.stringify(list));
}

export const get = key => {
  return JSON.parse(localStorage.getItem(key));
}

