import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { ListComment } from '../../../state/reducers/list/listTypes';
import { LoggedUser } from '../../../state/reducers/user/userTypes';

const CommentElement: React.FC<{
  comment: ListComment;
  user: LoggedUser;
  setCommentToEdit: React.Dispatch<React.SetStateAction<ListComment | undefined>>;
}> = ({ comment, user, setCommentToEdit }) => (

  <Container className="mb-2">
    <div className="commentCard">
      <Row>
        <Col className="text-right align-self-end mt-2 mr-3">
          <small>
            {new Date(comment.date).toLocaleString('default', { day: 'numeric', year: 'numeric', month: 'numeric' })}
          </small>
        </Col>
      </Row>
      <Row style={{ padding: '10px 50px 5px 25px' }}>
        <Col className="text-left">
          <p style={{ textAlign: 'justify', marginBottom: '5px' }}>
            &quot;
            {' '}
            {comment.comment}
            {' '}
            &quot;
            {' '}
          </p>
          <p>
            -
            {' '}
            {comment.user.username}
          </p>
        </Col>
      </Row>

      {user.username === comment.user.username
        ? (
          <Row style={{ marginTop: '-30px' }}>
            <Col className="text-right align-self-end mr-3">
              <p>
                <button className="editDeleteCommentBtn" type="button">Edit</button>
                {' '}
                /
                {' '}
                <button
                  type="button"
                  className="editDeleteCommentBtn"
                  onClick={(): void => setCommentToEdit(comment)}
                >
                  Delete
                </button>
              </p>
            </Col>
          </Row>
        ) : <Row className="mb-2" />}

    </div>
  </Container>
);

export default CommentElement;