import * as Yup from 'yup';
const validationSchema = Yup.object().shape({
  name: Yup.string().max(120, 'Must be at most 120 characters').required('Required'),
  genres: Yup.string().required('Required'),
  image: Yup.string().url('Invalid url').required('Required'),
  premiered: Yup.date().required('Required'),
});

export default validationSchema;
