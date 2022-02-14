import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { movieFilterChanged, selectMovieFilter } from '../filters/filtersSlice';

function MovieFilterForm(props) {
  const dispatch = useDispatch();
  const filter = useSelector(selectMovieFilter);

  const handleChange = (e) => dispatch(movieFilterChanged(e.target.value));

  return (
    // <>

    <div {...props}>
      <Form.Group as={Row} controlId="movieFilter">
        {/* <Form.Label column className="me-2" xs="auto">
          Find movie
        </Form.Label> */}

        <Col xs="auto">
          <Form.Control
            type="search"
            value={filter}
            placeholder="Search.."
            onChange={handleChange}
          ></Form.Control>
        </Col>
      </Form.Group>
    </div>
    // </>
  );
}

export default MovieFilterForm;
