# meteor-bug
Found a meteor bug that occurs on a deployed, minified project to remote server. Narrowed down code base to look through in order to solve



STEPS TO REPRODUCE:

1. Deploy minified project to meteor remote server
2. Try going to a url like: "/app/1234" to trigger the route in question
3. Look at the browser console to see the weird "'t' already exists" error produced only when the project is deployed minified (i.e. without the --debug option)


NOTE: You will notice lots of weird structuring of things in the project such as "|| true" or a line that looks like it doesnt do anything.
Almost every line in the project needs to be there as far as I can tell to reproduce the bug. Even changing the names of the meteor methods being called to something else (regardless of it existing or not) will cause the error to fix itself.


