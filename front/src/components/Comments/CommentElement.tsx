import React, { FormEvent } from 'react';
import {
  Accordion, Button, Card, Col, Container, Form, Row,
} from 'react-bootstrap';
import { ListComment } from '../../state/reducers/list/listTypes';
import { LoggedUser } from '../../state/reducers/user/userTypes';
import { CommentReply } from '../../state/services/replyService';

const CommentElement: React.FC<{
  comment: ListComment;
  user: LoggedUser;
  createdBy: string;
  setCommentToEdit: React.Dispatch<React.SetStateAction<ListComment | undefined>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  handleSaveReply: (text: string, ev: FormEvent) => void;
  handleDeleteReply: (replyToDel: CommentReply, ev: FormEvent) => void;
  publicListView: boolean;
  reply: string;
  setReply: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  comment,
  user,
  setCommentToEdit,
  setShowDeleteModal,
  setShowEditModal,
  createdBy,
  publicListView,
  handleSaveReply,
  reply,
  setReply,
  handleDeleteReply,
}) => (
  <Container className="mb-2">
    <Accordion>
      <Card className="commentCard">
        <Row>
          <Col className="text-right align-self-end mt-3 mr-4">
            <small>
              {new Date(comment.date).toLocaleString('default', { day: 'numeric', year: 'numeric', month: 'numeric' })}
            </small>
          </Col>
        </Row>
        <hr style={{ marginLeft: '30px', width: '95%' }} />
        <Row style={{ padding: '10px 50px 5px 25px' }}>
          <Col className="text-left ml-4">
            <p style={{ textAlign: 'justify', marginBottom: '5px' }}>
              {' '}
              {comment.comment}
              {' '}
            </p>
            <p>
              -
              {' '}
              {comment.user.username}
            </p>
          </Col>
        </Row>
        <hr style={{ marginLeft: '30px', width: '95%' }} />
        <Row style={comment.user._id === user.id ? {} : { marginTop: '-30px' }}>
          <Col className="text-right align-self-end mr-4">
            <p>
              {setCommentToEdit && user && user.id === comment.user._id && publicListView// kommentin kirjoittaneen vaihtikset (edit/delete)
                ? (
                  <EditAndDelete
                    comment={comment}
                    setCommentToEdit={setCommentToEdit}
                    setShowEditModal={setShowEditModal}
                    setShowDeleteModal={setShowDeleteModal}
                  />
                ) : <br />}
              {user && user.id === createdBy && !publicListView // userpage:n optio (delete)
                  && (
                    <OnlyDelete
                      comment={comment}
                      setCommentToEdit={setCommentToEdit}
                      setShowDeleteModal={setShowDeleteModal}
                    />
                  )}
              {user

                  && (
                    <>
                      {(comment.user._id === user.id || !publicListView) && (
                        <>
                          {' '}
                          |
                          {' '}
                        </>
                      )}
                      <Accordion.Toggle
                        className="editDeleteCommentBtn"
                        as={Button}
                        eventKey={comment._id}
                        onClick={(): void => setCommentToEdit(comment)}
                      >
                        {comment.replies.length === 0 ? 'Reply' : `Replies (${comment.replies.length})`}
                      </Accordion.Toggle>
                    </>
                  )}
            </p>
          </Col>
        </Row>
        <Accordion.Collapse eventKey={comment._id}>
          <Card.Body>
            <div style={{ marginTop: '-70px' }}>
              <div style={comment.replies.length !== 0 ? { borderLeft: '1px solid #c8cbcf', marginLeft: '5%', marginBottom: '20px' } : {}}>
                <div>
                  <div style={{ height: '70px' }} />
                  {comment.replies.map((c) => (
                    <div style={{ marginBottom: '20px', marginRight: '40px' }} key={c._id}>
                      <ReplyElement
                        reply={c}
                        user={user}
                        handleDeleteReply={handleDeleteReply}
                      />
                    </div>
                  ))}
                  <div style={{ height: '20px' }} />
                </div>
              </div>
              <ReplyForm
                handleSaveReply={handleSaveReply}
                reply={reply}
                setReply={setReply}
              />
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  </Container>
);

const ReplyElement: React.FC<{
  reply: CommentReply;
  user: LoggedUser;
  handleDeleteReply: (replyToDel: CommentReply, ev: FormEvent) => void;
}> = ({ reply, user, handleDeleteReply }) => (
  <>
    <div style={{ borderBottom: '1px solid #c8cbcf', marginRight: '90%' }} />
    <div className="replyCard">
      <Container fluid>
        <Row className="justify-content-between">
          <Col className="text-left" style={{ marginLeft: '10px', marginTop: '10px' }} sm={9} xs={12}>
            <p>
              {reply.reply}
            </p>
            <p>
              -
              {' '}
              {reply.user.username}
            </p>
          </Col>
          <div className="replyDateAndOptionsColumn">
            <small>
              {new Date(reply.date).toLocaleString('default', { day: 'numeric', year: 'numeric', month: 'numeric' })}
            </small>
            <div style={{ flexDirection: 'row' }}>
              {reply.user._id === user.id
                && (
                  <>
                    {/* <button
                      type="button"
                      className="editDeleteCommentBtn"
                      style={{ alignSelf: 'flex-end' }}
                    >
                      Edit
                      {' '}
                      |
                    </button>
                    {' '} */}
                    <button
                      type="button"
                      className="editDeleteCommentBtn"
                      style={{ alignSelf: 'flex-end' }}
                      onClick={(ev: FormEvent): void => handleDeleteReply(reply, ev)}
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </div>
        </Row>
      </Container>
    </div>
  </>
);

const ReplyForm: React.FC<{
  handleSaveReply: (text: string, ev: FormEvent) => void;
  reply: string;
  setReply: React.Dispatch<React.SetStateAction<string>>;
}> = ({ handleSaveReply, reply, setReply }) => (
  <>
    <Col>
      <Form>
        <Form.Group as={Row} controlId="replyForm">
          <Form.Label column xs={1}>
            <Button
              variant="outline-secondary"
              size="sm"
              id="submitComment"
              type="submit"
              style={{ marginLeft: '5px', marginTop: '-6px', padding: '7px' }}
              onClick={(ev: FormEvent): void => handleSaveReply(reply, ev)}
            >
              Save
            </Button>
          </Form.Label>
          <Col xs={11}>
            <Form.Control
              className="form-control"
              rows={1}
              as="textarea"
              name="comment"
              type="text"
              placeholder="write a reply..."
              value={reply}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => setReply(event.target.value)}
            />
          </Col>
        </Form.Group>
      </Form>
    </Col>
  </>
);

const EditAndDelete: React.FC<{
  comment: ListComment;
  setCommentToEdit: React.Dispatch<React.SetStateAction<ListComment | undefined>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}> = ({
  comment, setCommentToEdit, setShowDeleteModal, setShowEditModal,
}) => (
  <>
    {setShowEditModal
        && (
          <>
            <button
              id="#editComment"
              className="editDeleteCommentBtn"
              type="button"
              onClick={(): void => {
                setCommentToEdit(comment);
                setShowEditModal(true);
              }}
            >
              Edit
            </button>
            {' '}
            |
            {' '}
            <OnlyDelete
              comment={comment}
              setCommentToEdit={setCommentToEdit}
              setShowDeleteModal={setShowDeleteModal}
            />
          </>
        )}
  </>
);
const OnlyDelete: React.FC<{
  comment: ListComment;
  setCommentToEdit: React.Dispatch<React.SetStateAction<ListComment | undefined>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setCommentToEdit, setShowDeleteModal, comment }) => (
  <>
    { setCommentToEdit
      && (
        <button
          type="button"
          id="deleteComment"
          className="editDeleteCommentBtn"
          onClick={(): void => {
            setCommentToEdit(comment);
            setShowDeleteModal(true);
          }}
        >
          Delete
        </button>
      )}
  </>
);

export default CommentElement;
