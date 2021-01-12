# typescript-template

An opinionated template serving as a starting point for new TypeScript libraries or web applications. Takes advantage of a number of libraries to control process and CI/CD.

# Opinions

-   uses Jest for unit testing

-   uses Husky to enforce linting and unit testing on commits and pushes

-   uses eslint and prettier to enforce coding standards

-   uses webpack, babel, and typescript to create udm and esm outputs

-   uses commit linting

-   uses automated semantic versioning that infers product version based on commit lint history

-   uses GitHub Actions to control testing, building, and package deployment all on GitHub

# How to Use

In order to use this template, a few files will need to be changed to match the name of your project. Here is what you need to do:

-   Search for and replace the following terms as appropriate: "typescript-template" and "typescriptTemplate"

-   Search for bdsanfelippo and replace it with your organization (likely johnsoncontrols).

-   Replace YOUR-REPOSITORY-NAME and the corresponding high level description in this readme file.

-   Update the list of Owners in this readme file.

-   Update the Consumer and Developer Readme files as appropriate.

-   Uncomment the semantic-versioning line in ./github/build.yml

-   This template is best complemented by two GitHub Apps: Commit Lint and Semantic Pull Reqeusts. Unfortunately, when using a template with these apps, the apps are not transferred to the new repo. You will need to install them manually.

-   DELETE THIS LINE AND ALL ABOVE IT

# [YOUR-REPOSITORY-NAME]

Enter your high level repository description

# Owners

Please contact the following individuals if you need access to this repository:

-   Ben Sanfelippo - @bdsanfelippo

# Consumer Readme

If you plan to consume this repository in your project, view the [Consumer Readme](./readme/consumer.md)

# Developer Readme

If you plan to develop in this repository, view the [Developer Readme](./readme/developer.md)
