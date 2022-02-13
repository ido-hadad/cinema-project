import * as Yup from 'yup';
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string(),
  username: Yup.string().min(3, 'Must be at least 3 characters long').required('Required'),
  sessionTimeout: Yup.number().min(0, 'Must be a positive number or zero').required('Required'),
  permissions: Yup.array(),
});

export default validationSchema;
