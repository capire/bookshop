const serve = require ('./serve')
module.exports = Object.assign (
    cds_run, serve, {help: `
# SYNOPSIS

    *cds run* [<project>] [<options>]

    Runs 'cds serve all' for the specified project, with default <project> = cwd.

# OPTIONS

    - see _cds help serve_

# SEE ALSO

    Actually, *cds run* is just a convenient shortcut for:
    *cds serve* [--project <project>] [<options>] ...
    Check out *cds serve --help* to learn more.

`})

function cds_run (projects, options) {
    return serve (projects,{ project:true, ...options })
}
