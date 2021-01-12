/**
 * (C) Johnson Controls, Inc. 2020.
 *     Use or copying of all or any part of this program, except as
 *     permitted in writing by Johnson Controls, is prohibited.
 */

/**
 * NOTE: This file is not managed by webpack and hot module reloading. Changes to this file
 * can only be realized via a manual page refresh.
 */
function init() {
    alert("init");
    alert(TypescriptTemplate.getName());
}

document.addEventListener("DOMContentLoaded", () => {
    init();
});
