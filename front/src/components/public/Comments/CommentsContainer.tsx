/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import {
  Button, Col, OverlayTrigger, Row, Tooltip,
} from 'react-bootstrap';
import { ChevronDown, ChevronUp, Pen } from 'react-bootstrap-icons';
import commentService from '../../../state/services/commentService';
import { ListComment } from '../../../state/reducers/list/listTypes';
import { getUser } from '../../../state/localStore';
import CommentElement from './CommentElement';
import NewCommentModal from './NewCommentModal';
import MessageModal from '../../MessageModal';
import DeleteCommentModal from './DeleteCommentModal';

const ListComments: React.FC<{ listId: string | undefined }> = ({ listId }) => {
  const [comments, setComments] = useState<ListComment[] | undefined>(undefined);
  const [latestFirst, setLatestFirst] = useState(true);
  const [showNewCommentModal, setShowNewCommentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState<ListComment | undefined>(undefined);
  const [info, setInfo] = useState({ header: '', message: '' });
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

  const handleSubmitNewComment = (values: { comment: string }): void => {
    if (listId) {
      const x = { comment: values.comment, id: listId };
      commentService.addComment(x).then((res) => {
        if (res) {
          res.data.user = { username: user.username, _id: user.id };
          setComments(comments.concat(res.data));
          setShowNewCommentModal(false);
          setInfo({ header: 'Success', message: 'New Comment added!' });
          setShowMessageModal(true);
        }
      }).catch(() => {
        setShowNewCommentModal(false);
        setInfo({ header: 'Error', message: 'Woops, something went wrong :(((' });
        setShowMessageModal(true);
      });
    }
  };
  const handleDeleteComment = (commentId: string): void => {
    if (listId) {
      const values = { id: commentId };
      commentService.deleteComment(listId, values).then((res) => {
        if (res) {
          setComments(comments.filter((x) => x._id !== res.data.id));
          setShowDeleteModal(false);
        }
      }).catch(() => {
        setShowDeleteModal(false);
        setInfo({ header: 'Error', message: 'Woops, something went wrong :(((' });
        setShowMessageModal(true);
      });
    }
    setCommentToEdit(undefined);
  };

  let currentComments = comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (!latestFirst) currentComments = comments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  console.log('commentToEdit', commentToEdit);
  return (
    <>
      <div>
        <Row className="ml-3 mr-2 mb-2 justify-content-between">
          <Col className="text-left mt-1">
            <h5>{comments.length !== 0 ? 'Comments' : 'No comments yet!'}</h5>
          </Col>
          <Col className="text-right">
            {user
              ? (
                <Button
                  style={{ padding: '5px', paddingRight: '15px' }}
                  className="m-1"
                  variant="outline-secondary"
                  size="sm"
                  onClick={(): void => setShowNewCommentModal(true)}
                >
                  <Pen size={20} style={{ marginRight: '5px', marginBottom: '2px' }} />
                  Add comment
                </Button>
              )
              : (
                <OverlayTrigger
                  placement="auto"
                  rootClose
                  overlay={(
                    <Tooltip id="editTooltip">
                      Login or register to comment!
                    </Tooltip>
                  )}
                >
                  <div style={{ display: 'inline-block' }}>
                    <Button
                      style={{ padding: '5px', paddingRight: '15px' }}
                      className="m-1"
                      variant="outline-secondary"
                      size="sm"
                      disabled
                    >
                      <>
                        <Pen size={20} style={{ marginRight: '5px', marginBottom: '2px' }} />
                        Add comment
                      </>
                    </Button>
                  </div>
                </OverlayTrigger>

              )}
            {comments.length !== 0
              && (
                <Button
                  style={{ padding: '5px', paddingRight: '15px' }}
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
              )}
          </Col>
        </Row>
        {currentComments.map((c) => (
          <CommentElement
            user={user}
            comment={c}
            key={c._id}
            setCommentToEdit={setCommentToEdit}
            setShowDeleteModal={setShowDeleteModal}
          />
        ))}
      </div>
      <NewCommentModal
        showModal={showNewCommentModal}
        setShowModal={setShowNewCommentModal}
        onSubmit={handleSubmitNewComment}
      />
      <MessageModal
        info={info}
        setInfo={setInfo}
        show={showMessageModal}
        setShow={setShowMessageModal}
      />
      <DeleteCommentModal
        commentToEdit={commentToEdit}
        handleDeleteComment={handleDeleteComment}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      />
    </>
  );
};

export default ListComments;
