import React from 'react';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMovie } from './moviesSlice';
import { selectMovieSubsById } from '../subscriptions/subscriptionsSlice';
import { selectMemberById } from '../members/membersSlice';
import Protected from '../../app/Protected';
import { Permissions } from '../../app/permissions';
import { Placeholder } from 'react-bootstrap';

const MovieItem = ({ movie }) => {
  const dispatch = useDispatch();
  const { id, name, genres, image, premiered } = movie;

  const renderedGenres = genres.map((genre) => <Genre key={genre} name={genre} />);
  return (
    <div className="movie-item border mb-2">
      <div className="d-flex">
        <Image src={image} style={{ width: '210px' }} />
        <div className="d-flex flex-column p-2">
          <h5>{name}</h5>
          <div>{renderedGenres}</div>
          <div>Premiered: {new Date(premiered).toLocaleDateString()}</div>
          <MovieSubs movieId={id} />
          <div className="d-flex mt-2">
            <Protected permission={Permissions.UpdateMovie} hide>
              <Button className="me-2" as={Link} to={`/movies/edit/${id}`} size="sm">
                Edit
              </Button>
            </Protected>
            <Protected permission={Permissions.DeleteMovie} hide>
              <Button onClick={() => dispatch(deleteMovie(id))} size="sm">
                Delete
              </Button>
            </Protected>
          </div>
        </div>
      </div>
    </div>
  );
};

const Genre = ({ name }) => {
  return (
    <Badge className="me-1" pill bg="dark">
      {name}
    </Badge>
  );
};

const MovieSubs = ({ movieId }) => {
  const movieSubs = useSelector((state) => selectMovieSubsById(state, movieId));

  const renderedSubs = (movieSubs ?? []).map((sub) => (
    <li key={sub.memberId}>
      <MemberName memberId={sub.memberId} /> - {new Date(sub.date).toLocaleDateString()}{' '}
    </li>
  ));

  if (!renderedSubs.length) return <div>No subscribers</div>;
  return (
    <div>
      Subscribers:
      <ul>{renderedSubs}</ul>
    </div>
  );
};

const MemberName = ({ memberId }) => {
  const member = useSelector((state) => selectMemberById(state, memberId));
  return (
    <span>
      {member ? (
        <Link to={`/subs/${memberId}`}>{member.name}</Link>
      ) : (
        <Placeholder style={{ width: '80px' }} />
      )}
    </span>
  );
};

export default React.memo(MovieItem);
