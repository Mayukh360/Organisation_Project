/**
 *@module enum
 *@global
 *@description <strong>Description : </strong><br>
 *<br><br>
 *Enum type for handling enum values in project.
 *<br><br>
 *<br>
 */
require('enum').register()


/**
 *@module global
 *@global
 *@description <strong>Description : </strong><br>
 *<br><br>
 *Globals for given project. containing variables, enums etc..
 *<br><br>
 *<br>
 */
require('./global')


/**
 *@name AppRootPath
 *@global
 *@description <strong>Description : </strong><br>
 *<br>
 *Sets ./ directory as project root. and after this you can
 *use this module for getting project root from any depth.<br>
 *this module uses package.json for guessing
 *root path. for more view app-root-path repository.
 *
 *<br><br>
 *<strong>npm</strong> : [app-root-path]{@link https://www.npmjs.com/package/app-root-path}
 *@example
 *# Load module by requiring or importing.
 *import root from "app-root-path"
 *...
 *let _rootPath = root.path // ./project/root/path
 *...
 */
require('app-root-path').setPath('./')


/**
 *@name GraphqlImport
 *@global
 *@description <strong>Description : </strong><br>
 *<br>
 *allows import command in .graphql files
 *for extending graphs. for use cases please visit repository.
 *<br><br>
 *<strong>npm</strong> : [graphql-import-node]{@link https://www.npmjs.com/package/graphql-import-node}
 *@example
 *# Load module by requiring or importing.
 *import "other.graphql"
 *...
 *type Other {
 *field1: Type!
 *field2: Type
 *field3: [Type!]
 *field4: [Type]!
 *field5: [Type!]!
 *}
 *...
 */
require('graphql-import-node/register')


/**
 *@module www
 *@global
 *@description <strong>Description : </strong><br>
 *<br><br>
 *Graphql Server based on yoga Maps.
 *<br><br>
 *<br>
 */
require(require('path').resolve(__dirname, './packages/www/http/'))
