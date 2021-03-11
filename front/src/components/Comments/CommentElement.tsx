import React, { FormEvent, useState } from 'react';
import {
  Accordion, Button, Card, Col, OverlayTrigger, Row, Tooltip,
} from 'react-bootstrap';
import { Star, StarFill } from 'react-bootstrap-icons';
import { ListComment } from '../../state/reducers/list/listTypes';
import { LoggedUser } from '../../state/reducers/user/userTypes';
import { CommentReply } from '../../state/services/replyService';
import ReplyElement from './ReplyElement';
import ReplyForm from './ReplyForm';

const CommentElement: React.FC<{
  comment: ListComment;
  user: LoggedUser;
  createdBy: string;
  setCommentToEdit: React.Dispatch<React.SetStateAction<ListComment | undefined>>;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  handleSaveReply: (text: string, ev: FormEvent) => void;
  handleDeleteReply: (replyToDel: CommentReply) => void;
  handleEditReply: (ev: FormEvent, replyToEdit: CommentReply) => void;
  publicListView: boolean;
  reply: string;
  setReply: React.Dispatch<React.SetStateAction<string>>;
  handleStarClick: (commentId: string) => void;
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
  handleEditReply,
  handleStarClick,
}) => {
  const [clicked, setClicked] = useState(false);
  let timer: ReturnType<typeof setTimeout>;
  const timeout = (): void => {
    timer = setTimeout(() => { setClicked(false); }, 1000);
  };
  const restartTimeout = (): void => clearTimeout(timer);

  return (
    <Accordion className="mb-2">
      <Card className="commentCard">
        <Row>
          <Col className="text-left mt-3 ml-4">
            {user
                && (
                  comment.stars.includes(user.id)
                    ? (
                      <StarCommentButtonFill
                        commentId={comment._id}
                        handleStarClick={handleStarClick}
                        stars={comment.stars.length}
                        clicked={clicked}
                        setClicked={setClicked}
                        timeout={timeout}
                        restartTimeout={restartTimeout}
                      />
                    )
                    : (
                      <StarCommentButtonUnFill
                        commentId={comment._id}
                        handleStarClick={handleStarClick}
                        stars={comment.stars.length}
                        clicked={clicked}
                        setClicked={setClicked}
                        timeout={timeout}
                        restartTimeout={restartTimeout}

                      />
                    )
                )}
            {!user && <StarCommentButtonNoUser stars={comment.stars.length} />}
          </Col>
          <Col className="text-right align-self-end mt-3 mr-4">
            <div style={{ lineHeight: '90%' }}>
              <small>
                {new Date(comment.date).toLocaleString('default', { day: 'numeric', year: 'numeric', month: 'numeric' })}
              </small>
              <br />
              <small style={{ color: 'darkgray' }}>
                {comment.edited
                  ? `(Edited ${new Date(comment.edited).toLocaleString('default', { day: 'numeric', year: 'numeric', month: 'numeric' })})`
                  : ''}
              </small>
            </div>
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
        <Row style={user && comment.user._id === user.id ? {} : { marginTop: '-30px' }}>
          <Col className="text-right align-self-end mr-4">
            <p>
              {user && user.id === comment.user._id && publicListView
                ? (
                  <EditAndDelete
                    comment={comment}
                    setCommentToEdit={setCommentToEdit}
                    setShowEditModal={setShowEditModal}
                    setShowDeleteModal={setShowDeleteModal}
                  />
                ) : <br />}
              {user && user.id === createdBy && !publicListView
                  && (
                    <OnlyDelete
                      comment={comment}
                      setCommentToEdit={setCommentToEdit}
                      setShowDeleteModal={setShowDeleteModal}
                    />
                  )}
              <>
                {(user && (comment.user._id === user.id || !publicListView)) && (
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
                  id="replyToCommentBtn"
                >
                  {comment.replies.length === 0
                    ? (user && 'Reply')
                    : `Replies (${comment.replies.length})`}
                </Accordion.Toggle>
              </>
            </p>
          </Col>
        </Row>
        <Accordion.Collapse eventKey={comment._id}>
          <Card.Body>
            <div style={{ marginTop: '-70px' }}>
              <div style={comment.replies.length !== 0 && user ? { borderLeft: '1px solid #c8cbcf', marginLeft: '5%', marginBottom: '20px' } : {}}>
                <div>
                  <div style={{ height: '70px' }} />
                  {comment.replies.map((c) => (
                    <div style={{ marginBottom: '20px', marginRight: '40px' }} key={c._id}>
                      <ReplyElement
                        reply={c}
                        user={user}
                        handleDeleteReply={handleDeleteReply}
                        handleEditReply={handleEditReply}
                        publicListView={publicListView}
                      />
                    </div>
                  ))}
                  <div style={{ height: '20px' }} />
                </div>
              </div>
              {user
                  && (
                    <ReplyForm
                      handleSaveReply={handleSaveReply}
                      reply={reply}
                      setReply={setReply}
                    />
                  )}
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

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
    {setCommentToEdit
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

const StarCommentButtonFill: React.FC<{
  handleStarClick: (commentId: string) => void;
  commentId: string;
  stars: number;
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
  timeout: () => void;
  restartTimeout: () => void;
}> = ({
  handleStarClick, commentId, stars, clicked, setClicked, timeout, restartTimeout,
}) => (
  <OverlayTrigger
    placement="auto"
    overlay={(
      <Tooltip id="editTooltip">
        Remove star from comment
      </Tooltip>
    )}
  >
    <button
      type="button"
      style={{ all: 'unset', cursor: 'pointer' }}
      onClick={(): void => {
        restartTimeout();
        handleStarClick(commentId);
        setClicked(!clicked);
        timeout();
      }}
    >
      <>
        {/* jos < 10, niin ml = 6px, mb=-28, fontSize=95%,  */}
        <p style={{
          color: 'white', marginBottom: '-29px', marginLeft: '10px', zIndex: 100, position: 'relative',
        }}
        >
          {stars}
        </p>
        <StarFill
          size={30}
          style={{ backgroundColor: 'none', zIndex: 1, position: 'relative' }}
          className={clicked ? 'starShake' : ''}
        />
      </>
    </button>
  </OverlayTrigger>
);

const StarCommentButtonUnFill: React.FC<{
  handleStarClick: (commentId: string) => void;
  commentId: string;
  stars: number;
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
  timeout: () => void;
  restartTimeout: () => void;
}> = ({
  handleStarClick, commentId, stars, clicked, setClicked, timeout, restartTimeout,
}) => (
  <OverlayTrigger
    placement="auto"
    overlay={(
      <Tooltip id="editTooltip">
        Give comment a star!
      </Tooltip>
    )}
  >
    <button
      type="button"
      style={{ all: 'unset', cursor: 'pointer' }}
      onClick={(): void => {
        restartTimeout();
        handleStarClick(commentId);
        setClicked(!clicked);
        timeout();
      }}
    >
      <>
        <p style={{
          color: 'black', marginBottom: '-29px', marginLeft: '10px', zIndex: 100, position: 'relative',
        }}
        >
          {stars}
        </p>
        <Star
          size={30}
          style={{ backgroundColor: 'none', zIndex: 1, position: 'relative' }}
          className={clicked ? 'starShake' : ''}
        />
      </>
    </button>
  </OverlayTrigger>
);
const StarCommentButtonNoUser: React.FC<{ stars: number }> = ({ stars }) => (
  <OverlayTrigger
    placement="auto"
    overlay={(
      <Tooltip id="editTooltip">
        Login or register to favorite
      </Tooltip>
    )}
  >
    <button
      type="button"
      style={{ all: 'unset', cursor: 'pointer' }}
    >
      <>
        <p style={{
          color: 'black', marginBottom: '-29px', marginLeft: '10px', zIndex: 100, position: 'relative',
        }}
        >
          {stars}
        </p>
        <Star size={30} style={{ backgroundColor: 'none', zIndex: 1, position: 'relative' }} />
      </>
    </button>
  </OverlayTrigger>
);

export default CommentElement;
