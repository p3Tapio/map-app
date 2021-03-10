import React, { FormEvent, useState } from 'react';
import {
  Button, Col, Container, Form, Row,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { LoggedUser } from '../../state/reducers/user/userTypes';
import { CommentReply } from '../../state/services/replyService';
import { RootStore } from '../../state/store';

const ReplyElement: React.FC<{
  reply: CommentReply;
  user: LoggedUser;
  handleDeleteReply: (replyToDel: CommentReply) => void;
  handleEditReply: (ev: FormEvent, replyToEdit: CommentReply) => void;
  publicListView: boolean;
}> = ({
  reply, user, handleDeleteReply, handleEditReply, publicListView,
}) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [replyToEdit, setReplyToEdit] = useState(reply);
  const commentedList = useSelector((state: RootStore) => state.lists.userLists?.find((l) => l._id === reply.listId));

  return (
    <>
      <div style={user ? { borderBottom: '1px solid #c8cbcf', marginRight: '90%' } : {}} />
      <div className="replyCard">
        <Container fluid>
          <Row className="justify-content-between">
            <Col className="text-left" style={{ marginLeft: '10px', marginTop: '10px' }} sm={9} xs={12}>
              {showEditForm
                ? (
                  <EditReplyForm
                    replyToEdit={replyToEdit}
                    setReplyToEdit={setReplyToEdit}
                    handleEditReply={handleEditReply}
                    setShowEditForm={setShowEditForm}
                  />
                )
                : (
                  <>
                    <p>
                      {reply.reply}
                    </p>
                    <p>
                      -
                      {' '}
                      {reply.user.username}
                    </p>
                  </>
                )}
            </Col>
            <div className="replyDateAndOptionsColumn">
              <div style={{ lineHeight: '90%' }}>
                <small>
                  {new Date(reply.date).toLocaleString('default', { day: 'numeric', year: 'numeric', month: 'numeric' })}
                </small>
                <br />
                <small style={{ color: 'darkgray' }}>
                  {reply.edited
                    ? `(Edited ${new Date(reply.edited).toLocaleString('default', { day: 'numeric', year: 'numeric', month: 'numeric' })})`
                    : ''}
                </small>
              </div>
              <div style={{ flexDirection: 'row' }}>
                {(user && reply.user._id === user.id)
                    && (
                      <>
                        <button
                          type="button"
                          className="editDeleteCommentBtn"
                          id="editReply"
                          style={{ alignSelf: 'flex-end' }}
                          onClick={(): void => {
                            setShowEditForm(!showEditForm);
                            setReplyToEdit(reply);
                          }}
                        >
                          Edit
                          {' '}
                          |
                        </button>
                        {' '}
                      </>
                    )}
                {(user && reply.user._id === user.id) || (user && commentedList?.createdBy._id === user.id && !publicListView)
                  ? (
                    <button
                      type="button"
                      className="editDeleteCommentBtn"
                      id="deleteReply"
                      style={{ alignSelf: 'flex-end' }}
                      onClick={(): void => handleDeleteReply(reply)}
                    >
                      Delete
                    </button>
                  ) : null}
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

const EditReplyForm: React.FC<{
  replyToEdit: CommentReply;
  setReplyToEdit: React.Dispatch<React.SetStateAction<CommentReply>>;
  handleEditReply: (ev: FormEvent, replyToEdit: CommentReply) => void;
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  replyToEdit, setReplyToEdit, handleEditReply, setShowEditForm,
}) => (
  <>
    <Col sm xs={12}>
      <Form style={{ marginLeft: '-50px', flex: 1 }}>
        <Form.Group>
          <Col style={{ padding: 0, marginLeft: '15px' }} sm xs={12}>
            <Form.Control
              className="form-control"
              rows={2}
              as="textarea"
              name="replyEditField"
              id="replyEditField"
              type="text"
              value={replyToEdit.reply}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => {
                setReplyToEdit({ ...replyToEdit, reply: ev.target.value });
              }}
            />
          </Col>
          <Form.Label column>
            <Button
              variant="outline-secondary"
              size="sm"
              id="submitReply"
              type="submit"
              onClick={(ev: FormEvent): void => {
                handleEditReply(ev, replyToEdit);
                setShowEditForm(false);
              }}
            >
              Save
            </Button>
          </Form.Label>
        </Form.Group>
      </Form>
    </Col>
  </>
);

export default ReplyElement;
