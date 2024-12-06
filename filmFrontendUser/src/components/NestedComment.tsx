import React from "react";
// import CommentChild from "./CommentChild";
import styles from "./nestedComments.module.css";
import Comment from "./Comment";
export default function NestedComments({ comments }:{comments:any}) {
  
  console.log('comment nestedddd',comments)
  return (
    <>
     
     
          <div className="ml-5"> 
            {comments?.length > 0 && comments.map((commentChild: any) => (
                <>
                    <div key={commentChild.id}  >
                        {/* <Comment comment={commentChild} /> */}
                    </div>
                </>

            ))}
          </div>
      
     
    </>
  );
}