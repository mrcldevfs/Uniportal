
const PREFIX = "uniportal_";

// Retrieve data from localStorage
export function getData(key) {
  try {
    const data = localStorage.getItem(`${PREFIX}${key}`);

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return [];
  }
}

// Save data to localStorage
export function saveData(key, data) {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    return false;
  }
}

// Remove data from localStorage
export function removeData(key) {
  try {
    localStorage.removeItem(`${PREFIX}${key}`);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return false;
  }
}
