import React, { FormEvent } from 'react';
import {
  Button, Col, Form,
} from 'react-bootstrap';

const ReplyForm: React.FC<{
  handleSaveReply: (text: string, ev: FormEvent) => void;
  reply: string;
  setReply: React.Dispatch<React.SetStateAction<string>>;
}> = ({ handleSaveReply, reply, setReply }) => (
  <>
    <Col style={{ marginTop: '-25px' }}>
      <Form>
        <Form.Group controlId="replyForm">
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
          <Form.Label column xs={1}>
            <Button
              size="sm"
              variant="outline-secondary"
              id="submitReply"
              type="submit"
              onClick={(ev: FormEvent): void => handleSaveReply(reply, ev)}
            >
              Save
            </Button>
          </Form.Label>
        </Form.Group>
      </Form>
    </Col>
  </>
);

export default ReplyForm;
