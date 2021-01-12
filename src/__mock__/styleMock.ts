/**
 * (C) Johnson Controls, Inc. 2020.
 *     Use or copying of all or any part of this program, except as
 *     permitted in writing by Johnson Controls, is prohibited.
 */

/**
 * styleMock.ts mocks out any styles that are directly imported into typescript files. It
 * is referenced in jest.config.js as the mock for all .scss and .css files.
 *
 * Unless there is a specific need, this file can just export an empty object. Unit tests
 * shouldn't need to mock styles as styles shouldn't be unit tested.
 */
export {};
