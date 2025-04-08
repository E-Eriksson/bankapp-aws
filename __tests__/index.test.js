import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import Home from "@/components/Homecontent";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe("Home component", () => {
  test("renders welcome message and buttons", () => {
    render(<Home />);
    expect(screen.getByText("Välkommen till Banken")).toBeInTheDocument();
    expect(screen.getByText("Skapa Användare")).toBeInTheDocument();
    expect(screen.getByText("Logga In")).toBeInTheDocument();
  });
});
