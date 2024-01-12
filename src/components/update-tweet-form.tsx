import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ITweet } from "./timeline";

interface UpdateTweetFormProps {
  tweet: ITweet | null;
  onUpdateComplete: () => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  transition: all 0.3s;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9df0;
  }
`;
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9df0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9df0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  &:hover,
  &:active {
    background-color: #1d9df0;
    color: white;
  }
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
  background-color: #1d9df0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  transition: all 0.3s;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

export default function UpdateTweetForm({
  tweet,
  onUpdateComplete,
}: UpdateTweetFormProps) {
  const [isLoading, setLoading] = useState(false);
  const [updatedTweet, setUpdatedTweet] = useState(tweet?.tweet || "");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setUpdatedTweet(tweet?.tweet || "");
  }, [tweet]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || updatedTweet === "" || updatedTweet.length > 180)
      return;

    try {
      setLoading(true);
      const tweetDoc = doc(db, "tweets", tweet?.id || "");
      await updateDoc(tweetDoc, {
        tweet: updatedTweet,
      });

      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${tweet?.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(tweetDoc, {
          photo: url,
        });
      }
      setUpdatedTweet("");
      setFile(null);
      onUpdateComplete();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={200}
        onChange={onChange}
        value={updatedTweet}
        placeholder="What is happening"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added" : "Update photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Update Tweet"}
      />
    </Form>
  );
}