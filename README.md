# Atrium CMDB Explorer App

This is a simple NodeJS Application build to consume some Atrium CMDB RestAPI services to produce higher level RestAPI. (Query Instance - Query Relationship) . The App display Configuration Items and Relationship on graphs .


##Architecture :

**Data Layer :** An ARServer platform providing RestAPI services. (Atrium CMDB API is called by the App).

**Application Layer :** A NodeJS App , consuming CMDB Data to provide higher level RestAPI services displayed at the presentation layer (List of defined objects , attributes for these objects , tree relationship for an object with other objects)

**Presentation Layer :** AngularJS and VisJS to display data on Tables and Graphs.

##Usage

At Login page , fill fields with the IP Address/ServerName of the AR Server , port number for the RestAPI access , and user authentication in the AR Server platform. then navigate the app to display objects and relationship.
App can export data to CSV files (*Menu ‘Actions -> Export’*)

##Installation

Installation can easily be done in a standard BMC Remedy ITSM solution (version > 9.x) where Smart-IT is already installed.

Remedy 9 REST APIs needs to be enabled , please visit [https://docs.bmc.com/docs/display/public/ars91/Configuring+the+REST+API]().

Then download the ZIP file from this Github repository and extract it **[AppDir]**

node.js is already installed with Smart-IT. Please note the location **[NodeDir]**

Create a batch file containing the following line : *(replace with your dir locations)*
[NodeDir]\node.exe [AppDir]\bin\www

(A shell windows open with logs from the app)

You can now access the app from the url : **http://your-server:3000/**
