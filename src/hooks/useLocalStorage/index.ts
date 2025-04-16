type GetterParams = {
    key: string;
  };
  
  type SetterParams = {
    key: string;
    setValue: unknown;
  };
  
  type DeletterParams = {
    key: string;
  };
  
  const getter = ({ key }: GetterParams): unknown[] => {
    // localStorage'dan ma'lumot olish
    const value = localStorage.getItem(key);
    // Agar ma'lumot bo'lsa, uni JSON.parse yordamida parse qilib qaytaramiz, aks holda bo'sh array qaytaramiz
    return value ? JSON.parse(value) : [];
  };
  
  const setter = ({ key, setValue }: SetterParams): void => {
    // setValue ni JSON.stringify yordamida saqlaymiz
    localStorage.setItem(key, JSON.stringify(setValue));
  };
  
  const deletter = ({ key }: DeletterParams): void => {
    // localStorage'dan kalitni o'chiramiz
    localStorage.removeItem(key);
  };
  
  export { getter, setter, deletter };
  