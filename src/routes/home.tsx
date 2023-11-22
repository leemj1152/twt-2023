import styled from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import Timeline, { ITweet } from "../components/timeline";
import { useState } from "react";
import UpdateTweetForm from "../components/Update-tweet-form";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function Home() {
  const [tweetState, setTweetState] = useState("post");
  return (
    <Wrapper>
      {tweetState === "post" ? <PostTweetForm /> : <UpdateTweetForm />}
      <Timeline
        onEditClick={function (tweet: ITweet): void {
          setTweetState("update");
          console.log("업데이트");
        }}
      />
    </Wrapper>
  );
}
