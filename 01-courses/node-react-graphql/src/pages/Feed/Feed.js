import React, { Component, Fragment } from "react";

import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import "./Feed.css";

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: "",
    postPage: 1,
    postsLoading: true,
    editLoading: false,
  };

  componentDidMount() {
    const graphqlQuery = {
      query: ` query {
        getStatus
      }`,
    };
    fetch(process.env.REACT_APP_BACKEND_URL + "/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Failed to fetch user status.");
        }
        this.setState({ status: resData.data.getStatus });
      })
      .catch(this.catchError);

    this.loadPosts();
  }

  loadPosts = (direction) => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === "next") {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === "previous") {
      page--;
      this.setState({ postPage: page });
    }
    const graphQlQuery = {
      query: ` query FetchPosts($currentPage: Int!) {
        getPosts (currentPage:$currentPage) {
          totalItems
          posts{
            _id
            title
            content
            imageUrl
            creator { 
              name 
            }
            createdAt
          }
        }
      }`,
      variables: {
        currentPage: page,
      },
    };
    fetch(process.env.REACT_APP_BACKEND_URL + "/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphQlQuery),
    }) // 'Bearer ' is Just a convention
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Failed to fetch posts.");
        }
        this.setState({
          posts: resData.data.getPosts.posts,
          totalPosts: resData.data.getPosts.totalItems,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = (event) => {
    event.preventDefault();
    const graphqlQuery = {
      query: ` mutation updateStatus($newStatus:String!) {
        updateStatus(newStatus:$newStatus)
      }`,
      variables: {
        newStatus: this.state.status,
      },
    };
    fetch(process.env.REACT_APP_BACKEND_URL + "/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = (postId) => {
    this.setState((prevState) => {
      const loadedPost = { ...prevState.posts.find((p) => p._id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = (postData) => {
    this.setState({
      editLoading: true,
    });
    // Set up data (with image!)
    const formData = new FormData();
    formData.append("image", postData.image);
    if (this.state.editPost) {
      formData.append("oldPath", this.state.editPost.imagePath);
    }

    fetch(process.env.REACT_APP_BACKEND_URL + "/post-image", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((fileResData) => {
        let graphQlQuery;
        if (this.state.editPost) {
          graphQlQuery = {
            query: `
              mutation updatePost(
                  $postId:ID!,
                  $title:String!,
                  $content:String!, 
                  imageUrl:String!)
                  {
                    updatePost (
                      postId:postId,
                      postInput: {
                      title:$title,
                      content:$content,
                      imageUrl:$imageUrl
                      }
                    )
                    {
                      _id
                      title
                      content
                      imageUrl
                      creator {
                        name
                      }
                      createdAt
                      updatedAt
                    }   
                }`,
            variables: {
              postId: this.state.editPost._id,
              title: postData.title,
              content: postData.content,
              imageUrl: fileResData.filePath,
            },
          };
        } else {
          graphQlQuery = {
            query: `
              mutation createPost($title:String!, $content:String!, $imageUrl:String!) {
                  createPost (
                    postInput: {
                    title:$title,
                    content:$content,
                    imageUrl:$imageUrl
                    }
                  )
                  {
                    _id
                    title
                    content
                    imageUrl
                    creator {
                      name
                    }
                    createdAt
                    updatedAt
                  }      
              }`,
            variables: {
              title: postData.title,
              content: postData.content,
              imageUrl: fileResData.filePath,
            },
          };
        }

        return fetch(process.env.REACT_APP_BACKEND_URL + "/graphql", {
          method: "POST",
          body: JSON.stringify(graphQlQuery),
          headers: {
            Authorization: "Bearer " + this.props.token,
            "Content-Type": "application/json",
          },
        });
      })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors && resData.errors[0] === 422) {
          throw new Error("Creating or editing a post failed!");
        }
        if (resData.errors) {
          throw new Error("Creating or editing a post failed!");
        }
        let post;
        if (this.state.editPost) {
          post = {
            _id: resData.data.updatePost._id,
            title: resData.data.updatePost.title,
            content: resData.data.updatePost.content,
            imagePath: resData.data.updatePost.imageUrl,
            creator: resData.data.updatePost.creator,
            createdAt: resData.data.updatePost.createdAt,
          };
        } else {
          post = {
            _id: resData.data.createPost._id,
            title: resData.data.createPost.title,
            content: resData.data.createPost.content,
            imagePath: resData.data.createPost.imageUrl,
            creator: resData.data.createPost.creator,
            createdAt: resData.data.createPost.createdAt,
          };
        }
        this.setState((prevState) => {
          let updatedPosts = [...prevState.posts];
          let updatedTotalPosts = prevState.totalPosts;
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              (p) => p._id === prevState.editPost._id
            );
            updatedPosts[postIndex] = post;
          } else {
            updatedTotalPosts++;
            if (prevState.posts.length >= 2) {
              updatedPosts.pop();
            }
            updatedPosts.unshift(post);
          }
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false,
            totalPosts: updatedTotalPosts,
          };
        });
      })
      .catch((err) => {
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err,
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = (postId) => {
    this.setState({ postsLoading: true });
    const graphqlQuery = {
      query: ` mutation deletePost($postId:ID!) {
        deletePost (postId:$postId)
      }`,
      variables: { postId: postId },
    };
    fetch(process.env.REACT_APP_BACKEND_URL + "/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Deleting a post failed!");
        }
        this.loadPosts();
        // this.setState((prevState) => {
        //   const updatedPosts = prevState.posts.filter((p) => p._id !== postId);
        //   return { posts: updatedPosts, postsLoading: false };
        // });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = (error) => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: "center" }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, "previous")}
              onNext={this.loadPosts.bind(this, "next")}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map((post) => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString("en-US")}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                  onDelete={this.deletePostHandler.bind(this, post._id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
