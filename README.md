# Bb-hubspot-datasource
This is a readme for your new Budibase plugin.

# Description
API datasource connector for HubSpot.
Allows for connection direct to HubSpot API for standard CRUD operations on contacts, companies and deals. Had issues with the standrd Rest API connector when it came to POST and PATCH requests, so generated this. There are still some not ideal things to make it work, but it now allows for me to create and update records pretty easily.

Find out more about [Budibase](https://github.com/Budibase/budibase).

## Instructions

To build your new  plugin run the following in your Budibase CLI:
```
budi plugins --build
```

You can also re-build everytime you make a change to your plugin with the command:
```
budi plugins --watch
```

