import React, { useEffect, useState, useContext } from "react"
import { useImmerReducer } from "use-immer"
import Page from "./Page"
import { useParams, Link, useNavigate } from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import NotFound from "./NotFound"

function EditPost() {
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const originalState = {
    title: { value: "", hasError: false, message: "" },
    body: { value: "", hasError: false, message: "" },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case "titleChange":
        draft.title.hasError = false
        draft.title.value = action.value
        return
      case "bodyChange":
        draft.body.hasError = false
        draft.body.value = action.value
        return
      case "submitRequest":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.sendCount++
        }
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
      case "titleRules": // different rules here
        if (!action.value.trim()) {
          draft.title.hasError = true
          draft.title.message = "You must provide a title"
        }
        return
      case "bodyRules": // different rules here
        if (!action.value.trim()) {
          draft.body.hasError = true
          draft.body.message = "You must provide body content"
        }
        return
      case "notFound":
        draft.notFound = true
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  function submitHandler(e) {
    e.preventDefault()
    dispatch({ type: "bodyRules", value: state.body.value })
    dispatch({ type: "titleRules", value: state.title.value })
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, {
          cancelToken: ourRequest.token
        })

        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
          if (appState.user.username != response.data.author.username) {
            appDispatch({
              type: "flashMessage",
              value: "You do not have permission to view that post."
            })
            navigate("/")
          }
        } else {
          dispatch({ type: "notFound" })
        }
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const ourRequest = Axios.CancelToken.source()

      async function setPost() {
        try {
          console.log(state)
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token
            },
            {
              cancelToken: ourRequest.token
            }
          )
          dispatch({ type: "saveRequestFinished" })
          appDispatch({ type: "flashMessage", value: "Post was updated." })
        } catch (e) {
          console.log("There was a problem or the request was cancelled.")
        }
      }
      setPost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  if (state.notFound) {
    return <NotFound />
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )
  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to post permalink
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={e =>
              dispatch({ type: "titleChange", value: e.target.value })
            }
            onBlur={e =>
              dispatch({ type: "titleRules", value: e.target.value })
            }
            defaultValue={state.title.value}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
          {state.title.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onChange={e =>
              dispatch({ type: "bodyChange", value: e.target.value })
            }
            onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            defaultValue={state.body.value}
          />
          {state.body.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button disabled={state.isSaving} className="btn btn-primary">
          Save Updates
        </button>
      </form>
    </Page>
  )
}

export default EditPost
