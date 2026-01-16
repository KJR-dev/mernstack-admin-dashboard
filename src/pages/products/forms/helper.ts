import type { CreateProductData, ImageField } from '../../../types';

export const makeFormData = (data: CreateProductData) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'image') {
      formData.append(key, (value as ImageField).file);
    } else if (key === 'priceConfiguration' || key === 'attributes') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });
  return formData;
};

export const capitalizeFirst = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};
