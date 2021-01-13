if (!process.argv[2]) {
    console.error("Error: missing argument for directory path.");
    process.exit(1);
}

var fs = require("fs");
var _ = require("lodash");
var Q = require("q");
var os = require("os");

var exitCode = 0;

var ENGLISH_FOLDER = "en-US";
var FILE_NAME = "client-dictionary.json";

var directoryPath = process.argv[2];
var localesPath = directoryPath + "/locales";
console.log("Will load client-dictionary.json files from: " + localesPath);
var reportFile = directoryPath + "/clientDictionaryReport.txt";

var englishClientDictionary;
var englishAnalysisReport = "";
var otherClientDictionaries = [];

function sortClientDictionary(clientDictionary) {
    var sortedKeys = _.sortBy(_.keys(clientDictionary), function (key) {
        return key;
    });

    var sortedClientDictionary = {};

    _.each(sortedKeys, function (key) {
        sortedClientDictionary[key] = clientDictionary[key];
    });

    return sortedClientDictionary;
}

/**
 * Loads the client dictionary found in the folder name specified. The promise will reject if
 * an error occurs reading the file for graceful error handling.
 * @param {string} folderName
 */
function loadClientDictionary(folderName) {
    return Q.Promise(function (resolve, reject) {
        var path = localesPath + "/" + folderName + "/" + FILE_NAME;

        fs.readFile(path, function (error, data) {
            if (error) {
                reject(error);
            }
            console.log("Read: " + path);
            resolve(data);
        });
    });
}

/**
 * This is a function to transform the text read from the client dictionary files
 * into a JSON object. It's been promisfied to allow for seamless error handling.
 * @param {string} data
 */
function transformToJSON(data) {
    return Q.Promise(function (resolve, reject) {
        try {
            var jsonData = JSON.parse(data);
            resolve(jsonData);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Saves a (sorted) client dictionary to file and adds the dictionary to
 * the proper dictionary array. This function has been promisfied to
 * handle the asynchronous behavior of writeFile.
 * @param {Object} clientDictionary
 * @param {string} folder
 */
function saveSortedClientDictionary(clientDictionary, folder) {
    return Q.Promise(function (resolve, reject) {
        var path = localesPath + "/" + folder + "/" + FILE_NAME;

        fs.writeFile(
            path,
            JSON.stringify(clientDictionary, null, 4) + os.EOL,
            function (error) {
                if (error) {
                    reject(error);
                }

                if (folder === ENGLISH_FOLDER) {
                    englishClientDictionary = clientDictionary;
                } else {
                    otherClientDictionaries.push({
                        name: folder,
                        content: clientDictionary,
                        analsysisReport: ""
                    });
                }
                console.log("Wrote: " + path);
                resolve();
            }
        );
    });
}

/**
 * This function loads a folder. This involves loading text from file, transforming the
 * text to an object, sorting, and resaving the file.
 * @param {string} folder
 */
function loadDictionary(folder) {
    return Q.Promise(function (resolve, reject) {
        return loadClientDictionary(folder)
            .then(function (data) {
                return transformToJSON(data);
            })
            .then(function (clientDictionary) {
                clientDictionary = sortClientDictionary(clientDictionary);
                return saveSortedClientDictionary(clientDictionary, folder);
            })
            .then(function () {
                resolve();
            })
            .catch(function () {
                reject(
                    new Error(
                        "Error: Syntax error in " +
                            folder +
                            "/" +
                            FILE_NAME +
                            " - Won't analyze"
                    )
                );
            });
    });
}

/**
 * Loads all client dictionaries in the localesPath directory. English is loaded first,
 * and if an error occurs while loading the english dictionary, the function to return
 * a rejected promise, preventing further action. Misformatted client dictionaries are
 * skipped, and allows the function to continue, but causing the process to eventually.
 * exit with error code 1.
 */
function loadClientDictionaries() {
    return Q.Promise(function (resolve, reject) {
        loadDictionary(ENGLISH_FOLDER)
            .then(function () {
                fs.readdir(localesPath, function (error, folders) {
                    var promises = [];

                    if (error) {
                        reject(
                            new Error(
                                "Error: unable to read locales directory."
                            )
                        );
                    }

                    folders.forEach(function (folderName) {
                        if (folderName !== ENGLISH_FOLDER) {
                            promises.push(loadDictionary(folderName));
                        }
                    });

                    Q.allSettled(promises).then(function (states) {
                        states.forEach(function (state) {
                            if (state.state === "rejected") {
                                console.error(state.reason.message);
                            }
                        });
                        resolve();
                    });
                });
            })
            .catch(function () {
                reject(
                    new Error(
                        "Error: Could not load English Dictionary... will abort"
                    )
                );
            });
    });
}

function checkEnglishForBlanks() {
    console.log("Analyze en-US for blank translations.");

    var blankKeys = [];
    for (var key in englishClientDictionary) {
        if (englishClientDictionary.hasOwnProperty(key)) {
            if (!englishClientDictionary[key]) {
                blankKeys.push(key);
            }
        }
    }

    englishAnalysisReport += "en-US report:\n";

    if (blankKeys.length) {
        englishAnalysisReport +=
            "\tBAD: The following keys contain no value for en-US/client-dictionary.json:";
        _.each(blankKeys, function (blankKey) {
            englishAnalysisReport += "\t\t" + blankKey;
        });
    } else {
        englishAnalysisReport +=
            "\tGOOD: There are no blank strings in en-US/clientdictionary.json\n";
    }
}

function compareClientDictionaryToEnglish(clientDictionary) {
    console.log("Analyze " + clientDictionary.name + " by comparing to en-US.");

    var englishCount = Object.keys(englishClientDictionary).length;
    var otherCount = Object.keys(clientDictionary.content).length;

    clientDictionary.analsysisReport += clientDictionary.name + " report:\n";

    if (otherCount > englishCount) {
        clientDictionary.analsysisReport +=
            "\t" +
            "POSSIBLY BAD: " +
            clientDictionary.name +
            "(" +
            otherCount +
            ")" +
            " has more values than en-US(" +
            englishCount +
            "). This indicates that " +
            clientDictionary.name +
            "/client-dictionary.json has unused strings.";
    } else if (otherCount < englishCount) {
        clientDictionary.analsysisReport +=
            "\t" +
            clientDictionary.name +
            "(" +
            otherCount +
            ")" +
            " has fewer values than en-US(" +
            englishCount +
            "). This indicates that " +
            clientDictionary.name +
            "/client-dictionary.json needs translating.";
    } else {
        clientDictionary.analsysisReport +=
            "\t" +
            clientDictionary.name +
            "(" +
            otherCount +
            ")" +
            " has the same number of values than en-US(" +
            englishCount +
            "). This indicates that " +
            clientDictionary.name +
            "/client-dictionary.json is fully translated.";
    }

    var blankKeys = [];
    var englishKeys = [];
    var extraKeys = [];

    for (var key in clientDictionary.content) {
        if (clientDictionary.content.hasOwnProperty(key)) {
            if (!clientDictionary.content[key]) {
                blankKeys.push(key);
            }
            if (!englishClientDictionary[key]) {
                extraKeys.push(key);
            } else if (
                clientDictionary.content[key] === englishClientDictionary[key]
            ) {
                englishKeys.push(key);
            }
        }
    }

    if (blankKeys.length) {
        clientDictionary.analsysisReport +=
            "\t" +
            "The following " +
            blankKeys.length +
            " keys have no translation in " +
            clientDictionary.name +
            ":\n";
        _.each(blankKeys, function (blankKey) {
            clientDictionary.analsysisReport +=
                "\t\t" +
                blankKey +
                "=" +
                clientDictionary.content[blankKey] +
                "\n";
        });
    }

    if (englishKeys.length) {
        clientDictionary.analsysisReport +=
            "\t" +
            "The following " +
            englishKeys.length +
            "  keys are translated the same way " +
            clientDictionary.name +
            " as they are in en-US:\n";
        _.each(englishKeys, function (englishKey) {
            clientDictionary.analsysisReport +=
                "\t\t" +
                englishKey +
                "=" +
                clientDictionary.content[englishKey] +
                "\n";
        });
    }

    if (extraKeys.length) {
        clientDictionary.analsysisReport +=
            "\t" +
            "The following " +
            extraKeys.length +
            " keys are extra. They exist in " +
            clientDictionary.name +
            " but not in en-US:\n";
        _.each(extraKeys, function (extraKey) {
            clientDictionary.analsysisReport +=
                "\t\t" +
                extraKey +
                "=" +
                clientDictionary.content[extraKey] +
                "\n";
        });
    }
}

function analyzeClientDictionaries() {
    return Q.Promise(function (resolve, reject) {
        checkEnglishForBlanks();

        _.each(otherClientDictionaries, function (clientDictionary) {
            compareClientDictionaryToEnglish(clientDictionary);
        });

        var report = englishAnalysisReport;
        _.each(otherClientDictionaries, function (clientDictionary) {
            report += "\n" + clientDictionary.analsysisReport;
        });

        console.log("Saving report to: " + reportFile);

        fs.writeFile(reportFile, report, function (error) {
            if (error) {
                reject(new Error("Error: unable to write report"));
            }
            resolve();
        });
    });
}

/**
 * Runs the client dictionary tool. If any client dictionary fails, the process with exit
 * with exit code 1. An error in the english dictionary will force the process to exit. An
 * error in other client dictionaries will allow the process to finish, while skipping the
 * bad client dictionaries.
 */
loadClientDictionaries()
    .then(function () {
        return analyzeClientDictionaries();
    })
    .catch(function (error) {
        console.error(error.message);
    })
    .finally(function () {
        process.exit(exitCode);
    });
