import * as Yup from 'yup';
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .max(30, 'Must be at most 30 characters')
    .required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  city: Yup.string().required('Required'),
});

export default validationSchema;
