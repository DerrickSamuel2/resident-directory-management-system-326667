import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Residents page title", () => {
  render(<App />);
  const heading = screen.getByText(/Residents/i);
  expect(heading).toBeInTheDocument();
});
