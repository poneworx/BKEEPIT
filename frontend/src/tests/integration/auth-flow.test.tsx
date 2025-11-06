import "react-native";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import App from "../../App";

describe("Auth flow", () => {
  it("renders login and navigates to dashboard after mock login", async () => {
    const { getByTestId, queryByText } = render(<App />);
    const email = getByTestId("login-email");
    const password = getByTestId("login-password");
    const submit = getByTestId("login-submit");

    fireEvent.changeText(email, "test@example.com");
    fireEvent.changeText(password, "Secret123!");
    fireEvent.press(submit);

    await waitFor(() => expect(queryByText(/dashboard/i)).toBeTruthy());
  });
});