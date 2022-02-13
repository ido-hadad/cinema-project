import Form from 'react-bootstrap/Form';
import { useField, ErrorMessage } from 'formik';

export const TextInput = ({ className, label, name, validate, ...props }) => {
  const [field, meta] = useField({ name, validate });

  return (
    <Form.Group className={className}>
      <Form.Label htmlFor={name}>{label}</Form.Label>
      <Form.Control isInvalid={!!meta.error && !!meta.touched} {...field} {...props} />
      <Form.Control.Feedback type="invalid">
        <ErrorMessage name={name} />
      </Form.Control.Feedback>
    </Form.Group>
  );
};
