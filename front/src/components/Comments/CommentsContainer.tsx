import React, { FormEvent, useEffect, useState } from 'react';
import {
  Button, Col, OverlayTrigger, Row, Tooltip,
} from 'react-bootstrap';
import { ChevronDown, ChevronUp, Pen } from 'react-bootstrap-icons';
import commentService from '../../state/services/commentService';
import replyService, { CommentReply } from '../../state/services/replyService';
import { ListComment } from '../../state/reducers/list/listTypes';
import { getUser } from '../../state/localStore';
import CommentElement from './CommentElement';
import NewCommentModal from './NewCommentModal';
import MessageModal from '../MessageModal';
import DeleteCommentModal from './DeleteCommentModal';
import EditCommentModal from './EditCommentModal';

const ListComments: React.FC<{
  listId: string | undefined; createdBy: string; publicListView: boolean;
}> = ({ listId, createdBy, publicListView }) => {
  const [comments, setComments] = useState<ListComment[] | undefined>(undefined);
  const [latestFirst, setLatestFirst] = useState(true);
  const [showNewCommentModal, setShowNewCommentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState<ListComment | undefined>(undefined);
  const [reply, setReply] = useState('');
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
  const handleUpdateComment = (values: { comment: string }): void => {
    if (commentToEdit && listId) {
      const x = {
        comment: values.comment, list: listId, user: user.id, date: commentToEdit.date,
      };
      commentService.updateComment(commentToEdit._id, x).then((res) => {
        if (res) {
          res.data.user = { username: user.username, _id: user.id };
          setComments(comments.map((c) => (c._id === res.data._id ? res.data : c)));
          setShowEditModal(false);
          setInfo({ header: 'Success', message: 'Comment updated!' });
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
        if (res && res.data.id) {
          setComments(comments.filter((x) => x._id !== res.data.id));
          setShowDeleteModal(false);
          setInfo({ header: 'Success', message: 'Comment deleted!' });
          setShowMessageModal(true);
        }
      }).catch(() => {
        setShowDeleteModal(false);
        setInfo({ header: 'Error', message: 'Woops, something went wrong :(((' });
        setShowMessageModal(true);
      });
    }
    setCommentToEdit(undefined);
  };
  const handleSaveReply = (text: string, ev: FormEvent): void => {
    ev.preventDefault();
    if (commentToEdit && commentToEdit._id && text !== '') {
      const values = { reply: text, commentId: commentToEdit._id, listId: commentToEdit.list };
      replyService.addReply(values).then((res) => {
        if (res && res.data) {
          const updateComment = comments.find((x) => x._id === res.data.commentId);
          if (updateComment) {
            updateComment.replies = updateComment.replies.concat(res.data);
            setComments(comments.map((c) => (c._id === updateComment._id ? updateComment : c)));
          }
        }
      }).catch(() => {
        setInfo({ header: 'Error', message: 'Woops, something went wrong :(((' });
        setShowMessageModal(true);
      });
      setReply('');
    }
  };
  const handleEditReply = (ev: FormEvent, replyToEdit: CommentReply): void => {
    ev.preventDefault();
    replyService.updateReply(replyToEdit).then((res) => {
      if (res && res.data) {
        const updateComment = comments.find((x) => x._id === res.data.commentId);
        if (updateComment) {
          updateComment.replies = updateComment.replies.map((r) => (r._id === res.data._id ? res.data : r));
          setComments(comments.map((c) => (c._id === updateComment._id ? updateComment : c)));
        }
      }
    }).catch(() => {
      setInfo({ header: 'Error', message: 'Woops, something went wrong :(((' });
      setShowMessageModal(true);
    });
  };
  const handleDeleteReply = (replyToDel: CommentReply): void => {
    const values = { commentId: replyToDel.commentId, replyId: replyToDel._id };
    replyService.deleteReply(values).then((res) => {
      if (res && res.data) {
        const updateComment = comments.find((x) => x._id === replyToDel.commentId);
        if (updateComment) {
          updateComment.replies = updateComment.replies.filter((x) => x._id !== res.data.replyId);
          setComments(comments.map((c) => (c._id === updateComment._id ? updateComment : c)));
        }
      }// else?
    }).catch(() => {
      setInfo({ header: 'Error', message: 'Woops, something went wrong :(((' });
      setShowMessageModal(true);
    });
  };

  let currentComments = comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (!latestFirst) currentComments = comments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
      <div>
        <Row className="ml-3 mr-2 mb-2 justify-content-between">
          <Col className="text-left mt-1">
            <h5>{comments.length !== 0 ? 'Comments' : 'No comments yet!'}</h5>
          </Col>
          <Col className="text-right">
            {publicListView
              && (
                <>
                  {user
                    ? (
                      <Button
                        id="addComment"
                        style={{ padding: '5px', paddingRight: '15px', whiteSpace: 'nowrap' }}
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
                            id="addComment"
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
                </>
              )}
            {comments.length !== 0
              && <ToggleRecentComment latestFirst={latestFirst} setLatestFirst={setLatestFirst} />}
          </Col>
        </Row>
        {currentComments.map((c) => (
          <CommentElement
            user={user}
            comment={c}
            key={c._id}
            setCommentToEdit={setCommentToEdit}
            setShowDeleteModal={setShowDeleteModal}
            setShowEditModal={setShowEditModal}
            createdBy={createdBy}
            publicListView={publicListView}
            handleSaveReply={handleSaveReply}
            reply={reply}
            setReply={setReply}
            handleDeleteReply={handleDeleteReply}
            handleEditReply={handleEditReply}
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
      <EditCommentModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        handleUpdateComment={handleUpdateComment}
        commentToEdit={commentToEdit}
      />
    </>
  );
};

export const ToggleRecentComment: React.FC<{
  latestFirst: boolean;
  setLatestFirst: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ latestFirst, setLatestFirst }) => (
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
);

export default ListComments;
