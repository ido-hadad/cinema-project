import Button from 'react-bootstrap/Button';

const LoadingButton = ({ isLoading, loadingText, text, children, ...props }) => {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? (
        <span>
          <i className="fa fa-spinner fa-spin"></i> {loadingText}
        </span>
      ) : (
        children || text
      )}
    </Button>
  );
};

export default LoadingButton;
