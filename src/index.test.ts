/**
 * (C) Johnson Controls, Inc. 2020.
 *     Use or copying of all or any part of this program, except as
 *     permitted in writing by Johnson Controls, is prohibited.
 */

describe("index", () => {
    let subject: typeof import("./index");

    beforeEach(() => {
        jest.resetModules();
        subject = require("./index");
    });

    it("sample demonstration test", () => {
        expect(subject.getTheName()).toEqual("dev-lunch-1");
    });
});
