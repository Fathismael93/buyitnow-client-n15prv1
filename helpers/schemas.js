import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});

export const searchSchema = yup.object().shape({
  keyword: yup.string().required().min(1),
});
