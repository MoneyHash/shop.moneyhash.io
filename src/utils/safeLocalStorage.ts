const safeLocalStorage = {
  isLocalStorageAvailable() {
    const test = 'test';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },
  setItem(name: string, value: string) {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(name, value);
    }
  },
  getItem(name: string) {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(name);
    }
    return '';
  },
  removeItem(name: string) {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(name);
    }
  },
};

export default safeLocalStorage;
