import { DataMap } from "../types";
import { sortBySessionStart } from "./sort-by-session-start";

describe("sortBySessionStart", () => {
  it("return an empty array if data is null", () => {
    // @ts-expect-error-next-line
    const data: Data = null;

    const result = sortBySessionStart(data);

    expect(result).toEqual([]);
  });

  it("return an empty array if data is undefined", () => {
    // @ts-expect-error-next-line
    const data: Data = undefined;

    const result = sortBySessionStart(data);

    expect(result).toEqual([]);
  });

  it("sort sessions by sessionStart date in ascending order", () => {
    const data: DataMap = {
      session1: {
        sessionStart: "1997-09-14T10:00:00Z",
        messages: [],
      },
      session3: {
        sessionStart: "1997-09-14T12:00:00Z",
        messages: [],
      },
      session2: {
        sessionStart: "1997-09-14T11:00:00Z",
        messages: [],
      },
    };

    const sorted = sortBySessionStart(data);

    expect(sorted).toEqual([
      { sessionStart: "1997-09-14T10:00:00Z", messages: [] },
      { sessionStart: "1997-09-14T11:00:00Z", messages: [] },
      { sessionStart: "1997-09-14T12:00:00Z", messages: [] },
    ]);
  });

  it("handle an empty data map", () => {
    const data: DataMap = {};

    const sorted = sortBySessionStart(data);

    expect(sorted).toEqual([]);
  });

  it("correctly handle data with a single session", () => {
    const data: DataMap = {
      session1: {
        sessionStart: "2021-09-01T10:00:00Z",
        messages: [],
      },
    };

    const sorted = sortBySessionStart(data);

    expect(sorted).toEqual([
      { sessionStart: "2021-09-01T10:00:00Z", messages: [] },
    ]);
  });

  it("handle invalid date format", () => {
    const data: DataMap = {
      session1: {
        sessionStart: "invalid-date",
        messages: [],
      },
      session2: {
        sessionStart: "2021-09-01T10:00:00Z",
        messages: [],
      },
    };

    const sorted = sortBySessionStart(data);

    expect(sorted).toEqual([
      { sessionStart: "invalid-date", messages: [] },
      { sessionStart: "2021-09-01T10:00:00Z", messages: [] },
    ]);
  });
});
