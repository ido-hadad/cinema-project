import { useState } from 'react';

export const useField = (type = 'text', initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const onChange = (e) => setValue(e.target.value);

  const hook = { type, value, onChange, setValue };
  return Object.defineProperty(hook, 'setValue', { enumerable: false });
};
