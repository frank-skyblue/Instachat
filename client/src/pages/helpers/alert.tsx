import { ApolloError } from "@apollo/client";
import { Alert } from "react-bootstrap";

export const displayAlert = (data: any, loading: boolean, error: ApolloError | undefined, successMsg: string) => {
  let variant = "";
  let message = "";

  if (loading) {
    variant = "primary";
    message = "Processing..."
  }
  
  if (data) {
    variant = "success";
    message = successMsg;
  }

  if (error) {
    variant = "danger";
    message = error.message;
  }

  return (<Alert show={message !== ""} variant={variant}>{message}</Alert>)
}