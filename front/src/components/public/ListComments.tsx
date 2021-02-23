import React, { useEffect, useState } from 'react';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import commentService from '../../state/services/commentService';
import { ListComment } from '../../state/reducers/list/listTypes';
import { getUser } from '../../state/localStore';
import { LoggedUser } from '../../state/reducers/user/userTypes';

const ListComments: React.FC<{ listId: string | undefined }> = ({ listId }) => {
  const [comments, setComments] = useState<ListComment[] | undefined>(undefined);
  const [latestFirst, setLatestFirst] = useState(true);
  const user = getUser();

  useEffect(() => {
    if (listId) {
      commentService.getComments(listId).then((x) => {
        const { data } = x;
        setComments(data);
      });
    }
  }, [listId]);

  if (!comments) return null;

  let currentComments = comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (!latestFirst) currentComments = comments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <Row className="ml-3 mr-2 mb-2 justify-content-between">
        <Col className="text-left mt-1">
          <h5>{comments.length !== 0 ? 'Comments' : 'No comments yet!'}</h5>
        </Col>
        <Col className="text-right">
          <Button
            style={{ padding: '7px', paddingRight: '15px' }}
            variant="outline-secondary"
            size="sm"
            onClick={(): void => setLatestFirst(!latestFirst)}
          >
            {latestFirst ? (
              <>
                <ChevronDown size={20} style={{ marginRight: '5px', marginBottom: '2px' }} />
                Show oldest
              </>
            ) : (
              <>
                <ChevronUp size={20} style={{ marginRight: '5px', marginBottom: '2px' }} />
                Show latest
              </>
            )}
          </Button>
        </Col>
      </Row>
      {currentComments.map((c) => (
        <CommentElement
          user={user}
          comment={c}
          key={c._id}
        />
      ))}
    </div>
  );
};

const CommentElement: React.FC<{ comment: ListComment; user: LoggedUser }> = ({ comment, user }) => (

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
            {' '}
            {comment.comment}
            {' '}
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
              <p>Edit / Delete</p>
            </Col>
          </Row>
        ) : <Row className="mb-2" />}

    </div>
  </Container>

);
export default ListComments;
