import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link, useHistory, useParams, useLocation,
} from 'react-router-dom';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import {
  ArrowLeftShort, Pen, Plus, List as ListIcon, Map,
} from 'react-bootstrap-icons';
import { getUserLists } from '../../state/reducers/list/listActions';
import { List, ListComment } from '../../state/reducers/list/listTypes';
import { RootStore } from '../../state/store';
import MessageModal from '../MessageModal';
import { initialList, initialLocation } from '../initials';
import CreateNewLocationModal from '../locations/CreateNewLocationModal';
import LocationList from '../locations/locationList/LocationList';
import EditListModal from './EditListModal';
import ListLocationsMap from './ListLocationsMap';
import { ToggleRecentComment } from '../Comments/CommentsContainer';
import CommentElement from '../Comments/CommentElement';
import { getUser } from '../../state/localStore';
import commentService from '../../state/services/commentService';
import DeleteCommentModal from '../Comments/DeleteCommentModal';

const ListPage: React.FC = () => {
  const loc = useLocation<{ newList: boolean } | undefined>();
  const dispatch = useDispatch();
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const [showCreateLocation, setShowCreateLocation] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [showEditList, setShowEditList] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEditLocation, setShowEditLocation] = useState(false);
  const [location, setLocation] = useState(initialLocation);
  const [list, setList] = useState(initialList);
  const [showMsgModal, setShowMsgModal] = useState<boolean>(false);
  const [info, setInfo] = useState({ header: 'Success', message: 'New List created!' });
  const [latestFirst, setLatestFirst] = useState(true);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState<ListComment | undefined>(undefined);
  const [comments, setComments] = useState<ListComment[] | undefined>(undefined);
  const user = getUser();

  const userlist = useSelector((state: RootStore) => state.lists.userLists?.filter((x: List) => {
    if (x._id === id) return x;
    return undefined;
  }));

  useEffect(() => {
    dispatch(getUserLists());
  }, [dispatch, showCreateLocation, showEditList, showEditLocation, showDelete]);

  useEffect(() => { if (loc.state) setShowMsgModal(loc.state.newList); }, [loc]);
  useEffect(() => {
    if (id) {
      commentService.getComments(id).then((x) => {
        const { data } = x;
        setComments(data);
      });
    }
  }, [id]);

  if (!userlist) return null;

  if (userlist.length === 0) {
    history.push('/userpage');
    return null;
  }

  let currentComments: ListComment[] | undefined;
  if (comments) {
    currentComments = comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (!latestFirst) currentComments = comments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  const handleDeleteComment = (commentId: string): void => {
    if (id) {
      const values = { id: commentId };
      commentService.deleteComment(id, values).then((res) => {
        if (res && comments) {
          setComments(comments.filter((x) => x._id !== res.data.id));
          setShowDeleteCommentModal(false);
          setInfo({ header: 'Success', message: 'Comment deleted!' });
          setShowMsgModal(true);
        }
      }).catch(() => {
        setShowDeleteCommentModal(false);
        setInfo({ header: 'Error', message: 'Woops, something went wrong :(((' });
        setShowMsgModal(true);
      });
    }
    setCommentToEdit(undefined);
  };

  return (
    <>
      <Container className="mt-5">
        <h4>{userlist[0].name}</h4>
        <p>
          {(userlist[0].country !== 'unknown' && userlist[0].place !== 'unknown' && `${userlist[0].place}, ${userlist[0].country}`)}
          {(userlist[0].country !== 'unknown' && userlist[0].place === 'unknown' && `${userlist[0].country}`)}
          {(userlist[0].country === 'unknown' && userlist[0].place !== 'unknown' && `${userlist[0].place}`)}
        </p>
        <p>
          {!userlist[0].locations || userlist[0].locations.length === 0
            ? 'Seems like you have not added any locations to your list yet. You can start by clicking the add location button!'
            : userlist[0].description}
        </p>
        <hr />
        <Row className="d-flex justify-content-center ">
          <Link to="/userpage" className="m-1">
            <Button size="sm" variant="outline-secondary">
              <ArrowLeftShort size={20} />
              Back to lists
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline-secondary"
            className="m-1"
            onClick={(): void => {
              setList(userlist[0]);
              setShowEditList(true);
            }}
          >
            <Pen size={18} style={{ marginRight: '5px', marginBottom: '2px' }} />
            Edit list details
          </Button>
          <Button size="sm" variant="outline-secondary" className="m-1" onClick={(): void => setShowCreateLocation(true)}>
            <Plus size={20} />
            Add location
          </Button>
          <Button size="sm" variant="outline-secondary" className="m-1" onClick={(): void => setShowMap(!showMap)}>
            {showMap
              ? (
                <>
                  <ListIcon size={18} style={{ marginRight: '5px', marginBottom: '2px' }} />
                  View locations
                </>
              )
              : (
                <>
                  <Map size={18} style={{ marginRight: '5px', marginBottom: '2px' }} />
                  View map
                </>
              )}
          </Button>
        </Row>
        <hr />
        {!showMap && (
          <LocationList
            locations={userlist[0].locations}
            location={location}
            setLocation={setLocation}
            defaultview={userlist[0].defaultview}
            showDelete={showDelete}
            setShowDelete={setShowDelete}
            showEdit={showEditLocation}
            setShowEdit={setShowEditLocation}
          />
        )}
        {showMap && (
          <ListLocationsMap
            locations={userlist[0].locations}
            defaultview={userlist[0].defaultview}
          />
        )}
        <hr />
        <Row className="ml-3 mr-2 mb-2">
          <Col className="text-left mt-1">
            <h5>{userlist[0].comments.length !== 0 ? 'Comments' : 'No comments yet!'}</h5>
          </Col>
          <Col className="text-right">
            {userlist[0].comments.length !== 0
              && <ToggleRecentComment latestFirst={latestFirst} setLatestFirst={setLatestFirst} />}

          </Col>
        </Row>
        {currentComments && currentComments.map((c) => (
          <CommentElement
            user={user}
            createdBy={userlist[0].createdBy._id}
            comment={c}
            key={c._id}
            setCommentToEdit={setCommentToEdit}
            setShowDeleteModal={setShowDeleteCommentModal}
            setShowEditModal={undefined}
          />
        ))}

      </Container>
      {userlist[0].defaultview
        ? (
          <>
            <CreateNewLocationModal
              setShow={setShowCreateLocation}
              show={showCreateLocation}
              defaultview={userlist[0].defaultview}
              userListLocations={userlist[0].locations}
            />
            <EditListModal
              show={showEditList}
              setShow={setShowEditList}
              list={list}
              setList={setList}
            />
          </>
        )
        : null}
      <MessageModal info={info} setInfo={setInfo} show={showMsgModal} setShow={setShowMsgModal} />
      <DeleteCommentModal
        showDeleteModal={showDeleteCommentModal}
        setShowDeleteModal={setShowDeleteCommentModal}
        handleDeleteComment={handleDeleteComment}
        commentToEdit={commentToEdit}
      />
    </>
  );
};

export default ListPage;
